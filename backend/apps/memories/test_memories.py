from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.families.models import Family, FamilyRole, FamilyMembership
from apps.memories.models import Memory, Album, AlbumMemoryLink
from apps.genealogy.models import Person

User = get_user_model()


class MemoryTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.owner_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.OWNER, defaults={'name': 'Family Owner'}
        )
        self.user = User.objects.create_user(
            email='vault.curator@kinkeep.com', password='Password123!', full_name='Vault Curator'
        )
        self.family = Family.objects.create(
            name='Bekele Vault Family', slug='bekele-vault-family', created_by=self.user
        )
        self.membership = FamilyMembership.objects.create(
            family=self.family, user=self.user, role=self.owner_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        self.client.force_authenticate(user=self.user)

    def test_create_memory_in_vault(self):
        """Tests adding a verified photograph to the family vault with person tagging."""
        person = Person.objects.create(family=self.family, first_name='Aster', father_name='Gebre')

        url = f'/api/v1/families/{self.family.id}/memories/'
        payload = {
            'title': 'Aster at the Axum Harvest',
            'description': 'Historical photograph in traditional embroidered dress.',
            'media_type': 'IMAGE',
            'media_url': 'https://storage.kinkeep.com/vault/aster_harvest.jpg',
            'thumbnail_url': 'https://storage.kinkeep.com/thumbnails/aster_harvest.webp',
            'taken_year': 1965,
            'taken_at_is_approximate': True,
            'location_name': 'Axum, Tigray',
            'linked_person_ids': [str(person.id)]
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['data']['title'], payload['title'])
        self.assertEqual(len(res.data['data']['linked_persons']), 1)

    def test_create_album_and_add_memories_without_duplication(self):
        """Tests creating an album and adding existing memories without duplicating files."""
        m1 = Memory.objects.create(
            family=self.family, created_by=self.user,
            title='Wedding Step 1', media_type='IMAGE',
            media_url='https://storage.kinkeep.com/m1.jpg'
        )
        m2 = Memory.objects.create(
            family=self.family, created_by=self.user,
            title='Wedding Step 2', media_type='IMAGE',
            media_url='https://storage.kinkeep.com/m2.jpg'
        )

        # Create album
        album_url = f'/api/v1/families/{self.family.id}/albums/'
        res_album = self.client.post(album_url, {
            'title': 'Wedding Commemoration Album',
            'description': 'Chronicle of the 1988 celebration in Addis Ababa.',
            'initial_memory_ids': [str(m1.id)]
        }, format='json')
        self.assertEqual(res_album.status_code, status.HTTP_201_CREATED)
        album_id = res_album.data['data']['id']

        # Add second memory without duplicating file
        add_url = f'/api/v1/families/{self.family.id}/albums/{album_id}/add-memories/'
        res_add = self.client.post(add_url, {'memory_ids': [str(m2.id)]}, format='json')
        self.assertEqual(res_add.status_code, status.HTTP_200_OK)

        # Inspect album
        detail_url = f'/api/v1/families/{self.family.id}/albums/{album_id}/'
        res_detail = self.client.get(detail_url)
        self.assertEqual(len(res_detail.data['data']['memories']), 2)

    def test_trash_and_restore_memory(self):
        """Tests moving memory to trash, inspecting trash, and restoring."""
        m = Memory.objects.create(
            family=self.family, created_by=self.user,
            title='Accidental Duplicate Photo', media_type='IMAGE',
            media_url='https://storage.kinkeep.com/dup.jpg',
            status=Memory.MemoryStatus.PUBLISHED
        )

        # Move to trash
        del_url = f'/api/v1/families/{self.family.id}/memories/{m.id}/'
        res_del = self.client.delete(del_url)
        self.assertEqual(res_del.status_code, status.HTTP_200_OK)

        m.refresh_from_db()
        self.assertEqual(m.status, Memory.MemoryStatus.TRASHED)

        # Restore from trash
        restore_url = f'/api/v1/families/{self.family.id}/memories/trash/{m.id}/restore/'
        res_restore = self.client.post(restore_url)
        self.assertEqual(res_restore.status_code, status.HTTP_200_OK)

        m.refresh_from_db()
        self.assertEqual(m.status, Memory.MemoryStatus.PUBLISHED)

    def test_moderation_queue_workflow(self):
        """Tests reviewing and approving unmoderated guest uploads."""
        unreviewed = Memory.objects.create(
            family=self.family,
            title='Guest Photo from Reception',
            media_type='IMAGE',
            media_url='https://storage.kinkeep.com/guest_upload.jpg',
            status=Memory.MemoryStatus.PENDING_REVIEW,
            moderation_status=Memory.ModerationStatus.PENDING
        )

        # Inspect moderation queue
        mod_queue_url = f'/api/v1/families/{self.family.id}/memories/moderation/'
        res_queue = self.client.get(mod_queue_url)
        self.assertEqual(res_queue.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_queue.data['data']), 1)

        # Approve memory
        action_url = f'/api/v1/families/{self.family.id}/memories/moderation/{unreviewed.id}/'
        res_approve = self.client.post(action_url, {'action': 'APPROVE', 'notes': 'Verified guest photo'}, format='json')
        self.assertEqual(res_approve.status_code, status.HTTP_200_OK)

        unreviewed.refresh_from_db()
        self.assertEqual(unreviewed.status, Memory.MemoryStatus.PUBLISHED)
        self.assertEqual(unreviewed.moderation_status, Memory.ModerationStatus.APPROVED)
