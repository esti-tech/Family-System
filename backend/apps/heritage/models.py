import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from apps.families.models import Family
from apps.genealogy.models import Person


class Story(models.Model):
    """
    Oral histories, written memoirs, cultural narratives, and family lore.
    Can be linked to multiple genealogical Person records and media items.
    """
    class StoryStatus(models.TextChoices):
        DRAFT = 'DRAFT', _('Draft')
        PUBLISHED = 'PUBLISHED', _('Published')
        ARCHIVED = 'ARCHIVED', _('Archived')

    class StoryCategory(models.TextChoices):
        ORAL_HISTORY = 'ORAL_HISTORY', _('Oral History')
        TRADITION = 'TRADITION', _('Tradition & Ritual')
        MIGRATION = 'MIGRATION', _('Migration & Journey')
        RECIPE = 'RECIPE', _('Heritage Recipe')
        BIOGRAPHY = 'BIOGRAPHY', _('Ancestor Biography')
        CELEBRATION = 'CELEBRATION', _('Wedding & Celebration')
        MEMOIR = 'MEMOIR', _('Personal Memoir')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='stories')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='authored_stories'
    )
    narrator_name = models.CharField(
        max_length=200, blank=True, default='',
        help_text="Name of the elder or relative who originally narrated this story"
    )

    # Multilingual Titles & Content
    title = models.CharField(max_length=255)
    title_amharic = models.CharField(max_length=255, blank=True, default='')
    slug = models.SlugField(max_length=300, db_index=True)

    summary = models.TextField(blank=True, default='', help_text="Short abstract or opening teaser")
    content = models.TextField(help_text="Full written narrative or transcription")
    content_amharic = models.TextField(blank=True, default='', help_text="Optional Amharic translation/original")

    status = models.CharField(
        max_length=20, choices=StoryStatus.choices, default=StoryStatus.DRAFT, db_index=True
    )
    category = models.CharField(
        max_length=30, choices=StoryCategory.choices, default=StoryCategory.ORAL_HISTORY, db_index=True
    )

    # Historical Context & Approximate Dates
    era = models.CharField(max_length=150, blank=True, default='', help_text="e.g. Imperial Begemder (1940-1970)")
    event_year = models.IntegerField(null=True, blank=True)
    event_date_is_approximate = models.BooleanField(default=True)
    location_name = models.CharField(max_length=200, blank=True, default='')

    # Audio Memoir Attachment
    audio_url = models.URLField(max_length=500, blank=True, default='')
    audio_duration_seconds = models.IntegerField(null=True, blank=True)
    cover_image_url = models.URLField(max_length=500, blank=True, default='')

    # Linked People in the Genealogy Graph
    linked_persons = models.ManyToManyField(
        Person, through='StoryPersonLink', related_name='linked_stories', blank=True
    )
    tags = models.JSONField(default=list, blank=True)
    view_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['family', 'status']),
            models.Index(fields=['family', 'category']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title) or 'story'
            self.slug = f"{base}-{uuid.uuid4().hex[:6]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.family.name})"


class StoryPersonLink(models.Model):
    """
    Associates a story with a specific person in the family tree.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    story = models.ForeignKey(Story, on_delete=models.CASCADE)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    role_in_story = models.CharField(
        max_length=80, blank=True, default='Protagonist',
        help_text="e.g. Narrator, Protagonist, Witness, Subject"
    )

    class Meta:
        unique_together = ('story', 'person')

    def __str__(self):
        return f"{self.story.title} -> {self.person.full_name} ({self.role_in_story})"


class TimelineMilestone(models.Model):
    """
    Milestone on the family's historical continuum, preserving chronological heritage.
    """
    class MilestoneCategory(models.TextChoices):
        FOUNDATION = 'FOUNDATION', _('Family Foundation')
        MIGRATION = 'MIGRATION', _('Migration & Journey')
        MARRIAGE = 'MARRIAGE', _('Wedding / Union')
        BIRTH = 'BIRTH', _('Birth of Matriarch/Patriarch')
        ACADEMIC = 'ACADEMIC', _('Academic / Professional')
        COMMUNITY = 'COMMUNITY', _('Community Achievement')
        CULTURAL = 'CULTURAL', _('Cultural Event')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='timeline_milestones')
    title = models.CharField(max_length=255)
    title_amharic = models.CharField(max_length=255, blank=True, default='')

    year = models.IntegerField(help_text="Historical milestone year (e.g. 1948)")
    date = models.DateField(null=True, blank=True)
    is_approximate_date = models.BooleanField(default=False)
    era = models.CharField(max_length=150, blank=True, default='Imperial Era (1930 - 1974)')

    description = models.TextField(blank=True, default='')
    location = models.CharField(max_length=200, blank=True, default='')
    category = models.CharField(
        max_length=30, choices=MilestoneCategory.choices, default=MilestoneCategory.FOUNDATION
    )
    icon = models.CharField(max_length=50, blank=True, default='Sparkles')

    primary_story = models.ForeignKey(
        Story, on_delete=models.SET_NULL, null=True, blank=True, related_name='milestones'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['year', 'date', 'created_at']
        indexes = [
            models.Index(fields=['family', 'year']),
        ]

    def __str__(self):
        return f"{self.year}: {self.title} ({self.family.name})"
