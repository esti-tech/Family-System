from decimal import Decimal
from django.test import TestCase
from django.utils import timezone
from apps.accounts.models import User
from apps.families.models import Family, FamilyRole, FamilyMembership
from apps.subscriptions.models import Plan, FamilySubscription, Invoice
from apps.subscriptions.services import seed_default_plans, get_family_storage_summary


class SubscriptionTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            email='subowner@kinkeep.com',
            password='SecurePassword123!',
            full_name='Owner User'
        )
        self.family = Family.objects.create(
            name='Subscription Test Family',
            slug='sub-test-family',
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

    def test_seed_default_plans(self):
        """Validates that seed_default_plans creates the 4 standard tiers."""
        seed_default_plans()
        self.assertEqual(Plan.objects.count(), 4)
        roots = Plan.objects.get(slug='family-roots')
        self.assertEqual(roots.price_etb, Decimal('350.00'))
        self.assertEqual(roots.member_limit, 25)
        self.assertTrue(roots.features.get('qr_uploads'))

    def test_family_storage_summary_fallback_to_free(self):
        """Ensures that families without paid subscriptions default to Free tier limits."""
        seed_default_plans()
        summary = get_family_storage_summary(self.family)
        self.assertEqual(summary['plan_slug'], 'free-heritage')
        self.assertEqual(summary['storage_limit_gb'], 1.0)
        self.assertEqual(summary['active_members_count'], 1)
        self.assertFalse(summary['is_storage_full'])

    def test_family_storage_summary_with_active_subscription(self):
        """Validates quota metrics with paid subscription tier."""
        seed_default_plans()
        dynasty = Plan.objects.get(slug='dynasty-legacy')
        now = timezone.now()
        FamilySubscription.objects.create(
            family=self.family,
            plan=dynasty,
            status=FamilySubscription.SubscriptionStatus.ACTIVE,
            current_period_start=now,
            current_period_end=now + timezone.timedelta(days=30)
        )

        summary = get_family_storage_summary(self.family)
        self.assertEqual(summary['plan_slug'], 'dynasty-legacy')
        self.assertEqual(summary['storage_limit_gb'], 100.0)
        self.assertEqual(summary['member_limit'], 100)
        self.assertTrue(summary['features'].get('high_res_export'))
