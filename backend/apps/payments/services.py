import uuid
import logging
from decimal import Decimal
from datetime import timedelta
from typing import Dict, Any, Tuple
from django.utils import timezone
from django.db import transaction

from apps.families.models import Family
from apps.subscriptions.models import Plan, FamilySubscription, Invoice
from apps.payments.models import PaymentTransaction
from apps.payments.providers import get_payment_provider

logger = logging.getLogger(__name__)


def initiate_subscription_checkout(
    family: Family,
    user: Any,
    plan: Plan,
    provider_name: str,
    return_url: str = "",
    callback_url: str = "",
) -> Dict[str, Any]:
    """
    Creates an initiated payment transaction and generates the hosted checkout URL
    via the requested provider adapter (Telebirr, Chapa, or Stripe).
    """
    provider_name = (provider_name or 'CHAPA').upper()

    # Determine currency & price based on provider
    if provider_name == 'STRIPE':
        currency = 'USD'
        amount = plan.price_usd
    else:
        currency = 'ETB'
        amount = plan.price_etb

    reference = f"KK-TX-{uuid.uuid4().hex[:12].upper()}"
    idempotency_key = f"IDEMP-{uuid.uuid4().hex}"

    # Default URLs if omitted
    if not return_url:
        return_url = f"http://localhost:3000/{family.slug}/billing?payment_status=success&ref={reference}"
    if not callback_url:
        callback_url = f"http://localhost:8000/api/v1/payments/webhooks/{provider_name.lower()}/"

    # 1. Create Transaction Ledger record in INITIATED state
    with transaction.atomic():
        payment_tx = PaymentTransaction.objects.create(
            family=family,
            user=user if user and user.is_authenticated else None,
            subscription=getattr(family, 'subscription', None),
            provider=provider_name,
            reference=reference,
            amount=amount,
            currency=currency,
            status=PaymentTransaction.TransactionStatus.INITIATED,
            idempotency_key=idempotency_key,
        )

        # 2. Call Provider adapter
        provider = get_payment_provider(provider_name)
        customer_email = user.email if user and hasattr(user, 'email') else "billing@kinkeep.family"
        customer_name = getattr(user, 'full_name', 'Family Subscriber')

        init_result = provider.initialize_transaction(
            reference=reference,
            amount=amount,
            currency=currency,
            customer_email=customer_email,
            customer_name=customer_name,
            return_url=return_url,
            callback_url=callback_url,
            metadata={"family_id": str(family.id), "plan_id": str(plan.id)}
        )

        payment_tx.checkout_url = init_result.get('checkout_url', '')
        payment_tx.provider_tx_id = init_result.get('provider_tx_id', '')
        payment_tx.status = PaymentTransaction.TransactionStatus.PENDING
        payment_tx.save(update_fields=['checkout_url', 'provider_tx_id', 'status'])

    return {
        "transaction_id": str(payment_tx.id),
        "reference": payment_tx.reference,
        "amount": str(payment_tx.amount),
        "currency": payment_tx.currency,
        "provider": payment_tx.provider,
        "checkout_url": payment_tx.checkout_url,
        "status": payment_tx.status,
    }


def process_payment_webhook(
    provider_name: str,
    raw_payload: bytes,
    payload_dict: Dict[str, Any],
    headers: Dict[str, str],
) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Cryptographically verifies and idempotently processes payment notifications from
    Chapa, Telebirr, or Stripe.
    Updates subscription status, creates invoices, and unlocks full storage limits.
    """
    provider = get_payment_provider(provider_name)

    # 1. Verify Cryptographic Signature
    is_valid_sig, sig_msg = provider.verify_webhook_signature(raw_payload, headers)
    if not is_valid_sig:
        logger.warning(f"Rejected unverified webhook from {provider_name}: {sig_msg}")
        return False, f"Signature verification failed: {sig_msg}", {}

    # 2. Extract Transaction Reference
    reference = (
        payload_dict.get('tx_ref') or
        payload_dict.get('outTradeNo') or
        payload_dict.get('client_reference_id') or
        payload_dict.get('reference') or
        (payload_dict.get('data', {}).get('tx_ref') if isinstance(payload_dict.get('data'), dict) else None)
    )

    if not reference:
        return False, "Missing transaction reference in webhook payload", {}

    payment_tx = PaymentTransaction.objects.filter(reference=reference).first()
    if not payment_tx:
        return False, f"Transaction '{reference}' not found", {}

    # 3. Idempotency Check: Prevent duplicate processing
    if payment_tx.status == PaymentTransaction.TransactionStatus.COMPLETED:
        logger.info(f"Transaction '{reference}' was already processed idempotently.")
        return True, "Already processed idempotently", {"reference": reference, "status": "COMPLETED"}

    # 4. Outbound Status Verification with Gateway
    is_verified, verify_msg, provider_details = provider.verify_transaction_status(
        reference=reference, provider_tx_id=payment_tx.provider_tx_id
    )

    if not is_verified:
        payment_tx.status = PaymentTransaction.TransactionStatus.FAILED
        payment_tx.error_message = verify_msg
        payment_tx.webhook_payload = payload_dict
        payment_tx.save(update_fields=['status', 'error_message', 'webhook_payload'])
        return False, f"Server verification failed: {verify_msg}", {}

    # 5. Atomic Completion & Subscription Activation
    with transaction.atomic():
        now = timezone.now()
        payment_tx.status = PaymentTransaction.TransactionStatus.COMPLETED
        payment_tx.completed_at = now
        payment_tx.webhook_payload = payload_dict
        payment_tx.save(update_fields=['status', 'completed_at', 'webhook_payload'])

        family = payment_tx.family

        # Find requested plan from metadata or fall back to Family Roots
        plan = None
        if hasattr(payment_tx, 'subscription') and payment_tx.subscription:
            plan = payment_tx.subscription.plan
        if not plan:
            plan = Plan.objects.filter(is_active=True).exclude(price_etb=0).first() or Plan.objects.first()

        period_duration = timedelta(days=365) if plan and plan.billing_interval == Plan.BillingInterval.ANNUAL else timedelta(days=30)
        period_end = now + period_duration

        # Update or create FamilySubscription
        subscription, _ = FamilySubscription.objects.update_or_create(
            family=family,
            defaults={
                'plan': plan,
                'status': FamilySubscription.SubscriptionStatus.ACTIVE,
                'currency': payment_tx.currency,
                'current_period_start': now,
                'current_period_end': period_end,
                'cancel_at_period_end': False,
                'canceled_at': None
            }
        )

        payment_tx.subscription = subscription
        payment_tx.save(update_fields=['subscription'])

        # Generate official Invoice
        invoice_number = f"INV-{now.year}-{uuid.uuid4().hex[:8].upper()}"
        invoice = Invoice.objects.create(
            family=family,
            subscription=subscription,
            invoice_number=invoice_number,
            amount=payment_tx.amount,
            currency=payment_tx.currency,
            status=Invoice.InvoiceStatus.PAID,
            paid_at=now,
            due_date=now,
            billing_period_start=now,
            billing_period_end=period_end,
            line_items=[{
                "description": f"{plan.name} Tier Subscription ({plan.get_billing_interval_display()})",
                "amount": float(payment_tx.amount),
                "storage_limit_gb": plan.storage_limit_gb,
                "member_limit": plan.member_limit
            }]
        )
        payment_tx.invoice = invoice
        payment_tx.save(update_fields=['invoice'])

        # Unlock workspace if it was in storage locked status
        if family.status == Family.FamilyStatus.LOCKED_STORAGE_FULL:
            family.status = Family.FamilyStatus.ACTIVE
            family.save(update_fields=['status'])

    return True, "Payment verified and subscription activated successfully", {
        "reference": reference,
        "invoice_number": invoice_number,
        "subscription_status": subscription.status,
        "plan_name": plan.name
    }
