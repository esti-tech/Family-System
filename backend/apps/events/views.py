from django.utils import timezone
from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.families.permissions import IsFamilyMember, IsFamilyAdmin
from apps.families.models import FamilyRole
from apps.common.responses import success_response
from apps.events.models import Event, EventGuest, EventGuestbookEntry
from apps.events.serializers import (
    EventSerializer, CreateEventSerializer,
    EventGuestSerializer, EventGuestbookEntrySerializer
)


class EventListView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(responses={200: EventSerializer(many=True)})
    def get(self, request, id=None, slug=None):
        """Lists family events with status and type filters."""
        family = request.family
        queryset = Event.objects.filter(family=family)

        status_param = request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param.upper())

        event_type = request.query_params.get('type')
        if event_type:
            queryset = queryset.filter(event_type=event_type.upper())

        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(location_name__icontains=search) |
                Q(description__icontains=search)
            )

        serializer = EventSerializer(queryset, many=True)
        return success_response(data=serializer.data)

    @extend_schema(request=CreateEventSerializer, responses={201: EventSerializer})
    def post(self, request, id=None, slug=None):
        """Creates a new family event."""
        family = request.family
        serializer = CreateEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        event = serializer.save(family=family, created_by=request.user)
        return success_response(
            data=EventSerializer(event).data,
            message=f"Event '{event.title}' created.",
            status_code=status.HTTP_201_CREATED
        )


class EventDetailView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, event_id, id=None, slug=None):
        """Retrieves full details for an event."""
        family = request.family
        event = Event.objects.filter(
            Q(id=event_id) | Q(slug=event_id), family=family
        ).first()

        if not event:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Event not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        return success_response(data=EventSerializer(event).data)

    def patch(self, request, event_id, id=None, slug=None):
        """Updates event details."""
        family = request.family
        event = Event.objects.filter(
            Q(id=event_id) | Q(slug=event_id), family=family
        ).first()

        if not event:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Event not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CreateEventSerializer(event, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()

        return success_response(data=EventSerializer(updated).data, message="Event updated.")

    def delete(self, request, event_id, id=None, slug=None):
        """Deletes an event."""
        family = request.family
        event = Event.objects.filter(
            Q(id=event_id) | Q(slug=event_id), family=family
        ).first()

        if not event:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Event not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        event.delete()
        return success_response(message="Event removed.")


class EventGuestListView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, event_id, id=None, slug=None):
        """Lists registered guests and their RSVP status."""
        family = request.family
        event = Event.objects.filter(
            Q(id=event_id) | Q(slug=event_id), family=family
        ).first()
        if not event:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Event not found."}}, status=status.HTTP_404_NOT_FOUND)

        guests = event.guests.all()
        return success_response(data=EventGuestSerializer(guests, many=True).data)

    def post(self, request, event_id, id=None, slug=None):
        """Adds a guest to the event invitation list."""
        family = request.family
        event = Event.objects.filter(
            Q(id=event_id) | Q(slug=event_id), family=family
        ).first()
        if not event:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Event not found."}}, status=status.HTTP_404_NOT_FOUND)

        serializer = EventGuestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        guest = serializer.save(event=event)
        return success_response(data=EventGuestSerializer(guest).data, message="Guest added to event roster.", status_code=status.HTTP_201_CREATED)


class EventGuestRSVPView(APIView):
    permission_classes = [IsFamilyMember]

    def patch(self, request, event_id, guest_id, id=None, slug=None):
        """Updates RSVP response for a guest."""
        family = request.family
        event = Event.objects.filter(
            Q(id=event_id) | Q(slug=event_id), family=family
        ).first()
        if not event:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Event not found."}}, status=status.HTTP_404_NOT_FOUND)

        guest = EventGuest.objects.filter(id=guest_id, event=event).first()
        if not guest:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Guest not found."}}, status=status.HTTP_404_NOT_FOUND)

        rsvp_status = request.data.get('rsvp_status')
        if rsvp_status:
            guest.rsvp_status = rsvp_status.upper()
            guest.responded_at = timezone.now()
        if 'party_size' in request.data:
            guest.party_size = int(request.data['party_size'])
        if 'dietary_notes' in request.data:
            guest.dietary_notes = request.data['dietary_notes']

        guest.save()
        return success_response(data=EventGuestSerializer(guest).data, message="RSVP updated.")


class EventGuestbookView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, event_id, id=None, slug=None):
        """Lists guestbook blessings and messages."""
        family = request.family
        event = Event.objects.filter(
            Q(id=event_id) | Q(slug=event_id), family=family
        ).first()
        if not event:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Event not found."}}, status=status.HTTP_404_NOT_FOUND)

        entries = event.guestbook_entries.all()
        return success_response(data=EventGuestbookEntrySerializer(entries, many=True).data)

    def post(self, request, event_id, id=None, slug=None):
        """Leaves a message in the event guestbook."""
        family = request.family
        event = Event.objects.filter(
            Q(id=event_id) | Q(slug=event_id), family=family
        ).first()
        if not event:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Event not found."}}, status=status.HTTP_404_NOT_FOUND)

        serializer = EventGuestbookEntrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entry = serializer.save(event=event)

        return success_response(data=EventGuestbookEntrySerializer(entry).data, message="Message left in guestbook.", status_code=status.HTTP_201_CREATED)
