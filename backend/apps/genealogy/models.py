import uuid
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from apps.families.models import Family


class Person(models.Model):
    """
    Core genealogy person entity.
    Decoupled from User accounts to represent ancestors, deceased relatives,
    and family members who do not have login credentials.
    """
    class Gender(models.TextChoices):
        MALE = 'MALE', _('Male')
        FEMALE = 'FEMALE', _('Female')
        OTHER = 'OTHER', _('Other')
        UNKNOWN = 'UNKNOWN', _('Unknown')

    class PrivacyLevel(models.TextChoices):
        PUBLIC_FAMILY = 'PUBLIC_FAMILY', _('Visible to all family members')
        RESTRICTED_MINORS = 'RESTRICTED_MINORS', _('Restricted details for minors')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='persons')

    # Ethiopian patronymic naming components
    first_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100, blank=True, default='')
    grandfather_name = models.CharField(max_length=100, blank=True, default='')
    nickname = models.CharField(max_length=100, blank=True, default='')
    maiden_name = models.CharField(max_length=100, blank=True, default='')

    gender = models.CharField(max_length=10, choices=Gender.choices, default=Gender.UNKNOWN)
    is_living = models.BooleanField(default=True)

    # Life Milestones & Dates (with approximate flags for oral histories)
    birth_date = models.DateField(null=True, blank=True)
    birth_year = models.IntegerField(null=True, blank=True, help_text="Used when exact day/month unknown")
    birth_date_is_approximate = models.BooleanField(default=False)
    birth_place = models.CharField(max_length=200, blank=True, default='')

    death_date = models.DateField(null=True, blank=True)
    death_year = models.IntegerField(null=True, blank=True)
    death_date_is_approximate = models.BooleanField(default=False)
    death_place = models.CharField(max_length=200, blank=True, default='')

    # Biography & Cultural Profile
    biography = models.TextField(blank=True, default='')
    cultural_titles = models.CharField(
        max_length=200, blank=True, default='',
        help_text="Traditional or honorary titles e.g. Fitawrari, Grazmach, Qes, Aba Geda"
    )
    avatar_url = models.URLField(max_length=500, blank=True, default='')
    generation_level = models.IntegerField(default=1, help_text="Relative tree tier (1 for root ancestors)")

    privacy_level = models.CharField(
        max_length=20, choices=PrivacyLevel.choices, default=PrivacyLevel.PUBLIC_FAMILY
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_persons'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['generation_level', 'birth_year', 'first_name']
        indexes = [
            models.Index(fields=['family', 'first_name']),
            models.Index(fields=['family', 'generation_level']),
        ]

    @property
    def full_name(self) -> str:
        parts = [self.first_name, self.father_name, self.grandfather_name]
        return " ".join([p for p in parts if p]).strip() or self.first_name

    def __str__(self):
        return f"{self.full_name} ({self.family.name})"


class ParentChildRelationship(models.Model):
    """
    Directed relationship edge representing biological or legal descent.
    parent -> child
    """
    class RelationshipType(models.TextChoices):
        BIOLOGICAL = 'BIOLOGICAL', _('Biological')
        ADOPTIVE = 'ADOPTIVE', _('Adoptive')
        FOSTER = 'FOSTER', _('Foster')
        STEP = 'STEP', _('Step')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='parent_child_edges')
    parent = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='children_relationships')
    child = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='parent_relationships')
    relationship_type = models.CharField(
        max_length=20, choices=RelationshipType.choices, default=RelationshipType.BIOLOGICAL
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('parent', 'child')
        indexes = [
            models.Index(fields=['family', 'parent']),
            models.Index(fields=['family', 'child']),
        ]

    def clean(self):
        if self.parent_id == self.child_id:
            raise ValidationError(_("A person cannot be their own parent."))

        if self.parent.family_id != self.family_id or self.child.family_id != self.family_id:
            raise ValidationError(_("Parent and child must belong to the same family workspace."))

        if self.parent.family_id != self.child.family_id:
            raise ValidationError(_("Cannot establish relationship across different families."))

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.parent.full_name} -> {self.child.full_name} ({self.relationship_type})"


class PartnerRelationship(models.Model):
    """
    Undirected or bi-directional union between two persons.
    """
    class RelationshipType(models.TextChoices):
        MARRIED = 'MARRIED', _('Married')
        DIVORCED = 'DIVORCED', _('Divorced')
        PARTNER = 'PARTNER', _('Partner')
        WIDOWED = 'WIDOWED', _('Widowed')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='partner_edges')
    person1 = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='partner_relationships_p1')
    person2 = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='partner_relationships_p2')
    relationship_type = models.CharField(
        max_length=20, choices=RelationshipType.choices, default=RelationshipType.MARRIED
    )
    marriage_date = models.DateField(null=True, blank=True)
    marriage_place = models.CharField(max_length=200, blank=True, default='')
    is_current = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['family', 'person1']),
            models.Index(fields=['family', 'person2']),
        ]

    def clean(self):
        if self.person1_id == self.person2_id:
            raise ValidationError(_("A person cannot be partnered with themselves."))

        if self.person1.family_id != self.family_id or self.person2.family_id != self.family_id:
            raise ValidationError(_("Both partners must belong to the same family workspace."))

        if self.person1.family_id != self.person2.family_id:
            raise ValidationError(_("Cannot establish partnership across different families."))

        # Check for duplicate partner edge in either order
        existing = PartnerRelationship.objects.filter(
            family=self.family
        ).filter(
            models.Q(person1=self.person1, person2=self.person2) |
            models.Q(person1=self.person2, person2=self.person1)
        ).exclude(id=self.id)

        if existing.exists():
            raise ValidationError(_("A partner relationship already exists between these two persons."))

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.person1.full_name} & {self.person2.full_name} ({self.relationship_type})"


class PersonAccountLink(models.Model):
    """
    Optional link connecting a genealogy tree Person to a registered User account.
    Allows living family members to claim their node in the tree.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='person_account_links')
    person = models.OneToOneField(Person, on_delete=models.CASCADE, related_name='account_link')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='claimed_person_nodes')
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_links'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('family', 'user')

    def __str__(self):
        return f"{self.user.email} -> {self.person.full_name} ({'Verified' if self.is_verified else 'Pending'})"


class PendingTreeChange(models.Model):
    """
    Change proposal submitted for workspace administrator review before merging into the graph.
    Used when workspace policy is set to ADMIN_APPROVAL.
    """
    class ChangeType(models.TextChoices):
        ADD_PERSON = 'ADD_PERSON', _('Add Person')
        EDIT_PERSON = 'EDIT_PERSON', _('Edit Person Details')
        ADD_RELATIONSHIP = 'ADD_RELATIONSHIP', _('Add Relationship')
        DELETE_RELATIONSHIP = 'DELETE_RELATIONSHIP', _('Delete Relationship')
        DELETE_PERSON = 'DELETE_PERSON', _('Delete Person')

    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending Review')
        APPROVED = 'APPROVED', _('Approved & Merged')
        REJECTED = 'REJECTED', _('Rejected')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='pending_tree_changes')
    proposed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tree_proposals')
    change_type = models.CharField(max_length=25, choices=ChangeType.choices)
    target_person = models.ForeignKey(Person, on_delete=models.SET_NULL, null=True, blank=True)
    payload = models.JSONField(help_text="Detailed change parameters and attributes")
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_proposals'
    )
    review_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Proposal {self.change_type} by {self.proposed_by.email} ({self.status})"
