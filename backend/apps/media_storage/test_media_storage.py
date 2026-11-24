from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.families.models import Family, FamilyRole, FamilyMembership
from apps.media_storage.models import MediaAsset
from apps.media_storage.services import (
    validate_file_specs, check_family_storage_quota, create_media_upload_intent
)

User = get_user_model()


class MediaStorageTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.owner_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.OWNER, defaults={'name': 'Family Owner'}
        )
        self.user = User.objects.create_user(
            email='media.tester@kinkeep.com', password='Password123!', full_name='Media Tester'
        )
        self.family = Family.objects.create(
            name='Media Test Family',
            slug='media-test-family',
            created_by=self.user,
            settings={'storage_limit_bytes': 100 * 1024 * 1024} # 100 MB test limit
        )
        self.membership = FamilyMembership.objects.create(
            family=self.family,
            user=self.user,
            role=self.owner_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )
        self.client.force_authenticate(user=self.user)

    def test_upload_validation_mime_and_size(self):
        """Tests rejection of invalid MIME types or excessive file sizes."""
        # Valid JPEG
        valid, _, media_type = validate_file_specs('image/jpeg', 5 * 1024 * 1024)
        self.assertTrue(valid)
        self.assertEqual(media_type, MediaAsset.MediaType.IMAGE)

        # Unsupported executable
        invalid_mime, err, _ = validate_file_specs('application/x-msdownload', 1024)
        self.assertFalse(invalid_mime)
        self.assertIn("Unsupported file type", err)

        # Excessive image size (> 50 MB)
        too_large, size_err, _ = validate_file_specs('image/png', 60 * 1024 * 1024)
        self.assertFalse(too_large)
        self.assertIn("exceeds maximum allowed", size_err)

    def test_quota_enforcement(self):
        """Tests that uploads exceeding workspace storage quota are rejected."""
        # Attempt to upload 120 MB when limit is 100 MB
        quota_ok, err = check_family_storage_quota(self.family, 120 * 1024 * 1024)
        self.assertFalse(quota_ok)
        self.assertIn("storage quota exceeded", err)

        # Upload 10 MB should pass
        quota_ok_small, _ = check_family_storage_quota(self.family, 10 * 1024 * 1024)
        self.assertTrue(quota_ok_small)

    def test_create_media_upload_intent(self):
        """Tests generating private object storage keys and metadata without storing raw bytes."""
        url = f'/api/v1/families/{self.family.id}/media/upload-intent/'
        payload = {
            'file_name': 'gondar_timkat_1972.jpeg',
            'mime_type': 'image/jpeg',
            'file_size_bytes': 2 * 1024 * 1024
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        data = res.data['data']
        self.assertIn("upload_url", data)
        self.assertIn("storage_key", data)
        self.assertTrue(data['storage_key'].startswith(f"families/{self.family.id}/media/"))
        self.assertEqual(data['media_type'], 'IMAGE')

        # Verify record in database
        asset = MediaAsset.objects.get(id=data['media_asset_id'])
        self.assertEqual(asset.file_name, 'gondar_timkat_1972.jpeg')
        self.assertEqual(asset.family, self.family)
