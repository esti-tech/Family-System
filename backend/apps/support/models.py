import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from apps.families.models import Family


class SupportTicket(models.Model):
    """
    Customer service and technical issue tickets managed in the Super Admin console.
    """
    class Category(models.TextChoices):
        BILLING = 'BILLING', _('Billing & Telebirr/Chapa Payments')
        STORAGE = 'STORAGE', _('Storage Quota & Media Vault')
        GENEALOGY = 'GENEALOGY', _('Genealogy Tree & Relationships')
        ACCOUNT = 'ACCOUNT', _('Account Access & Verification')
        TECHNICAL = 'TECHNICAL', _('Technical Bug & System')

    class Priority(models.TextChoices):
        LOW = 'LOW', _('Low')
        MEDIUM = 'MEDIUM', _('Medium')
        HIGH = 'HIGH', _('High')
        URGENT = 'URGENT', _('Urgent')

    class Status(models.TextChoices):
        OPEN = 'OPEN', _('Open')
        IN_PROGRESS = 'IN_PROGRESS', _('In Progress')
        WAITING_USER = 'WAITING_USER', _('Waiting for Customer')
        RESOLVED = 'RESOLVED', _('Resolved')
        CLOSED = 'CLOSED', _('Closed')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_number = models.CharField(max_length=32, unique=True, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='support_tickets'
    )
    family = models.ForeignKey(
        Family, on_delete=models.SET_NULL, null=True, blank=True, related_name='support_tickets'
    )

    subject = models.CharField(max_length=255)
    category = models.CharField(max_length=30, choices=Category.choices, default=Category.BILLING, db_index=True)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM, db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN, db_index=True)
    description = models.TextField()

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_support_tickets'
    )
    resolved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'support_tickets'
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.ticket_number}] {self.subject} ({self.status})"


class SupportTicketMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    message = models.TextField()
    is_internal_note = models.BooleanField(
        default=False, help_text=_("Internal staff-only note not visible to customer.")
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'support_ticket_messages'
        ordering = ['created_at']

    def __str__(self):
        return f"Message by {self.sender} on {self.ticket.ticket_number}"
