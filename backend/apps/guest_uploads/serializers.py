from rest_framework import serializers
from apps.guest_uploads.models import EventQRToken, GuestUploadSession


class EventQRTokenSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)

    class Meta:
        model = EventQRToken
        fields = [
            'id', 'family_id', 'event_id', 'event_title', 'label',
            'expires_at', 'is_revoked', 'max_uploads', 'uploads_count',
            'is_valid', 'created_at'
        ]
        read_only_fields = ['id', 'family_id', 'uploads_count', 'is_valid', 'created_at']


class CreateQRTokenSerializer(serializers.Serializer):
    label = serializers.CharField(max_length=150, default="Table Tent QR")
    expires_in_days = serializers.IntegerField(default=7, min_value=1, max_value=30)
    max_uploads = serializers.IntegerField(default=150, min_value=1, max_value=1000)


class GuestSessionInitSerializer(serializers.Serializer):
    qr_token = serializers.CharField()
    guest_nickname = serializers.CharField(max_length=100, required=False, default="Guest Attendee")


class GuestMemoryUploadSerializer(serializers.Serializer):
    file_name = serializers.CharField(max_length=255)
    mime_type = serializers.CharField(max_length=120)
    file_size_bytes = serializers.IntegerField(min_value=1)
    caption = serializers.CharField(required=False, allow_blank=True, default='')
