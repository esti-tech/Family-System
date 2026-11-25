import json
import logging
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.families.permissions import IsFamilyMember, IsFamilyAdmin
from apps.common.responses import success_response
from apps.subscriptions.models import Plan
from apps.payments.models import PaymentTransaction
from apps.payments.serializers import (
    CheckoutInitiateSerializer, PaymentTransactionSerializer
)
from apps.payments.services import (
    initiate_subscription_checkout, process_payment_webhook
)
from apps.payments.providers import get_payment_provider

logger = logging.getLogger(__name__)


class CheckoutInitiateView(APIView):
    """
    Initializes a payment transaction and returns a secure hosted checkout URL
    for Telebirr, Chapa, or Stripe.
    Protected by family admin permissions.
    """
    permission_classes = [IsFamilyAdmin]

    @extend_schema(request=CheckoutInitiateSerializer)
    def post(self, request, id=None, slug=None):
        family = request.family
        serializer = CheckoutInitiateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        plan_slug = serializer.validated_data['plan_slug']
        provider_name = serializer.validated_data['provider']
        return_url = serializer.validated_data.get('return_url', '')
        cancel_url = serializer.validated_data.get('cancel_url', '')

        # Lookup plan
        plan = Plan.objects.filter(slug=plan_slug, is_active=True).first()
        if not plan:
            return Response(
                {"success": False, "error": {"code": "PLAN_NOT_FOUND", "message": f"Plan '{plan_slug}' does not exist or is inactive."}},
                status=status.HTTP_404_NOT_FOUND
            )

        checkout_data = initiate_subscription_checkout(
            family=family,
            user=request.user,
            plan=plan,
            provider_name=provider_name,
            return_url=return_url,
            callback_url=cancel_url
        )

        return success_response(
            data=checkout_data,
            message=f"Checkout initiated successfully via {provider_name}."
        )


class PaymentTransactionListView(APIView):
    """
    Lists ledger history of all payment transactions for the family workspace.
    """
    permission_classes = [IsFamilyMember]

    @extend_schema(responses={200: PaymentTransactionSerializer(many=True)})
    def get(self, request, id=None, slug=None):
        family = request.family
        transactions = family.payment_transactions.all().order_by('-created_at')
        return success_response(data=PaymentTransactionSerializer(transactions, many=True).data)


class PaymentWebhookView(APIView):
    """
    Public unauthenticated callback endpoint receiving payment events from
    Telebirr, Chapa, and Stripe.
    Enforces signature verification, duplicate callback idempotency, and server-side status checks.
    """
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, provider):
        provider_name = provider.upper()
        raw_payload = request.body
        headers = dict(request.headers)

        try:
            payload_dict = json.loads(raw_payload.decode('utf-8')) if raw_payload else {}
        except Exception:
            payload_dict = dict(request.data)

        success, msg, details = process_payment_webhook(
            provider_name=provider_name,
            raw_payload=raw_payload,
            payload_dict=payload_dict,
            headers=headers
        )

        if not success:
            logger.warning(f"Payment webhook failed for {provider_name}: {msg}")
            return Response(
                {"status": "error", "message": msg},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"status": "success", "message": msg, "data": details},
            status=status.HTTP_200_OK
        )


class VerifyPaymentStatusView(APIView):
    """
    Invoked when customer returns from payment redirect to verify real-time status.
    Performs server-side status inquiry and activates subscription upon verification.
    """
    permission_classes = [IsFamilyMember]

    def post(self, request, id=None, slug=None):
        family = request.family
        reference = request.data.get('reference')
        if not reference:
            return Response(
                {"success": False, "error": {"code": "MISSING_PARAM", "message": "Reference is required."}},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_tx = PaymentTransaction.objects.filter(family=family, reference=reference).first()
        if not payment_tx:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Transaction not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        if payment_tx.status == PaymentTransaction.TransactionStatus.COMPLETED:
            return success_response(data=PaymentTransactionSerializer(payment_tx).data, message="Payment already verified and completed.")

        # Outbound query with provider
        provider = get_payment_provider(payment_tx.provider)
        is_verified, msg, data = provider.verify_transaction_status(
            reference=payment_tx.reference, provider_tx_id=payment_tx.provider_tx_id
        )

        if is_verified:
            # Process completion
            process_payment_webhook(
                provider_name=payment_tx.provider,
                raw_payload=b"",
                payload_dict={"tx_ref": payment_tx.reference},
                headers={}
            )
            payment_tx.refresh_from_db()

        return success_response(data=PaymentTransactionSerializer(payment_tx).data)
