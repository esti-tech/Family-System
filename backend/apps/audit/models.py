import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class AuditLog(models.Model):
    """
    Immutable audit log for all security-sensitive administrative actions.
    Tracks user suspensions, workspace lockouts, plan updates, and platform configuration changes.
    """
    class ActionCategory(models.TextChoices):
        USER_SUSPEND = 'USER_SUSPEND', _('User Suspended')
        USER_ACTIVATE = 'USER_ACTIVATE', _('User Activated')
        USER_NOTICE = 'USER_NOTICE', _('Administrative Notice Sent')
        WORKSPACE_STATUS_CHANGE = 'WORKSPACE_STATUS_CHANGE', _('Workspace Status Altered')
        PLAN_UPDATE = 'PLAN_UPDATE', _('Subscription Plan Modified')
        PLAN_CREATE = 'PLAN_CREATE', _('New Subscription Plan Created')
        SETTINGS_UPDATE = 'SETTINGS_UPDATE', _('Platform Setting Updated')
        SUPPORT_RESOLVED = 'SUPPORT_RESOLVED', _('Support Ticket Resolved')
        PAYMENT_RECONCILED = 'PAYMENT_RECONCILED', _('Manual Payment Reconciliation')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    actor_email = models.EmailField(max_length=320, blank=True, default='')

    action = models.CharField(max_length=50, choices=ActionCategory.choices, db_index=True)
    target_type = models.CharField(max_length=50, db_index=True) # e.g. User, Family, Plan, Setting
    target_id = models.CharField(max_length=100, db_index=True)
    target_label = models.CharField(max_length=255, blank=True, default='')

    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default='')
    details = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        db_table = 'audit_logs'
        ordering = ['-created_at']

    def __str__(self):
        actor_name = self.actor_email or (self.actor.email if self.actor else 'System')
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M')}] {actor_name} -> {self.action} on {self.target_type}:{self.target_label}"
