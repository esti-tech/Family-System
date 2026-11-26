from django.contrib import admin
from apps.platform_admin.models import PlatformNotice, PlatformSetting

@admin.register(PlatformNotice)
class PlatformNoticeAdmin(admin.ModelAdmin):
    list_display = ('title', 'notice_type', 'is_active', 'created_at')
    list_filter = ('notice_type', 'is_active')
    search_fields = ('title', 'message')

@admin.register(PlatformSetting)
class PlatformSettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'description', 'updated_at')
    search_fields = ('key', 'description')
