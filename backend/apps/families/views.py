from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse
from apps.common.responses import success_response
from apps.families.models import Family, FamilyMembership, FamilyRole, FamilyInvitation
from apps.families.permissions import IsFamilyMember, IsFamilyAdmin, IsFamilyOwner
from apps.families.serializers import (
    FamilySerializer, FamilyMembershipSerializer, CreateFamilySerializer,
    InviteMemberSerializer, UpdateMemberRoleSerializer, InvitationDetailSerializer
)
from apps.families.services import (
    create_family_workspace, create_family_invitation, accept_family_invitation, hash_token
)

class FamilyListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: FamilySerializer(many=True)})
    def get(self, request):
        """Lists all family workspaces the authenticated user belongs to."""
        memberships = FamilyMembership.objects.filter(
            user=request.user,
            status=FamilyMembership.MembershipStatus.ACTIVE
        ).select_related('family', 'role')

        families = [m.family for m in memberships]
        return success_response(data=FamilySerializer(families, many=True).data)

    @extend_schema(request=CreateFamilySerializer, responses={201: FamilySerializer})
    def post(self, request):
        """Creates a new family workspace. Creator automatically becomes Family Owner."""
        serializer = CreateFamilySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        family = create_family_workspace(
            creator=request.user,
            name=serializer.validated_data['name'],
            description=serializer.validated_data.get('description', ''),
            origin_city=serializer.validated_data.get('origin_city', ''),
            origin_country=serializer.validated_data.get('origin_country', 'Ethiopia'),
        )
        return success_response(
            data=FamilySerializer(family).data,
            message="Family workspace created successfully.",
            status_code=status.HTTP_201_CREATED
        )

class FamilyDetailView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(responses={200: FamilySerializer})
    def get(self, request, *args, **kwargs):
        """Fetches family workspace profile and configuration."""
        return success_response(data=FamilySerializer(request.family).data)

    @extend_schema(request=CreateFamilySerializer, responses={200: FamilySerializer})
    def patch(self, request, *args, **kwargs):
        """Updates workspace metadata (Admin or Owner only)."""
        if not IsFamilyAdmin().has_permission(request, self):
            return Response({
                "success": False,
                "error": {"code": "FORBIDDEN", "message": "Only family administrators can update workspace settings."}
            }, status=status.HTTP_403_FORBIDDEN)

        family = request.family
        data = request.data
        if 'name' in data: family.name = data['name']
        if 'description' in data: family.description = data['description']
        if 'origin_city' in data: family.origin_city = data['origin_city']
        if 'origin_country' in data: family.origin_country = data['origin_country']
        if 'settings' in data and isinstance(data['settings'], dict):
            family.settings.update(data['settings'])
        family.save()

        return success_response(data=FamilySerializer(family).data, message="Workspace updated successfully.")

    def delete(self, request, *args, **kwargs):
        """Permanently deletes a family workspace (Owner only)."""
        if not IsFamilyOwner().has_permission(request, self):
            return Response({
                "success": False,
                "error": {"code": "FORBIDDEN", "message": "Only the Family Owner can terminate the workspace."}
            }, status=status.HTTP_403_FORBIDDEN)

        request.family.delete()
        return success_response(message="Family workspace deleted successfully.")

class FamilyMemberListView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(responses={200: FamilyMembershipSerializer(many=True)})
    def get(self, request, *args, **kwargs):
        """Lists active members of this family workspace."""
        members = FamilyMembership.objects.filter(
            family=request.family,
            status=FamilyMembership.MembershipStatus.ACTIVE
        ).select_related('user', 'role')
        return success_response(data=FamilyMembershipSerializer(members, many=True).data)

    @extend_schema(request=InviteMemberSerializer)
    def post(self, request, *args, **kwargs):

        """Invites a new member by email (Admin or Owner only)."""
        if not IsFamilyAdmin().has_permission(request, self):
            return Response({
                "success": False,
                "error": {"code": "FORBIDDEN", "message": "Only administrators can invite new members."}
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = InviteMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        invitation, raw_token = create_family_invitation(
            family=request.family,
            inviter=request.user,
            email=serializer.validated_data['email'],
            role_code=serializer.validated_data['role']
        )

        return success_response(
            data={
                "invitation_id": invitation.id,
                "email": invitation.email,
                "role": invitation.role.name,
                "invitation_token": raw_token, # Sent via email / link
            },
            message=f"Invitation dispatched to {invitation.email}."
        )

class FamilyMemberDetailView(APIView):
    permission_classes = [IsFamilyAdmin]

    @extend_schema(request=UpdateMemberRoleSerializer)
    def patch(self, request, id, member_id):
        """Updates a member's role or nickname."""
        membership = FamilyMembership.objects.filter(id=member_id, family=request.family).first()
        if not membership:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Member not found."}}, status=status.HTTP_404_NOT_FOUND)

        if membership.role.code == FamilyRole.SystemRole.OWNER and request.family_membership.role.code != FamilyRole.SystemRole.OWNER:
            return Response({"success": False, "error": {"code": "FORBIDDEN", "message": "Cannot modify Owner role."}}, status=status.HTTP_403_FORBIDDEN)

        serializer = UpdateMemberRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_role = FamilyRole.objects.get(code=serializer.validated_data['role'])
        membership.role = new_role
        if 'nickname' in serializer.validated_data:
            membership.nickname = serializer.validated_data['nickname']
        membership.save()

        return success_response(data=FamilyMembershipSerializer(membership).data, message="Member role updated.")

    def delete(self, request, id, member_id):
        """Removes a member from the workspace."""
        membership = FamilyMembership.objects.filter(id=member_id, family=request.family).first()
        if not membership:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Member not found."}}, status=status.HTTP_404_NOT_FOUND)

        if membership.role.code == FamilyRole.SystemRole.OWNER:
            return Response({"success": False, "error": {"code": "FORBIDDEN", "message": "Family Owner cannot be removed."}}, status=status.HTTP_403_FORBIDDEN)

        membership.status = FamilyMembership.MembershipStatus.LEFT
        membership.save(update_fields=['status'])
        return success_response(message="Member removed from family workspace.")

class InvitationInspectView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        """Publicly verifies an invitation token and returns family title & role preview."""
        token_h = hash_token(token)
        invitation = FamilyInvitation.objects.filter(
            token_hash=token_h,
            status=FamilyInvitation.InvitationStatus.PENDING
        ).select_related('family', 'role', 'invited_by').first()

        if not invitation or not invitation.is_valid:
            return Response({"success": False, "error": {"code": "INVALID_TOKEN", "message": "This invitation link is invalid or has expired."}}, status=status.HTTP_404_NOT_FOUND)

        return success_response(data=InvitationDetailSerializer(invitation).data)

class InvitationAcceptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, token):
        """Authenticated acceptance of an invitation token."""
        try:
            membership = accept_family_invitation(token, request.user)
        except ValueError as e:
            return Response({"success": False, "error": {"code": "INVALID_INVITATION", "message": str(e)}}, status=status.HTTP_400_BAD_REQUEST)

        return success_response(
            data={"family_slug": membership.family.slug, "family_name": membership.family.name},
            message=f"Welcome to the {membership.family.name} family workspace!"
        )

class InvitationDeclineView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, token):
        """Decline / reject an invitation."""
        token_h = hash_token(token)
        invitation = FamilyInvitation.objects.filter(
            token_hash=token_h,
            status=FamilyInvitation.InvitationStatus.PENDING
        ).first()

        if not invitation or not invitation.is_valid:
            return Response({"success": False, "error": {"code": "INVALID_TOKEN", "message": "This invitation link is invalid or has expired."}}, status=status.HTTP_404_NOT_FOUND)

        invitation.status = FamilyInvitation.InvitationStatus.REVOKED
        invitation.save(update_fields=['status'])
        return success_response(message="Invitation declined.")

class FamilyDashboardSummaryView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, id=None, slug=None):
        """Aggregates high-level metrics for the workspace dashboard."""
        family = request.family
        member_count = family.memberships.filter(status=FamilyMembership.MembershipStatus.ACTIVE).count()

        return success_response(data={
            "family_id": family.id,
            "family_name": family.name,
            "family_slug": family.slug,
            "origin_city": family.origin_city,
            "origin_country": family.origin_country,
            "member_count": member_count,
            "generations_count": 3, # Dynamic in Phase 3
            "memories_count": 0,    # Dynamic in Phase 6
            "events_count": 0,      # Dynamic in Phase 5
            "storage_used_bytes": 0,
            "storage_limit_bytes": 2 * 1024 * 1024 * 1024, # 2 GB default
        })

