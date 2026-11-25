import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class PlatformNotice(models.Model):
    """
    Global platform announcements displayed across family workspaces and admin dashboards.
    """
    class NoticeType(models.TextChoices):
        MAINTENANCE = 'MAINTENANCE', _('Scheduled Maintenance')
        FEATURE = 'FEATURE', _('New Feature Release')
        SECURITY = 'SECURITY', _('Security Advisory')
        POLICY = 'POLICY', _('Terms / Policy Update')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    message = models.TextField()
    notice_type = models.CharField(
        max_length=30, choices=NoticeType.choices, default=NoticeType.FEATURE, db_index=True
    )
    is_active = models.BooleanField(default=True, db_index=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'platform_notices'
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.notice_type}] {self.title}"


class PlatformSetting(models.Model):
    """
    Key-value platform configuration dictionary.
    Controls global feature flags, maintenance mode, and default storage allocations.
    """
    key = models.CharField(max_length=100, unique=True, db_index=True)
    value = models.JSONField(default=dict)
    description = models.TextField(blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'platform_settings'

    def __str__(self):
        return self.key
