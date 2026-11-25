from django.db.models import Sum
from rest_framework import serializers
from apps.accounts.models import User
from apps.families.models import Family, FamilyMembership
from apps.audit.models import AuditLog
from apps.support.models import SupportTicket, SupportTicketMessage
from apps.platform_admin.models import PlatformNotice, PlatformSetting
from apps.media_storage.models import MediaAsset


class AdminUserListSerializer(serializers.ModelSerializer):
    family_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'phone_number', 'status',
            'is_verified', 'is_staff', 'family_count', 'created_at'
        ]

    def get_family_count(self, obj):
        return obj.family_memberships.count()


class AdminUserDetailSerializer(serializers.ModelSerializer):
    workspaces = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'phone_number', 'status',
            'is_verified', 'is_staff', 'workspaces', 'created_at', 'updated_at'
        ]

    def get_workspaces(self, obj):
        memberships = obj.family_memberships.select_related('family', 'role')
        return [
            {
                "family_id": str(m.family.id),
                "family_name": m.family.name,
                "family_slug": m.family.slug,
                "role_name": m.role.name,
                "status": m.status,
                "joined_at": m.joined_at
            }
            for m in memberships
        ]


class AdminWorkspaceListSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    storage_used_gb = serializers.SerializerMethodField()
    plan_name = serializers.SerializerMethodField()

    class Meta:
        model = Family
        fields = [
            'id', 'name', 'slug', 'origin_city', 'origin_country',
            'status', 'member_count', 'storage_used_gb', 'plan_name', 'created_at'
        ]

    def get_member_count(self, obj):
        return obj.memberships.filter(status='ACTIVE').count()

    def get_storage_used_gb(self, obj):
        used = MediaAsset.objects.filter(
            family=obj, processing_status=MediaAsset.ProcessingStatus.READY
        ).aggregate(total=Sum('file_size_bytes'))['total'] or 0
        return round(used / (1024 * 1024 * 1024), 2)

    def get_plan_name(self, obj):
        if hasattr(obj, 'subscription') and obj.subscription:
            return obj.subscription.plan.name
        return "Free Heritage"


class AdminWorkspaceDetailSerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    member_count = serializers.SerializerMethodField()
    storage_used_gb = serializers.SerializerMethodField()
    plan_name = serializers.SerializerMethodField()
    subscription_status = serializers.SerializerMethodField()

    class Meta:
        model = Family
        fields = [
            'id', 'name', 'slug', 'description', 'origin_city', 'origin_country',
            'status', 'created_by_email', 'member_count', 'storage_used_gb',
            'plan_name', 'subscription_status', 'created_at', 'updated_at'
        ]

    def get_member_count(self, obj):
        return obj.memberships.filter(status='ACTIVE').count()

    def get_storage_used_gb(self, obj):
        used = MediaAsset.objects.filter(
            family=obj, processing_status=MediaAsset.ProcessingStatus.READY
        ).aggregate(total=Sum('file_size_bytes'))['total'] or 0
        return round(used / (1024 * 1024 * 1024), 2)

    def get_plan_name(self, obj):
        if hasattr(obj, 'subscription') and obj.subscription:
            return obj.subscription.plan.name
        return "Free Heritage"

    def get_subscription_status(self, obj):
        if hasattr(obj, 'subscription') and obj.subscription:
            return obj.subscription.status
        return "ACTIVE"


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = [
            'id', 'actor_email', 'action', 'target_type', 'target_id',
            'target_label', 'ip_address', 'user_agent', 'details', 'created_at'
        ]


class SupportTicketMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicketMessage
        fields = ['id', 'sender_name', 'message', 'is_internal_note', 'created_at']

    def get_sender_name(self, obj):
        if obj.sender:
            return obj.sender.full_name or obj.sender.email
        return "Support Agent"


class SupportTicketSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    family_name = serializers.CharField(source='family.name', read_only=True)
    messages_count = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_number', 'user_email', 'family_name', 'subject',
            'category', 'priority', 'status', 'description', 'messages_count',
            'created_at', 'resolved_at'
        ]

    def get_messages_count(self, obj):
        return obj.messages.count()


class SupportTicketDetailSerializer(SupportTicketSerializer):
    messages = SupportTicketMessageSerializer(many=True, read_only=True)

    class Meta(SupportTicketSerializer.Meta):
        fields = SupportTicketSerializer.Meta.fields + ['messages']


class PlatformNoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformNotice
        fields = ['id', 'title', 'message', 'notice_type', 'is_active', 'created_at']


class PlatformSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSetting
        fields = ['key', 'value', 'description', 'updated_at']
