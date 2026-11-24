from datetime import timedelta
from django.utils import timezone
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.families.models import Family, FamilyRole, FamilyMembership
from apps.events.models import Event
from apps.guest_uploads.models import EventQRToken, GuestUploadSession
from apps.guest_uploads.services import generate_event_qr_token, hash_token
from apps.memories.models import Memory

User = get_user_model()


class GuestUploadTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.owner_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.OWNER, defaults={'name': 'Family Owner'}
        )
        self.user = User.objects.create_user(
            email='qr.host@kinkeep.com', password='Password123!', full_name='QR Host'
        )
        self.family = Family.objects.create(
            name='QR Test Family', slug='qr-test-family', created_by=self.user
        )
        self.membership = FamilyMembership.objects.create(
            family=self.family, user=self.user, role=self.owner_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )
        self.event = Event.objects.create(
            family=self.family,
            created_by=self.user,
            title='Grand Wedding Celebration',
            start_datetime=timezone.now() + timedelta(days=2),
            require_guest_upload_moderation=True
        )

        self.client.force_authenticate(user=self.user)

    def test_generate_cryptographic_qr_token(self):
        """Tests that QR tokens store SHA-256 hashes, not plaintext tokens."""
        url = f'/api/v1/families/{self.family.id}/events/{self.event.id}/qr-tokens/'
        payload = {'label': 'Table Tent 1 - VIP Tables', 'expires_in_days': 5, 'max_uploads': 200}
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        raw_token = res.data['data']['qr_token']
        self.assertTrue(raw_token.startswith("kinkeep_qr_"))

        # Verify database record stores the hash, NOT raw_token
        token_obj = EventQRToken.objects.get(id=res.data['data']['id'])
        self.assertNotEqual(token_obj.token_hash, raw_token)
        self.assertEqual(token_obj.token_hash, hash_token(raw_token))

    def test_inspect_public_qr_code(self):
        """Tests public unauthenticated inspection of a QR code."""
        _, raw_token = generate_event_qr_token(self.event, label='Reception Desk')

        # Public client (no authentication)
        public_client = APIClient()
        inspect_url = f'/api/v1/guest-uploads/public/qr/inspect/{raw_token}/'
        res = public_client.get(inspect_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['event_title'], 'Grand Wedding Celebration')
        self.assertEqual(res.data['data']['family_name'], 'QR Test Family')

    def test_guest_upload_session_and_upload(self):
        """Tests public guest session creation and media upload into quarantine queue."""
        _, raw_token = generate_event_qr_token(self.event, label='Dance Floor QR')

        public_client = APIClient()

        # 1. Start guest session
        session_url = '/api/v1/guest-uploads/public/sessions/start/'
        res_sess = public_client.post(session_url, {
            'qr_token': raw_token,
            'guest_nickname': 'Cousin Dawit'
        }, format='json')
        self.assertEqual(res_sess.status_code, status.HTTP_201_CREATED)
        session_token = res_sess.data['data']['session_token']

        # 2. Upload photo as guest
        upload_url = '/api/v1/guest-uploads/public/upload/'
        upload_payload = {
            'file_name': 'guest_dance_photo.jpg',
            'mime_type': 'image/jpeg',
            'file_size_bytes': 3 * 1024 * 1024,
            'caption': 'Dancing at the reception!'
        }
        res_upload = public_client.post(
            upload_url,
            upload_payload,
            format='json',
            HTTP_AUTHORIZATION=f'Bearer {session_token}'
        )
        self.assertEqual(res_upload.status_code, status.HTTP_201_CREATED)

        memory_id = res_upload.data['data']['memory_id']
        memory = Memory.objects.get(id=memory_id)

        # Must be in moderation quarantine because require_guest_upload_moderation is True
        self.assertEqual(memory.status, Memory.MemoryStatus.PENDING_REVIEW)
        self.assertEqual(memory.moderation_status, Memory.ModerationStatus.PENDING)
        self.assertTrue(memory.media_asset.is_quarantined)

    def test_revoked_or_expired_qr_token(self):
        """Tests that a revoked or expired QR token rejects session creation."""
        token_obj, raw_token = generate_event_qr_token(self.event, label='Temporary QR')
        token_obj.is_revoked = True
        token_obj.save()

        public_client = APIClient()
        session_url = '/api/v1/guest-uploads/public/sessions/start/'
        res = public_client.post(session_url, {'qr_token': raw_token}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("invalid or expired", res.data['error']['message'])
