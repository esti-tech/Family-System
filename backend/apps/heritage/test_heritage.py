from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.families.models import Family, FamilyRole, FamilyMembership
from apps.genealogy.models import Person
from apps.heritage.models import Story, StoryPersonLink, TimelineMilestone

User = get_user_model()


class HeritageTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Roles
        self.owner_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.OWNER, defaults={'name': 'Family Owner'}
        )
        self.admin_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.ADMIN, defaults={'name': 'Family Admin'}
        )
        self.editor_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.EDITOR, defaults={'name': 'Family Editor'}
        )
        self.viewer_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.VIEWER, defaults={'name': 'Family Viewer'}
        )

        # Primary Family Workspace
        self.user = User.objects.create_user(
            email='heritage.author@kinkeep.com',
            password='Password123!',
            full_name='Heritage Author'
        )
        self.family = Family.objects.create(
            name='Bekele Heritage Workspace',
            slug='bekele-family',
            origin_city='Gondar',
            origin_country='Ethiopia',
            created_by=self.user
        )
        self.membership = FamilyMembership.objects.create(
            family=self.family,
            user=self.user,
            role=self.editor_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        # Second User in same family (viewer)
        self.viewer_user = User.objects.create_user(
            email='viewer@kinkeep.com',
            password='Password123!',
            full_name='Family Viewer'
        )
        self.viewer_membership = FamilyMembership.objects.create(
            family=self.family,
            user=self.viewer_user,
            role=self.viewer_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        # Foreign Family for Tenant Isolation
        self.other_user = User.objects.create_user(
            email='other@kinkeep.com',
            password='Password123!',
            full_name='Other Family User'
        )
        self.other_family = Family.objects.create(
            name='Foreign Family',
            slug='foreign-family',
            created_by=self.other_user
        )
        self.other_membership = FamilyMembership.objects.create(
            family=self.other_family,
            user=self.other_user,
            role=self.owner_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        self.client.force_authenticate(user=self.user)

    def test_create_story_draft(self):
        """Tests creating a story draft with multilingual titles and audio narrative details."""
        url = f'/api/v1/families/{self.family.id}/stories/'
        payload = {
            'title': 'The Sunday Morning Coffee Ceremony in Gondar',
            'title_amharic': 'የጎንደር የጠዋት ቡና ማፍላት ሥነ-ሥርዓት',
            'narrator_name': 'Aster Gebre Mariam',
            'summary': 'Oral tradition documenting the Abol, Tona, and Baraka coffee roasting ritual.',
            'content': 'Every Sunday at dawn, frankincense was lit in the hearth...',
            'category': 'TRADITION',
            'era': 'Begemder Era (1960s)',
            'event_year': 1968,
            'audio_url': 'https://storage.kinkeep.com/audio/coffee_ceremony.mp3',
            'audio_duration_seconds': 840,
            'status': 'DRAFT'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['data']['title'], payload['title'])
        self.assertEqual(res.data['data']['status'], 'DRAFT')

    def test_publish_story(self):
        """Tests publishing a story draft."""
        story = Story.objects.create(
            family=self.family, author=self.user,
            title='Journey Across the Blue Nile Gorge',
            content='We traveled on foot across the gorge in 1974...',
            status=Story.StoryStatus.DRAFT
        )
        url = f'/api/v1/families/{self.family.id}/stories/{story.id}/publish/'
        res = self.client.post(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        story.refresh_from_db()
        self.assertEqual(story.status, Story.StoryStatus.PUBLISHED)
        self.assertIsNotNone(story.published_at)

    def test_link_story_to_multiple_persons(self):
        """Tests linking a story to multiple genealogical Person nodes."""
        p1 = Person.objects.create(family=self.family, first_name='Elias', father_name='Bekele')
        p2 = Person.objects.create(family=self.family, first_name='Aster', father_name='Gebre')

        url = f'/api/v1/families/{self.family.id}/stories/'
        payload = {
            'title': 'Founding the Merchant Guild in Gondar',
            'content': 'Elias and Aster established their trade house together...',
            'status': 'PUBLISHED',
            'linked_person_ids': [str(p1.id), str(p2.id)]
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        story_id = res.data['data']['id']
        story = Story.objects.get(id=story_id)
        self.assertEqual(story.linked_persons.count(), 2)

    def test_story_filtering_and_search(self):
        """Tests search by title, narrator, and category filtering."""
        Story.objects.create(
            family=self.family, author=self.user,
            title='Oral History of the Axum Monoliths',
            content='Narrated by grandfather...',
            narrator_name='Bekele Wolde',
            category=Story.StoryCategory.ORAL_HISTORY,
            status=Story.StoryStatus.PUBLISHED
        )
        Story.objects.create(
            family=self.family, author=self.user,
            title='Traditional Injera Fermentation Recipe',
            content='Ancestral teff fermentation process...',
            narrator_name='Hana Mekonnen',
            category=Story.StoryCategory.RECIPE,
            status=Story.StoryStatus.PUBLISHED
        )

        # Search for Axum
        res_search = self.client.get(f'/api/v1/families/{self.family.id}/stories/?search=Axum')
        self.assertEqual(len(res_search.data['data']), 1)
        self.assertEqual(res_search.data['data'][0]['title'], 'Oral History of the Axum Monoliths')

        # Filter by Category RECIPE
        res_cat = self.client.get(f'/api/v1/families/{self.family.id}/stories/?category=RECIPE')
        self.assertEqual(len(res_cat.data['data']), 1)
        self.assertEqual(res_cat.data['data'][0]['title'], 'Traditional Injera Fermentation Recipe')

    def test_author_and_admin_edit_permissions(self):
        """Tests that non-author non-admin cannot edit or delete someone else's story."""
        story = Story.objects.create(
            family=self.family, author=self.user,
            title='Author Private Memoir',
            content='Secret notes on ancestry...',
            status=Story.StoryStatus.DRAFT
        )

        # Other viewer attempts to edit -> 403 Forbidden
        self.client.force_authenticate(user=self.viewer_user)
        url = f'/api/v1/families/{self.family.id}/stories/{story.id}/'
        res = self.client.patch(url, {'title': 'Tampered Title'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # Author can edit
        self.client.force_authenticate(user=self.user)
        res_author = self.client.patch(url, {'title': 'Updated by Author'}, format='json')
        self.assertEqual(res_author.status_code, status.HTTP_200_OK)

    def test_cross_family_story_isolation(self):
        """Tests that members of Family A cannot view or tamper with Family B stories."""
        story = Story.objects.create(
            family=self.other_family, author=self.other_user,
            title='Foreign Family Secret',
            content='Top secret family heritage...',
            status=Story.StoryStatus.PUBLISHED
        )

        # User in Bekele family attempts to view foreign family story
        url = f'/api/v1/families/{self.other_family.id}/stories/{story.id}/'
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_timeline_milestone(self):
        """Tests recording chronological family milestones with era grouping."""
        url = f'/api/v1/families/{self.family.id}/timeline/'
        payload = {
            'title': 'Establishment of the Begemder Homestead',
            'title_amharic': 'የበገምድር መኖሪያ ቤት መመሥረት',
            'year': 1948,
            'is_approximate_date': True,
            'era': 'Imperial Era (1930 - 1974)',
            'description': 'Bekele Wolde constructed the stone masonry family homestead.',
            'location': 'Begemder, Gondar',
            'category': 'FOUNDATION'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['data']['year'], 1948)

    def test_heritage_overview_aggregation(self):
        """Tests aggregation of audio memoirs, featured stories, and milestones."""
        Story.objects.create(
            family=self.family, author=self.user,
            title='Published Story With Audio',
            content='Narrative content...',
            audio_url='https://storage.kinkeep.com/audio/memoir.mp3',
            status=Story.StoryStatus.PUBLISHED
        )
        TimelineMilestone.objects.create(
            family=self.family, title='First Ancestor Migration', year=1952
        )

        url = f'/api/v1/families/{self.family.id}/heritage/overview/'
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data['data']
        self.assertEqual(data['total_stories'], 1)
        self.assertEqual(data['total_audio_recordings'], 1)
        self.assertEqual(data['total_milestones'], 1)
