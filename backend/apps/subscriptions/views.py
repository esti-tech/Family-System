from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.families.permissions import IsFamilyMember, IsFamilyAdmin
from apps.common.responses import success_response
from apps.subscriptions.models import Plan, FamilySubscription, Invoice
from apps.subscriptions.serializers import (
    PlanSerializer, FamilySubscriptionSerializer, InvoiceSerializer
)
from apps.subscriptions.services import (
    seed_default_plans, get_family_storage_summary
)


class PlanListView(APIView):
    """
    Public / Authenticated endpoint listing all available subscription plans
    with pricing in ETB and USD, storage allowances, and feature entitlements.
    """
    permission_classes = [permissions.AllowAny]

    @extend_schema(responses={200: PlanSerializer(many=True)})
    def get(self, request):
        plans = Plan.objects.filter(is_active=True).order_by('sort_order', 'price_etb')
        if not plans.exists():
            seed_default_plans()
            plans = Plan.objects.filter(is_active=True).order_by('sort_order', 'price_etb')
        return success_response(data=PlanSerializer(plans, many=True).data)


class FamilySubscriptionDetailView(APIView):
    """
    Returns current active subscription tier, billing period, and status for a family workspace.
    """
    permission_classes = [IsFamilyMember]

    @extend_schema(responses={200: FamilySubscriptionSerializer})
    def get(self, request, id=None, slug=None):
        family = request.family
        subscription = getattr(family, 'subscription', None)

        if not subscription:
            # Fall back to Free Heritage tier
            free_plan = Plan.objects.filter(slug='free-heritage').first()
            if not free_plan:
                seed_default_plans()
                free_plan = Plan.objects.filter(slug='free-heritage').first()

            return success_response(data={
                "id": None,
                "family_id": str(family.id),
                "plan": PlanSerializer(free_plan).data if free_plan else None,
                "status": "ACTIVE",
                "currency": "ETB",
                "days_remaining": 365,
                "is_active_subscription": True,
                "cancel_at_period_end": False
            })

        return success_response(data=FamilySubscriptionSerializer(subscription).data)


class FamilyStorageUsageView(APIView):
    """
    Provides real-time storage meter: bytes consumed, media breakdown, quota ceilings,
    and member limits. Used by billing gauges and upload validation gates.
    """
    permission_classes = [IsFamilyMember]

    def get(self, request, id=None, slug=None):
        family = request.family
        summary = get_family_storage_summary(family)
        return success_response(data=summary)


class FamilyInvoiceListView(APIView):
    """
    Returns historical billing statements and paid invoices for the family workspace.
    """
    permission_classes = [IsFamilyMember]

    @extend_schema(responses={200: InvoiceSerializer(many=True)})
    def get(self, request, id=None, slug=None):
        family = request.family
        invoices = family.invoices.all().order_by('-created_at')
        return success_response(data=InvoiceSerializer(invoices, many=True).data)


class FamilyCancelSubscriptionView(APIView):
    """
    Cancels workspace subscription renewal at the end of the current billing cycle.
    Does not delete existing data or cut off access immediately.
    """
    permission_classes = [IsFamilyAdmin]

    def post(self, request, id=None, slug=None):
        family = request.family
        subscription = getattr(family, 'subscription', None)
        if not subscription:
            return Response(
                {"success": False, "error": {"code": "NO_SUBSCRIPTION", "message": "No active subscription to cancel."}},
                status=status.HTTP_400_BAD_REQUEST
            )

        subscription.cancel_at_period_end = True
        subscription.save(update_fields=['cancel_at_period_end'])
        return success_response(message="Subscription renewal successfully cancelled for period end.")
