import secrets
import hashlib
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from apps.families.models import Family, FamilyRole, FamilyMembership, FamilyInvitation
from apps.accounts.models import User

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode('utf-8')).hexdigest()

def ensure_system_roles_exist():
    """Seeds the 5 fundamental system roles if they don't already exist."""
    roles_data = [
        (FamilyRole.SystemRole.OWNER, 'Family Owner', 'Controls workspace lifecycle, subscription, and permissions.'),
        (FamilyRole.SystemRole.ADMIN, 'Family Administrator', 'Manages membership, approves submissions, updates settings.'),
        (FamilyRole.SystemRole.EDITOR, 'Family Editor', 'Creates and edits tree persons, stories, timeline, and memories.'),
        (FamilyRole.SystemRole.REVIEWER, 'Family Reviewer', 'Reviews pending submissions, guest uploads, and proposed tree changes.'),
        (FamilyRole.SystemRole.VIEWER, 'Family Viewer', 'Read-only access to published family records.'),
    ]
    for code, name, desc in roles_data:
        FamilyRole.objects.get_or_create(
            code=code,
            defaults={'name': name, 'description': desc, 'is_system': True}
        )

@transaction.atomic
def create_family_workspace(creator: User, name: str, description: str = "", origin_city: str = "", origin_country: str = "Ethiopia") -> Family:
    """Creates a new family workspace and sets the creator as Family Owner."""
    ensure_system_roles_exist()
    owner_role = FamilyRole.objects.get(code=FamilyRole.SystemRole.OWNER)

    family = Family.objects.create(
        name=name,
        description=description,
        origin_city=origin_city,
        origin_country=origin_country,
        created_by=creator,
    )

    FamilyMembership.objects.create(
        family=family,
        user=creator,
        role=owner_role,
        nickname="Owner",
        status=FamilyMembership.MembershipStatus.ACTIVE
    )

    return family

def create_family_invitation(family: Family, inviter: User, email: str, role_code: str) -> tuple[FamilyInvitation, str]:
    """Generates an invitation with an expiring SHA-256 hashed token."""
    ensure_system_roles_exist()
    role = FamilyRole.objects.get(code=role_code)

    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_token(raw_token)
    expires_at = timezone.now() + timedelta(days=7)

    # Invalidate previous pending invitations for same email & family
    FamilyInvitation.objects.filter(
        family=family,
        email=email.strip().lower(),
        status=FamilyInvitation.InvitationStatus.PENDING
    ).update(status=FamilyInvitation.InvitationStatus.REVOKED)

    invitation = FamilyInvitation.objects.create(
        family=family,
        email=email.strip().lower(),
        role=role,
        token_hash=token_hash,
        invited_by=inviter,
        expires_at=expires_at,
    )

    return invitation, raw_token

@transaction.atomic
def accept_family_invitation(raw_token: str, user: User) -> FamilyMembership:
    """Consumes an invitation token and adds user to the family workspace."""
    token_hash = hash_token(raw_token)
    now = timezone.now()

    invitation = FamilyInvitation.objects.filter(
        token_hash=token_hash,
        status=FamilyInvitation.InvitationStatus.PENDING,
        expires_at__gt=now
    ).select_related('family', 'role').first()

    if not invitation:
        raise ValueError("Invalid, revoked, or expired invitation token.")

    # Check if user is already an active member
    membership = FamilyMembership.objects.filter(family=invitation.family, user=user).first()
    if membership:
        if membership.status == FamilyMembership.MembershipStatus.ACTIVE:
            invitation.status = FamilyInvitation.InvitationStatus.ACCEPTED
            invitation.save(update_fields=['status'])
            return membership
        else:
            membership.status = FamilyMembership.MembershipStatus.ACTIVE
            membership.role = invitation.role
            membership.save(update_fields=['status', 'role'])
    else:
        membership = FamilyMembership.objects.create(
            family=invitation.family,
            user=user,
            role=invitation.role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

    invitation.status = FamilyInvitation.InvitationStatus.ACCEPTED
    invitation.save(update_fields=['status'])
    return membership
