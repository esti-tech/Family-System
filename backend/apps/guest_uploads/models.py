import uuid
from django.db import models
from django.utils import timezone
from apps.families.models import Family
from apps.events.models import Event


class EventQRToken(models.Model):
    """
    Cryptographic ephemeral token for event table-tent QR codes.
    Stores SHA-256 token hashes, never plaintext tokens.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='event_qr_tokens')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='qr_tokens')

    # Security: SHA-256 hash of the 32-byte cryptographically random token
    token_hash = models.CharField(max_length=64, unique=True, db_index=True)
    label = models.CharField(max_length=150, help_text="e.g. Table Tent 4 - Reception Hall")

    expires_at = models.DateTimeField()
    is_revoked = models.BooleanField(default=False)
    max_uploads = models.PositiveIntegerField(default=100)
    uploads_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_valid(self) -> bool:
        return not self.is_revoked and timezone.now() < self.expires_at and self.uploads_count < self.max_uploads

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"QR: {self.label} for {self.event.title} ({'Active' if self.is_valid else 'Inactive'})"


class GuestUploadSession(models.Model):
    """
    Temporary session created when an attendee scans a valid QR code or visits the upload portal.
    Does NOT require a user account.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    qr_token = models.ForeignKey(EventQRToken, on_delete=models.CASCADE, related_name='sessions')
    session_token_hash = models.CharField(max_length=64, unique=True, db_index=True)

    guest_nickname = models.CharField(max_length=100, blank=True, default='Guest Attendee')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=300, blank=True, default='')

    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_valid(self) -> bool:
        return self.is_active and timezone.now() < self.expires_at and self.qr_token.is_valid

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Session: {self.guest_nickname} ({self.qr_token.event.title})"
