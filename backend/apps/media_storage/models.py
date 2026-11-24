import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from apps.families.models import Family


class MediaAsset(models.Model):
    """
    Stores metadata, S3/MinIO keys, and MIME types for binary files.
    The database never stores the binary file contents directly.
    """
    class MediaType(models.TextChoices):
        IMAGE = 'IMAGE', _('Image')
        VIDEO = 'VIDEO', _('Video')
        AUDIO = 'AUDIO', _('Audio')
        DOCUMENT = 'DOCUMENT', _('Document')

    class ProcessingStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending Upload / Processing')
        READY = 'READY', _('Ready / Verified')
        FAILED = 'FAILED', _('Processing Failed')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='media_assets')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='uploaded_media'
    )

    media_type = models.CharField(max_length=15, choices=MediaType.choices, default=MediaType.IMAGE)
    file_name = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=120)
    file_size_bytes = models.BigIntegerField(default=0)

    # Private Object Storage Keys (S3 / MinIO)
    storage_key = models.CharField(max_length=500, unique=True, help_text="Path in private bucket")
    storage_bucket = models.CharField(max_length=150, default='kinkeep-media-vault')
    public_url = models.URLField(max_length=1000, blank=True, default='')
    thumbnail_url = models.URLField(max_length=1000, blank=True, default='')

    # Metadata & Verification
    processing_status = models.CharField(
        max_length=20, choices=ProcessingStatus.choices, default=ProcessingStatus.READY
    )
    checksum_sha256 = models.CharField(max_length=64, blank=True, default='')
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    duration_seconds = models.IntegerField(null=True, blank=True)

    # Security & Moderation Quarantining
    is_quarantined = models.BooleanField(
        default=False, help_text="Set to True for unreviewed guest uploads"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['family', 'media_type']),
            models.Index(fields=['family', 'processing_status']),
        ]

    def __str__(self):
        return f"{self.file_name} ({self.media_type}) - {self.family.name}"
