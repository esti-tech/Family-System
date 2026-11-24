import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from apps.families.models import Family


class Event(models.Model):
    """
    Family gatherings, celebrations, memorials, and reunions.
    Events are distinct from memories; memories can be linked to events.
    """
    class EventType(models.TextChoices):
        WEDDING = 'WEDDING', _('Wedding & Union')
        BIRTHDAY = 'BIRTHDAY', _('Birthday / Milestone')
        GRADUATION = 'GRADUATION', _('Graduation & Academic')
        REUNION = 'REUNION', _('Family Reunion')
        HOLIDAY = 'HOLIDAY', _('Holiday / Cultural Festival (e.g. Timkat, Meskel)')
        MEMORIAL = 'MEMORIAL', _('Memorial / Remembrance (Tazya)')
        CELEBRATION = 'CELEBRATION', _('Celebration')

    class EventStatus(models.TextChoices):
        UPCOMING = 'UPCOMING', _('Upcoming')
        ONGOING = 'ONGOING', _('Ongoing')
        COMPLETED = 'COMPLETED', _('Completed')
        CANCELLED = 'CANCELLED', _('Cancelled')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='events')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_events'
    )

    title = models.CharField(max_length=255)
    title_amharic = models.CharField(max_length=255, blank=True, default='')
    slug = models.SlugField(max_length=300, db_index=True)
    event_type = models.CharField(
        max_length=30, choices=EventType.choices, default=EventType.REUNION, db_index=True
    )

    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField(null=True, blank=True)

    location_name = models.CharField(max_length=200, blank=True, default='')
    location_address = models.CharField(max_length=300, blank=True, default='')
    location_city = models.CharField(max_length=120, blank=True, default='Addis Ababa')
    location_country = models.CharField(max_length=100, default='Ethiopia')

    description = models.TextField(blank=True, default='')
    cover_image_url = models.URLField(max_length=500, blank=True, default='')
    live_stream_url = models.URLField(max_length=500, blank=True, default='')
    is_virtual = models.BooleanField(default=False)

    # QR Guest Upload Settings
    enable_guest_uploads = models.BooleanField(default=True)
    require_guest_upload_moderation = models.BooleanField(default=True)

    status = models.CharField(
        max_length=20, choices=EventStatus.choices, default=EventStatus.UPCOMING, db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_datetime']
        indexes = [
            models.Index(fields=['family', 'status']),
            models.Index(fields=['family', 'start_datetime']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title) or 'event'
            self.slug = f"{base}-{uuid.uuid4().hex[:6]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.start_datetime.strftime('%Y-%m-%d')})"


class EventGuest(models.Model):
    """
    Guest roster and RSVP management for an event.
    """
    class RSVPStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        ATTENDING = 'ATTENDING', _('Attending')
        DECLINED = 'DECLINED', _('Declined')
        TENTATIVE = 'TENTATIVE', _('Tentative')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='guests')
    full_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=320, blank=True, default='')
    phone_number = models.CharField(max_length=40, blank=True, default='')
    rsvp_status = models.CharField(
        max_length=20, choices=RSVPStatus.choices, default=RSVPStatus.PENDING
    )
    party_size = models.PositiveIntegerField(default=1)
    dietary_notes = models.CharField(max_length=300, blank=True, default='')
    invitation_sent_at = models.DateTimeField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['full_name']

    def __str__(self):
        return f"{self.full_name} - {self.event.title} ({self.rsvp_status})"


class EventGuestbookEntry(models.Model):
    """
    Digital blessings, congratulations, and messages left by event attendees.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='guestbook_entries')
    author_name = models.CharField(max_length=150)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.author_name}: {self.message[:30]}..."
