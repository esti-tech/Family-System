from rest_framework import serializers
from apps.events.models import Event, EventGuest, EventGuestbookEntry


class EventSerializer(serializers.ModelSerializer):
    guest_count = serializers.SerializerMethodField()
    attending_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'family_id', 'title', 'title_amharic', 'slug', 'event_type',
            'start_datetime', 'end_datetime', 'location_name', 'location_address',
            'location_city', 'location_country', 'description', 'cover_image_url',
            'live_stream_url', 'is_virtual', 'enable_guest_uploads',
            'require_guest_upload_moderation', 'status', 'guest_count',
            'attending_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'family_id', 'slug', 'created_at', 'updated_at']

    def get_guest_count(self, obj):
        return obj.guests.count()

    def get_attending_count(self, obj):
        return obj.guests.filter(rsvp_status=EventGuest.RSVPStatus.ATTENDING).count()


class CreateEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'title', 'title_amharic', 'event_type', 'start_datetime', 'end_datetime',
            'location_name', 'location_address', 'location_city', 'location_country',
            'description', 'cover_image_url', 'live_stream_url', 'is_virtual',
            'enable_guest_uploads', 'require_guest_upload_moderation', 'status'
        ]


class EventGuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventGuest
        fields = [
            'id', 'event_id', 'full_name', 'email', 'phone_number',
            'rsvp_status', 'party_size', 'dietary_notes',
            'invitation_sent_at', 'responded_at', 'created_at'
        ]
        read_only_fields = ['id', 'event_id', 'created_at']


class EventGuestbookEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventGuestbookEntry
        fields = ['id', 'event_id', 'author_name', 'message', 'created_at']
        read_only_fields = ['id', 'event_id', 'created_at']
