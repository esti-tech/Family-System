import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from apps.families.models import Family
from apps.media_storage.models import MediaAsset
from apps.events.models import Event
from apps.genealogy.models import Person
from apps.guest_uploads.models import GuestUploadSession


class Memory(models.Model):
    """
    Core vault item representing a preserved photograph, video, document, or audio.
    Can be associated with people, events, and albums without file duplication.
    """
    class MemoryStatus(models.TextChoices):
        PUBLISHED = 'PUBLISHED', _('Published in Vault')
        PENDING_REVIEW = 'PENDING_REVIEW', _('Pending Moderation')
        TRASHED = 'TRASHED', _('In Trash')

    class ModerationStatus(models.TextChoices):
        APPROVED = 'APPROVED', _('Approved')
        PENDING = 'PENDING', _('Pending Moderation')
        FLAGGED = 'FLAGGED', _('Flagged for Review')
        REJECTED = 'REJECTED', _('Rejected')

    class MediaType(models.TextChoices):
        IMAGE = 'IMAGE', _('Photograph')
        VIDEO = 'VIDEO', _('Video')
        AUDIO = 'AUDIO', _('Audio Memo')
        DOCUMENT = 'DOCUMENT', _('Historical Document')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='memories')
    media_asset = models.ForeignKey(
        MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name='memories'
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    media_type = models.CharField(
        max_length=20, choices=MediaType.choices, default=MediaType.IMAGE, db_index=True
    )

    media_url = models.URLField(max_length=1000)
    thumbnail_url = models.URLField(max_length=1000, blank=True, default='')

    # Associations
    event = models.ForeignKey(
        Event, on_delete=models.SET_NULL, null=True, blank=True, related_name='linked_memories'
    )
    linked_persons = models.ManyToManyField(
        Person, blank=True, related_name='tagged_memories'
    )

    # Date & Location
    taken_at = models.DateField(null=True, blank=True)
    taken_year = models.IntegerField(null=True, blank=True)
    taken_at_is_approximate = models.BooleanField(default=False)
    location_name = models.CharField(max_length=200, blank=True, default='')

    # Lifecycle & Moderation
    status = models.CharField(
        max_length=20, choices=MemoryStatus.choices, default=MemoryStatus.PUBLISHED, db_index=True
    )
    moderation_status = models.CharField(
        max_length=20, choices=ModerationStatus.choices, default=ModerationStatus.APPROVED, db_index=True
    )
    moderation_notes = models.TextField(blank=True, default='')

    # Origin: Authenticated relative or QR guest upload
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='uploaded_memories'
    )
    guest_session = models.ForeignKey(
        GuestUploadSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='guest_memories'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    trashed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['family', 'status']),
            models.Index(fields=['family', 'media_type']),
            models.Index(fields=['family', 'moderation_status']),
        ]

    def __str__(self):
        return f"{self.title} ({self.media_type}) - {self.family.name}"


class Album(models.Model):
    """
    Curated album collection grouping memories together without duplicating files.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='albums')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, db_index=True)
    description = models.TextField(blank=True, default='')
    cover_media_url = models.URLField(max_length=1000, blank=True, default='')

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    memories = models.ManyToManyField(
        Memory, through='AlbumMemoryLink', related_name='albums', blank=True
    )

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title) or 'album'
            self.slug = f"{base}-{uuid.uuid4().hex[:6]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.family.name})"


class AlbumMemoryLink(models.Model):
    """
    Many-to-many link connecting Memory items to Albums with custom ordering.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    memory = models.ForeignKey(Memory, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('album', 'memory')
        ordering = ['order', '-added_at']

    def __str__(self):
        return f"{self.album.title} -> {self.memory.title}"
