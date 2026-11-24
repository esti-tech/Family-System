from rest_framework import serializers
from apps.media_storage.models import MediaAsset


class MediaAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = [
            'id', 'family_id', 'media_type', 'file_name', 'mime_type',
            'file_size_bytes', 'public_url', 'thumbnail_url', 'processing_status',
            'width', 'height', 'duration_seconds', 'is_quarantined', 'created_at'
        ]
        read_only_fields = fields


class MediaUploadIntentSerializer(serializers.Serializer):
    file_name = serializers.CharField(max_length=255)
    mime_type = serializers.CharField(max_length=120)
    file_size_bytes = serializers.IntegerField(min_value=1)
