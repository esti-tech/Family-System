from django.contrib import admin
from apps.guest_uploads.models import EventQRToken, GuestUploadSession

@admin.register(EventQRToken)
class EventQRTokenAdmin(admin.ModelAdmin):
    list_display = ('label', 'event', 'family', 'uploads_count', 'max_uploads', 'is_revoked', 'expires_at')
    list_filter = ('is_revoked',)
    search_fields = ('label', 'event__title', 'family__name')

@admin.register(GuestUploadSession)
class GuestUploadSessionAdmin(admin.ModelAdmin):
    list_display = ('guest_nickname', 'qr_token', 'ip_address', 'is_active', 'expires_at')
    list_filter = ('is_active',)
    search_fields = ('guest_nickname', 'qr_token__label')
