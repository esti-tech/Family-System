from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User
from apps.accounts.services import generate_access_token
from apps.families.models import Family, FamilyMembership, FamilyRole
from apps.families.services import create_family_workspace, create_family_invitation

class MultiTenantWorkspaceTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create two distinct users
        self.user_a = User.objects.create_user(
            email="owner_a@example.com",
            password="Password123!",
            full_name="Abebe Bikila",
            status=User.AccountStatus.ACTIVE
        )
        self.user_b = User.objects.create_user(
            email="viewer_b@example.com",
            password="Password123!",
            full_name="Derartu Tulu",
            status=User.AccountStatus.ACTIVE
        )

        # User A creates Family A
        self.family_a = create_family_workspace(
            creator=self.user_a,
            name="The Bikila Family",
            description="Our family archive from Arsi",
            origin_city="Asella",
            origin_country="Ethiopia"
        )

        # Tokens
        self.token_a = generate_access_token(self.user_a)
        self.token_b = generate_access_token(self.user_b)

    def test_workspace_creation_assigns_owner_role(self):
        membership = FamilyMembership.objects.get(family=self.family_a, user=self.user_a)
        self.assertEqual(membership.role.code, FamilyRole.SystemRole.OWNER)
        self.assertEqual(membership.status, FamilyMembership.MembershipStatus.ACTIVE)

    def test_cross_tenant_isolation_forbidden(self):
        """User B attempts to access Family A's workspace details without membership."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_b}')
        url = reverse('family-detail', kwargs={'id': self.family_a.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_owner_can_access_workspace(self):
        """User A accesses their own workspace."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_a}')
        url = reverse('family-detail', kwargs={'id': self.family_a.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['name'], "The Bikila Family")

    def test_invitation_and_acceptance_workflow(self):
        """User A invites User B to Family A as Editor, and User B accepts."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_a}')
        invite_url = reverse('family-invitations', kwargs={'id': self.family_a.id})
        
        invite_resp = self.client.post(invite_url, {
            "email": "viewer_b@example.com",
            "role": FamilyRole.SystemRole.EDITOR
        }, format='json')
        self.assertEqual(invite_resp.status_code, status.HTTP_200_OK)
        raw_token = invite_resp.data['data']['invitation_token']

        # User B accepts the invitation
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_b}')
        accept_url = reverse('invitation-accept', kwargs={'token': raw_token})
        accept_resp = self.client.post(accept_url)
        self.assertEqual(accept_resp.status_code, status.HTTP_200_OK)

        # Now User B can access Family A
        detail_url = reverse('family-detail', kwargs={'id': self.family_a.id})
        access_resp = self.client.get(detail_url)
        self.assertEqual(access_resp.status_code, status.HTTP_200_OK)

        # Verify membership role is Editor
        membership_b = FamilyMembership.objects.get(family=self.family_a, user=self.user_b)
        self.assertEqual(membership_b.role.code, FamilyRole.SystemRole.EDITOR)

    def test_viewer_cannot_update_settings(self):
        """A user with VIEWER role cannot patch workspace settings."""
        # Add User B as viewer
        viewer_role = FamilyRole.objects.get(code=FamilyRole.SystemRole.VIEWER)
        FamilyMembership.objects.create(
            family=self.family_a,
            user=self.user_b,
            role=viewer_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_b}')
        patch_url = reverse('family-detail', kwargs={'id': self.family_a.id})
        response = self.client.patch(patch_url, {"name": "Hacked Family Name"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
