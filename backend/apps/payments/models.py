import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from apps.families.models import Family
from apps.subscriptions.models import FamilySubscription, Invoice


class PaymentTransaction(models.Model):
    """
    Immutable ledger record for every financial transaction on KinKeep.
    Tracks state machine from initiation to verified completion via server-side verification.
    """
    class PaymentProvider(models.TextChoices):
        TELEBIRR = 'TELEBIRR', _('Telebirr (Ethio Telecom Mobile Money)')
        CHAPA = 'CHAPA', _('Chapa (Ethiopian Payment Gateway - CBEBirr, Cards, Awash)')
        STRIPE = 'STRIPE', _('Stripe (International Cards & Apple Pay)')
        BANK_TRANSFER = 'BANK_TRANSFER', _('Bank Transfer (CBE / Dashen / Awash)')

    class TransactionStatus(models.TextChoices):
        INITIATED = 'INITIATED', _('Initiated')
        PENDING = 'PENDING', _('Pending Customer Authorization')
        COMPLETED = 'COMPLETED', _('Completed & Server-Verified')
        FAILED = 'FAILED', _('Failed')
        REFUNDED = 'REFUNDED', _('Refunded')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(
        Family, on_delete=models.CASCADE, related_name='payment_transactions'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='payment_transactions'
    )
    subscription = models.ForeignKey(
        FamilySubscription, on_delete=models.SET_NULL, null=True, blank=True, related_name='payment_transactions'
    )
    invoice = models.ForeignKey(
        Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name='payment_transactions'
    )

    provider = models.CharField(
        max_length=30, choices=PaymentProvider.choices, default=PaymentProvider.CHAPA, db_index=True
    )
    reference = models.CharField(
        max_length=100, unique=True, db_index=True,
        help_text=_("Unique KinKeep internal merchant transaction reference (KK-TX-...).")
    )
    provider_tx_id = models.CharField(
        max_length=200, blank=True, default='', db_index=True,
        help_text=_("Provider's external reference/order ID returned by Telebirr, Chapa, or Stripe.")
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='ETB')
    status = models.CharField(
        max_length=20, choices=TransactionStatus.choices, default=TransactionStatus.INITIATED, db_index=True
    )

    payment_method_type = models.CharField(max_length=50, blank=True, default='')
    idempotency_key = models.CharField(
        max_length=128, unique=True, db_index=True,
        help_text=_("Guarantees duplicate callbacks or retries are processed exactly once.")
    )
    checkout_url = models.CharField(max_length=500, blank=True, default='')
    webhook_payload = models.JSONField(default=dict, blank=True)
    error_message = models.TextField(blank=True, default='')

    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payment_transactions'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference} ({self.provider}) - {self.amount} {self.currency} [{self.status}]"
