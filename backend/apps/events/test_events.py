from datetime import timedelta
from django.utils import timezone
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.families.models import Family, FamilyRole, FamilyMembership
from apps.events.models import Event, EventGuest, EventGuestbookEntry

User = get_user_model()


class EventTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.owner_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.OWNER, defaults={'name': 'Family Owner'}
        )
        self.user = User.objects.create_user(
            email='event.host@kinkeep.com', password='Password123!', full_name='Event Host'
        )
        self.family = Family.objects.create(
            name='Bekele Event Family',
            slug='bekele-event-family',
            created_by=self.user
        )
        self.membership = FamilyMembership.objects.create(
            family=self.family,
            user=self.user,
            role=self.owner_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        # Foreign Family for Isolation Test
        self.other_user = User.objects.create_user(
            email='foreign.host@kinkeep.com', password='Password123!', full_name='Foreign Host'
        )
        self.other_family = Family.objects.create(
            name='Foreign Event Family',
            slug='foreign-event-family',
            created_by=self.other_user
        )
        self.other_membership = FamilyMembership.objects.create(
            family=self.other_family,
            user=self.other_user,
            role=self.owner_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        self.client.force_authenticate(user=self.user)

    def test_create_and_list_events(self):
        """Tests creating a family gathering and listing events."""
        url = f'/api/v1/families/{self.family.id}/events/'
        start_time = timezone.now() + timedelta(days=30)
        payload = {
            'title': "Dawit & Hana's 35th Wedding Anniversary",
            'title_amharic': 'የዳዊት እና የሐና 35ኛ የጋብቻ በዓል',
            'event_type': 'WEDDING',
            'start_datetime': start_time.isoformat(),
            'location_name': 'Skylight Hotel Grand Ballroom',
            'location_city': 'Addis Ababa',
            'description': 'Family dinner and oral storytelling celebration.',
            'enable_guest_uploads': True,
            'require_guest_upload_moderation': True
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['data']['title'], payload['title'])

        # List events
        res_list = self.client.get(url)
        self.assertEqual(res_list.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_list.data['data']), 1)

    def test_event_guest_roster_and_rsvp(self):
        """Tests adding guests and updating RSVP status."""
        event = Event.objects.create(
            family=self.family,
            created_by=self.user,
            title='Family Reunion 2026',
            event_type=Event.EventType.REUNION,
            start_datetime=timezone.now() + timedelta(days=14)
        )

        # Add guest
        guest_url = f'/api/v1/families/{self.family.id}/events/{event.id}/guests/'
        payload = {
            'full_name': 'Kalkidan Bekele',
            'email': 'kalkidan@gmail.com',
            'party_size': 2,
            'dietary_notes': 'Strict fasting food (Tsom)'
        }
        res_guest = self.client.post(guest_url, payload, format='json')
        self.assertEqual(res_guest.status_code, status.HTTP_201_CREATED)
        guest_id = res_guest.data['data']['id']

        # Update RSVP
        rsvp_url = f'/api/v1/families/{self.family.id}/events/{event.id}/guests/{guest_id}/rsvp/'
        res_rsvp = self.client.patch(rsvp_url, {'rsvp_status': 'ATTENDING', 'party_size': 3}, format='json')
        self.assertEqual(res_rsvp.status_code, status.HTTP_200_OK)

        guest = EventGuest.objects.get(id=guest_id)
        self.assertEqual(guest.rsvp_status, EventGuest.RSVPStatus.ATTENDING)
        self.assertEqual(guest.party_size, 3)

    def test_guestbook_entries(self):
        """Tests leaving congratulations in the digital guestbook."""
        event = Event.objects.create(
            family=self.family,
            created_by=self.user,
            title='Graduation Celebration',
            event_type=Event.EventType.GRADUATION,
            start_datetime=timezone.now() + timedelta(days=5)
        )

        gb_url = f'/api/v1/families/{self.family.id}/events/{event.id}/guestbook/'
        res = self.client.post(gb_url, {
            'author_name': 'Uncle Berhanu',
            'message': 'Congratulations on this milestone! We are so proud of your dedication.'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EventGuestbookEntry.objects.filter(event=event).count(), 1)

    def test_cross_family_event_isolation(self):
        """Tests that a user in Family A cannot view or tamper with Family B events."""
        foreign_event = Event.objects.create(
            family=self.other_family,
            created_by=self.other_user,
            title='Private Foreign Gathering',
            start_datetime=timezone.now() + timedelta(days=10)
        )

        # Attempt to inspect foreign event
        url = f'/api/v1/families/{self.other_family.id}/events/{foreign_event.id}/'
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
