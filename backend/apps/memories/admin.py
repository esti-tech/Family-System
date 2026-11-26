from django.contrib import admin
from apps.memories.models import Memory, Album, AlbumMemoryLink

@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'family', 'media_type', 'status', 'moderation_status', 'created_at')
    list_filter = ('media_type', 'status', 'moderation_status')
    search_fields = ('title', 'family__name', 'description')

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'family', 'created_by', 'created_at')
    search_fields = ('title', 'family__name')

@admin.register(AlbumMemoryLink)
class AlbumMemoryLinkAdmin(admin.ModelAdmin):
    list_display = ('album', 'memory', 'order', 'added_at')
