from rest_framework import permissions
from apps.families.models import FamilyMembership, FamilyRole

class IsFamilyMember(permissions.BasePermission):
    """Verifies the authenticated user is an active member of the family."""
    def has_permission(self, request, view):
        family_id = view.kwargs.get('family_id') or view.kwargs.get('id')
        if not family_id or not request.user or not request.user.is_authenticated:
            return False

        membership = FamilyMembership.objects.filter(
            family_id=family_id,
            user=request.user,
            status=FamilyMembership.MembershipStatus.ACTIVE
        ).select_related('role').first()

        if not membership:
            return False

        # Bind active family and membership to request for subsequent processing
        request.family_membership = membership
        request.family = membership.family
        return True

class IsFamilyAdmin(IsFamilyMember):
    """Requires role to be FAMILY_OWNER or FAMILY_ADMIN."""
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.family_membership.role.code in [
            FamilyRole.SystemRole.OWNER,
            FamilyRole.SystemRole.ADMIN,
        ]

class IsFamilyOwner(IsFamilyMember):
    """Requires role to be FAMILY_OWNER."""
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.family_membership.role.code == FamilyRole.SystemRole.OWNER
