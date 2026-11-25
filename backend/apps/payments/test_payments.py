from decimal import Decimal
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.families.models import Family, FamilyRole, FamilyMembership
from apps.subscriptions.models import Plan, FamilySubscription, Invoice
from apps.subscriptions.services import seed_default_plans
from apps.payments.models import PaymentTransaction
from apps.payments.services import (
    initiate_subscription_checkout, process_payment_webhook
)


class PaymentAndCheckoutTests(TestCase):
    def setUp(self):
        seed_default_plans()
        self.owner = User.objects.create_user(
            email='payowner@kinkeep.com',
            password='SecurePassword123!',
            full_name='Payment Admin'
        )
        self.family = Family.objects.create(
            name='Payment Family Workspace',
            slug='pay-family',
            created_by=self.owner
        )
        role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.OWNER,
            defaults={'name': 'Family Owner', 'is_system': True}
        )
        FamilyMembership.objects.create(
            family=self.family,
            user=self.owner,
            role=role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.owner)

    def test_initiate_checkout_chapa(self):
        """Verifies initiating a checkout creates an initiated transaction with hosted checkout URL."""
        plan = Plan.objects.get(slug='family-roots')
        res = initiate_subscription_checkout(
            family=self.family,
            user=self.owner,
            plan=plan,
            provider_name='CHAPA'
        )

        self.assertIn('KK-TX-', res['reference'])
        self.assertEqual(res['currency'], 'ETB')
        self.assertIn('checkout.chapa.co', res['checkout_url'])

        # Verify persisted in database
        tx = PaymentTransaction.objects.get(reference=res['reference'])
        self.assertEqual(tx.status, PaymentTransaction.TransactionStatus.PENDING)
        self.assertEqual(tx.amount, Decimal('350.00'))

    def test_initiate_checkout_telebirr(self):
        """Verifies Telebirr initialization."""
        plan = Plan.objects.get(slug='dynasty-legacy')
        res = initiate_subscription_checkout(
            family=self.family,
            user=self.owner,
            plan=plan,
            provider_name='TELEBIRR'
        )
        self.assertEqual(res['provider'], 'TELEBIRR')
        self.assertIn('telebirr.et', res['checkout_url'])

    def test_webhook_processing_activates_subscription(self):
        """Validates that a verified webhook completes the transaction, creates an invoice, and activates subscription."""
        plan = Plan.objects.get(slug='family-roots')
        checkout = initiate_subscription_checkout(
            family=self.family,
            user=self.owner,
            plan=plan,
            provider_name='CHAPA'
        )
        ref = checkout['reference']

        # Simulate webhook callback from Chapa
        payload = {
            "event": "charge.success",
            "tx_ref": ref,
            "status": "success",
            "amount": "350.00",
            "currency": "ETB"
        }

        success, msg, details = process_payment_webhook(
            provider_name='CHAPA',
            raw_payload=b'{}',
            payload_dict=payload,
            headers={}
        )

        self.assertTrue(success)
        self.assertEqual(details['subscription_status'], 'ACTIVE')

        # Check transaction status
        tx = PaymentTransaction.objects.get(reference=ref)
        self.assertEqual(tx.status, PaymentTransaction.TransactionStatus.COMPLETED)
        self.assertIsNotNone(tx.completed_at)

        # Check subscription was activated
        self.family.refresh_from_db()
        self.assertTrue(self.family.subscription.is_active_subscription)
        self.assertEqual(self.family.subscription.plan.slug, 'family-roots')

        # Check Invoice generated
        self.assertEqual(self.family.invoices.count(), 1)
        invoice = self.family.invoices.first()
        self.assertEqual(invoice.status, Invoice.InvoiceStatus.PAID)
        self.assertEqual(invoice.amount, Decimal('350.00'))

    def test_idempotent_duplicate_webhook_prevention(self):
        """Ensures that repeated webhook deliveries do not duplicate invoices or charges."""
        plan = Plan.objects.get(slug='family-roots')
        checkout = initiate_subscription_checkout(
            family=self.family,
            user=self.owner,
            plan=plan,
            provider_name='CHAPA'
        )
        ref = checkout['reference']
        payload = {"tx_ref": ref, "status": "success"}

        # First call
        success1, _, _ = process_payment_webhook('CHAPA', b'', payload, {})
        self.assertTrue(success1)
        self.assertEqual(self.family.invoices.count(), 1)

        # Duplicate delivery
        success2, msg2, _ = process_payment_webhook('CHAPA', b'', payload, {})
        self.assertTrue(success2)
        self.assertIn("idempotently", msg2)
        self.assertEqual(self.family.invoices.count(), 1) # Still exactly 1 invoice!
