from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User
from apps.families.models import Family, FamilyRole, FamilyMembership
from apps.audit.models import AuditLog


class PlatformSuperAdminTests(TestCase):
    def setUp(self):
        # Regular family owner
        self.regular_user = User.objects.create_user(
            email='regular@kinkeep.com',
            password='SecurePassword123!',
            full_name='Regular Owner'
        )
        self.family = Family.objects.create(
            name='Test Family',
            slug='test-family',
            created_by=self.regular_user
        )
        role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.OWNER,
            defaults={'name': 'Family Owner', 'is_system': True}
        )
        FamilyMembership.objects.create(
            family=self.family,
            user=self.regular_user,
            role=role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        # Platform Super Admin
        self.admin_user = User.objects.create_user(
            email='admin@kinkeep.platform',
            password='AdminPassword123!',
            full_name='Super Admin',
            is_staff=True,
            is_superuser=True
        )

        self.client = APIClient()

    def test_non_admin_cannot_access_platform_admin(self):
        """Family Owners / Admins have NO platform-level administrative privileges."""
        self.client.force_authenticate(user=self.regular_user)
        res = self.client.get('/api/v1/platform-admin/dashboard/')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        res_users = self.client.get('/api/v1/platform-admin/users/')
        self.assertEqual(res_users.status_code, status.HTTP_403_FORBIDDEN)

    def test_platform_admin_can_access_dashboard_stats(self):
        """Super Admin receives real business analytics."""
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get('/api/v1/platform-admin/dashboard/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()['data']
        self.assertIn('metrics', data)
        self.assertGreaterEqual(data['metrics']['total_users'], 2)
        self.assertGreaterEqual(data['metrics']['total_families'], 1)

    def test_admin_suspend_user_creates_audit_log(self):
        """Suspending a user marks status SUSPENDED and generates an immutable AuditLog."""
        self.client.force_authenticate(user=self.admin_user)
        suspend_url = f'/api/v1/platform-admin/users/{self.regular_user.id}/suspend/'
        res = self.client.post(suspend_url, {'reason': 'Violation of Terms'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Check User status
        self.regular_user.refresh_from_db()
        self.assertEqual(self.regular_user.status, User.AccountStatus.SUSPENDED)

        # Check Audit Log
        log = AuditLog.objects.filter(target_id=str(self.regular_user.id)).first()
        self.assertIsNotNone(log)
        self.assertEqual(log.action, AuditLog.ActionCategory.USER_SUSPEND)
        self.assertEqual(log.actor_email, self.admin_user.email)
        self.assertEqual(log.details.get('reason'), 'Violation of Terms')

    def test_admin_workspace_status_change_creates_audit_log(self):
        """Altering workspace status creates an audit trail entry."""
        self.client.force_authenticate(user=self.admin_user)
        status_url = f'/api/v1/platform-admin/workspaces/{self.family.id}/status/'
        res = self.client.post(status_url, {'status': 'SUSPENDED'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.family.refresh_from_db()
        self.assertEqual(self.family.status, Family.FamilyStatus.SUSPENDED)

        log = AuditLog.objects.filter(target_id=str(self.family.id)).first()
        self.assertIsNotNone(log)
        self.assertEqual(log.action, AuditLog.ActionCategory.WORKSPACE_STATUS_CHANGE)
        self.assertEqual(log.details.get('new_status'), 'SUSPENDED')
