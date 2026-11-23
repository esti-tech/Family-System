from rest_framework import serializers
from apps.families.models import Family, FamilyRole, FamilyMembership, FamilyInvitation
from apps.accounts.serializers import UserSerializer

class FamilyRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyRole
        fields = ['id', 'code', 'name', 'description']

class FamilySerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Family
        fields = [
            'id', 'name', 'slug', 'description', 'origin_city', 'origin_country',
            'cover_media_id', 'created_by', 'status', 'settings', 'created_at', 'member_count'
        ]
        read_only_fields = ['id', 'slug', 'status', 'created_by', 'created_at']

    def get_member_count(self, obj):
        return obj.memberships.filter(status=FamilyMembership.MembershipStatus.ACTIVE).count()

class FamilyMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    role = FamilyRoleSerializer(read_only=True)
    role_code = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = FamilyMembership
        fields = ['id', 'family_id', 'user', 'role', 'role_code', 'nickname', 'status', 'joined_at']
        read_only_fields = ['id', 'family_id', 'user', 'role', 'joined_at']

class CreateFamilySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    description = serializers.CharField(required=False, allow_blank=True)
    origin_city = serializers.CharField(max_length=120, required=False, allow_blank=True)
    origin_country = serializers.CharField(max_length=100, default='Ethiopia')

class InviteMemberSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=320)
    role = serializers.ChoiceField(choices=FamilyRole.SystemRole.choices, default=FamilyRole.SystemRole.VIEWER)

class UpdateMemberRoleSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=FamilyRole.SystemRole.choices)
    nickname = serializers.CharField(max_length=120, required=False, allow_blank=True)

class InvitationDetailSerializer(serializers.ModelSerializer):
    family_name = serializers.CharField(source='family.name', read_only=True)
    role_name = serializers.CharField(source='role.name', read_only=True)
    inviter_name = serializers.CharField(source='invited_by.full_name', read_only=True)

    class Meta:
        model = FamilyInvitation
        fields = ['id', 'family_name', 'role_name', 'inviter_name', 'status', 'expires_at']
