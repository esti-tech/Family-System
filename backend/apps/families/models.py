import uuid
from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from apps.common.models import UUIDModel, TimestampedModel
from apps.accounts.models import User

class Family(UUIDModel, TimestampedModel):
    """
    Fundamental multi-tenant boundary for KinKeep.
    All genealogy records, stories, timeline events, events, and memories are scoped by family_id.
    """
    class FamilyStatus(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        LOCKED_STORAGE_FULL = 'LOCKED_STORAGE_FULL', 'Storage Full'
        SUSPENDED = 'SUSPENDED', 'Suspended'
        ARCHIVED = 'ARCHIVED', 'Archived'

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    origin_city = models.CharField(max_length=120, blank=True, null=True)
    origin_country = models.CharField(max_length=100, default='Ethiopia')
    cover_media_id = models.UUIDField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='created_families')
    status = models.CharField(
        max_length=20,
        choices=FamilyStatus.choices,
        default=FamilyStatus.ACTIVE,
        db_index=True
    )
    settings = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'families'
        verbose_name = 'Family Workspace'
        verbose_name_plural = 'Family Workspaces'

    def __str__(self):
        return f"{self.name} ({self.slug})"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or 'family'
            unique_slug = base_slug
            counter = 1
            while Family.objects.filter(slug=unique_slug).exclude(id=self.id).exists():
                unique_slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = unique_slug
        
        if not self.settings:
            self.settings = {
                "privacy": "MEMBERS_ONLY",
                "allow_guest_uploads": True,
                "require_reviewer_approval": True,
            }
        super().save(*args, **kwargs)

class FamilyRole(UUIDModel):
    """System and custom roles within a family workspace."""
    class SystemRole(models.TextChoices):
        OWNER = 'FAMILY_OWNER', 'Family Owner'
        ADMIN = 'FAMILY_ADMIN', 'Family Administrator'
        EDITOR = 'FAMILY_EDITOR', 'Family Editor'
        REVIEWER = 'FAMILY_REVIEWER', 'Family Reviewer'
        VIEWER = 'FAMILY_VIEWER', 'Family Viewer'

    code = models.CharField(max_length=50, unique=True, db_index=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_system = models.BooleanField(default=True)

    class Meta:
        db_table = 'family_roles'

    def __str__(self):
        return self.name

class Permission(UUIDModel):
    """Granular platform and family permissions."""
    code = models.CharField(max_length=80, unique=True, db_index=True)
    name = models.CharField(max_length=120)
    module = models.CharField(max_length=50)

    class Meta:
        db_table = 'permissions'

    def __str__(self):
        return f"{self.module}.{self.code}"

class RolePermission(models.Model):
    """Mapping of permissions assigned to roles."""
    role = models.ForeignKey(FamilyRole, on_delete=models.CASCADE, related_name='role_permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='permission_roles')

    class Meta:
        db_table = 'role_permissions'
        unique_together = ('role', 'permission')

class FamilyMembership(UUIDModel, TimestampedModel):
    """Active association mapping a User to a Family with an assigned role."""
    class MembershipStatus(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        SUSPENDED = 'SUSPENDED', 'Suspended'
        LEFT = 'LEFT', 'Left'

    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='family_memberships')
    role = models.ForeignKey(FamilyRole, on_delete=models.RESTRICT, related_name='memberships')
    nickname = models.CharField(max_length=120, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=MembershipStatus.choices,
        default=MembershipStatus.ACTIVE,
        db_index=True
    )
    joined_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'family_memberships'
        unique_together = ('family', 'user')
        indexes = [
            models.Index(fields=['family', 'user', 'status'], name='idx_memberships_fam_user'),
        ]

    def __str__(self):
        return f"{self.user.email} in {self.family.name} as {self.role.name}"

class FamilyInvitation(UUIDModel, TimestampedModel):
    """Pending member invitation token."""
    class InvitationStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        REVOKED = 'REVOKED', 'Revoked'
        EXPIRED = 'EXPIRED', 'Expired'

    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='invitations')
    email = models.EmailField(max_length=320)
    role = models.ForeignKey(FamilyRole, on_delete=models.RESTRICT, related_name='invitations')
    token_hash = models.CharField(max_length=255, unique=True)
    invited_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_invitations')
    status = models.CharField(
        max_length=20,
        choices=InvitationStatus.choices,
        default=InvitationStatus.PENDING,
        db_index=True
    )
    expires_at = models.DateTimeField()

    class Meta:
        db_table = 'family_invitations'

    @property
    def is_valid(self):
        return self.status == self.InvitationStatus.PENDING and self.expires_at > timezone.now()
