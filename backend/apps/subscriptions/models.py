import uuid
from decimal import Decimal
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from apps.families.models import Family


class Plan(models.Model):
    """
    Subscription tier defining storage quota, member ceilings, and feature entitlements.
    Stored dynamically in PostgreSQL to allow business tier changes without code deploys.
    """
    class BillingInterval(models.TextChoices):
        MONTHLY = 'MONTHLY', _('Monthly')
        ANNUAL = 'ANNUAL', _('Annual')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    tagline = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')

    price_etb = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    price_usd = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    billing_interval = models.CharField(
        max_length=20, choices=BillingInterval.choices, default=BillingInterval.MONTHLY
    )

    storage_limit_bytes = models.BigIntegerField(
        default=5 * 1024 * 1024 * 1024, # 5 GB
        help_text=_("Total workspace media vault storage allowance in bytes.")
    )
    member_limit = models.PositiveIntegerField(
        default=10,
        help_text=_("Maximum family members allowed in workspace.")
    )

    features = models.JSONField(
        default=dict,
        blank=True,
        help_text=_("Dict of feature flags, e.g. {'audio_stories': true, 'qr_uploads': true, 'high_res_export': true}")
    )
    badge = models.CharField(max_length=50, blank=True, default='')
    is_active = models.BooleanField(default=True, db_index=True)
    sort_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'subscription_plans'
        ordering = ['sort_order', 'price_etb']

    def __str__(self):
        return f"{self.name} ({self.get_billing_interval_display()}) - {self.price_etb} ETB"

    @property
    def storage_limit_gb(self) -> float:
        return round(self.storage_limit_bytes / (1024 * 1024 * 1024), 1)


class FamilySubscription(models.Model):
    """
    Multi-tenant workspace subscription bound directly to Family.
    Every family workspace has exactly one active subscription state.
    """
    class SubscriptionStatus(models.TextChoices):
        TRIALING = 'TRIALING', _('Trialing')
        ACTIVE = 'ACTIVE', _('Active')
        PAST_DUE = 'PAST_DUE', _('Past Due')
        CANCELED = 'CANCELED', _('Canceled')
        EXPIRED = 'EXPIRED', _('Expired')

    class Currency(models.TextChoices):
        ETB = 'ETB', _('Ethiopian Birr (ETB)')
        USD = 'USD', _('US Dollar (USD)')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.OneToOneField(
        Family, on_delete=models.CASCADE, related_name='subscription'
    )
    plan = models.ForeignKey(
        Plan, on_delete=models.PROTECT, related_name='subscriptions'
    )

    status = models.CharField(
        max_length=20,
        choices=SubscriptionStatus.choices,
        default=SubscriptionStatus.ACTIVE,
        db_index=True
    )
    currency = models.CharField(
        max_length=10, choices=Currency.choices, default=Currency.ETB
    )

    current_period_start = models.DateTimeField(default=timezone.now)
    current_period_end = models.DateTimeField()

    cancel_at_period_end = models.BooleanField(default=False)
    canceled_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'family_subscriptions'

    def __str__(self):
        return f"{self.family.name} - {self.plan.name} ({self.status})"

    @property
    def is_active_subscription(self) -> bool:
        if self.status in [self.SubscriptionStatus.ACTIVE, self.SubscriptionStatus.TRIALING]:
            return self.current_period_end > timezone.now()
        return False

    @property
    def days_remaining(self) -> int:
        if self.current_period_end > timezone.now():
            return (self.current_period_end - timezone.now()).days
        return 0


class Invoice(models.Model):
    """
    Historical financial invoices generated upon successful subscription charges.
    """
    class InvoiceStatus(models.TextChoices):
        DRAFT = 'DRAFT', _('Draft')
        OPEN = 'OPEN', _('Open / Pending Payment')
        PAID = 'PAID', _('Paid')
        VOID = 'VOID', _('Void')
        UNCOLLECTIBLE = 'UNCOLLECTIBLE', _('Uncollectible')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(
        Family, on_delete=models.CASCADE, related_name='invoices'
    )
    subscription = models.ForeignKey(
        FamilySubscription, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices'
    )

    invoice_number = models.CharField(max_length=64, unique=True, db_index=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='ETB')
    status = models.CharField(
        max_length=20, choices=InvoiceStatus.choices, default=InvoiceStatus.PAID, db_index=True
    )

    paid_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    billing_period_start = models.DateTimeField(null=True, blank=True)
    billing_period_end = models.DateTimeField(null=True, blank=True)

    line_items = models.JSONField(
        default=list,
        blank=True,
        help_text=_("List of line items: [{'description': 'Family Roots Plan (Monthly)', 'amount': 450.00}]")
    )
    pdf_url = models.CharField(max_length=500, blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'subscription_invoices'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.invoice_number} - {self.family.name} ({self.amount} {self.currency})"
