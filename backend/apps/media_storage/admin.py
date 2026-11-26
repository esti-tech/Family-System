from django.contrib import admin
from apps.media_storage.models import MediaAsset

@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'family', 'media_type', 'file_size_bytes', 'processing_status', 'created_at')
    list_filter = ('media_type', 'processing_status')
    search_fields = ('file_name', 'storage_key', 'family__name')
