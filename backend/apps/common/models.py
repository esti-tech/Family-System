import uuid
from django.db import models

class UUIDModel(models.Model):
    """Abstract base model providing a UUIDv4 primary key."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True

class TimestampedModel(models.Model):
    """Abstract base model providing automatic ISO-8601 creation and modification timestamps."""
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class CommonBaseModel(UUIDModel, TimestampedModel):
    """Combined base model with UUID primary key and timestamps."""
    class Meta:
        abstract = True
