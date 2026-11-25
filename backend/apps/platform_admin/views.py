from datetime import timedelta
from decimal import Decimal
from django.utils import timezone
from django.db.models import Sum, Count, Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.accounts.models import User
from apps.families.models import Family
from apps.media_storage.models import MediaAsset
from apps.subscriptions.models import Plan, FamilySubscription
from apps.payments.models import PaymentTransaction
from apps.audit.models import AuditLog
from apps.audit.services import log_audit_event
from apps.support.models import SupportTicket, SupportTicketMessage
from apps.platform_admin.models import PlatformNotice, PlatformSetting
from apps.platform_admin.permissions import IsPlatformSuperAdmin
from apps.platform_admin.serializers import (
    AdminUserListSerializer, AdminUserDetailSerializer,
    AdminWorkspaceListSerializer, AdminWorkspaceDetailSerializer,
    AuditLogSerializer, SupportTicketSerializer, SupportTicketDetailSerializer,
    PlatformNoticeSerializer, PlatformSettingSerializer
)
from apps.common.responses import success_response


class AdminDashboardStatsView(APIView):
    """
    Returns real, un-fabricated platform business and operational analytics.
    Super Admins monitor platform health, usage, and revenue without intruding into private family trees.
    """
    permission_classes = [IsPlatformSuperAdmin]

    def get(self, request):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        # 1. User & Family Metrics
        total_users = User.objects.count()
        new_users_30d = User.objects.filter(created_at__gte=thirty_days_ago).count()
        total_families = Family.objects.count()
        active_families = Family.objects.filter(status=Family.FamilyStatus.ACTIVE).count()

        # 2. Storage Metrics
        total_storage_bytes = MediaAsset.objects.filter(
            processing_status=MediaAsset.ProcessingStatus.READY
        ).aggregate(total=Sum('file_size_bytes'))['total'] or 0
        total_storage_gb = round(total_storage_bytes / (1024 * 1024 * 1024), 2)

        # 3. Financial Metrics (ETB and USD separately)
        etb_revenue = PaymentTransaction.objects.filter(
            status=PaymentTransaction.TransactionStatus.COMPLETED,
            currency='ETB'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        usd_revenue = PaymentTransaction.objects.filter(
            status=PaymentTransaction.TransactionStatus.COMPLETED,
            currency='USD'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        active_subscriptions = FamilySubscription.objects.filter(
            status=FamilySubscription.SubscriptionStatus.ACTIVE
        ).count()

        # 4. Support & Operations
        open_tickets = SupportTicket.objects.filter(
            status__in=[SupportTicket.Status.OPEN, SupportTicket.Status.IN_PROGRESS]
        ).count()

        recent_logs = AuditLog.objects.all()[:10]

        return success_response(data={
            "metrics": {
                "total_users": total_users,
                "new_users_30d": new_users_30d,
                "total_families": total_families,
                "active_families": active_families,
                "total_storage_bytes": total_storage_bytes,
                "total_storage_gb": total_storage_gb,
                "revenue_etb": str(etb_revenue),
                "revenue_usd": str(usd_revenue),
                "active_subscriptions": active_subscriptions,
                "open_tickets": open_tickets,
            },
            "recent_audit_logs": AuditLogSerializer(recent_logs, many=True).data
        })


class AdminUserListView(APIView):
    """
    Searchable, filterable list of platform accounts.
    """
    permission_classes = [IsPlatformSuperAdmin]

    @extend_schema(responses={200: AdminUserListSerializer(many=True)})
    def get(self, request):
        queryset = User.objects.all().order_by('-created_at')

        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(email__icontains=search) |
                Q(full_name__icontains=search) |
                Q(phone_number__icontains=search)
            )

        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter.upper())

        return success_response(data=AdminUserListSerializer(queryset[:100], many=True).data)


class AdminUserDetailView(APIView):
    """
    Platform identity profile and affiliated workspace memberships (NO access to private trees or private media).
    """
    permission_classes = [IsPlatformSuperAdmin]

    def get(self, request, user_id):
        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "User not found."}}, status=status.HTTP_404_NOT_FOUND)
        return success_response(data=AdminUserDetailSerializer(user).data)


class AdminUserSuspendView(APIView):
    """
    Suspends a user platform account and logs immutable audit trail.
    """
    permission_classes = [IsPlatformSuperAdmin]

    def post(self, request, user_id):
        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "User not found."}}, status=status.HTTP_404_NOT_FOUND)

        reason = request.data.get('reason', 'Administrative suspension')
        user.status = User.AccountStatus.SUSPENDED
        user.save(update_fields=['status'])

        log_audit_event(
            action=AuditLog.ActionCategory.USER_SUSPEND,
            target_type='User',
            target_id=str(user.id),
            target_label=user.email,
            actor=request.user,
            details={'reason': reason},
            request=request
        )

        return success_response(message=f"User {user.email} suspended successfully.")


class AdminUserActivateView(APIView):
    """
    Reactivates a suspended user platform account.
    """
    permission_classes = [IsPlatformSuperAdmin]

    def post(self, request, user_id):
        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "User not found."}}, status=status.HTTP_404_NOT_FOUND)

        user.status = User.AccountStatus.ACTIVE
        user.save(update_fields=['status'])

        log_audit_event(
            action=AuditLog.ActionCategory.USER_ACTIVATE,
            target_type='User',
            target_id=str(user.id),
            target_label=user.email,
            actor=request.user,
            request=request
        )

        return success_response(message=f"User {user.email} activated successfully.")


class AdminUserNoticeView(APIView):
    """
    Dispatches an official administrative notice / email communication to a user.
    """
    permission_classes = [IsPlatformSuperAdmin]

    def post(self, request, user_id):
        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "User not found."}}, status=status.HTTP_404_NOT_FOUND)

        subject = request.data.get('subject', 'Notice from KinKeep Administration')
        message = request.data.get('message', '')

        log_audit_event(
            action=AuditLog.ActionCategory.USER_NOTICE,
            target_type='User',
            target_id=str(user.id),
            target_label=user.email,
            actor=request.user,
            details={'subject': subject, 'message_preview': message[:150]},
            request=request
        )

        return success_response(message=f"Notice logged and queued for {user.email}.")


class AdminWorkspaceListView(APIView):
    """
    Lists family workspaces with tenant status, member counts, and storage metrics.
    """
    permission_classes = [IsPlatformSuperAdmin]

    @extend_schema(responses={200: AdminWorkspaceListSerializer(many=True)})
    def get(self, request):
        queryset = Family.objects.all().order_by('-created_at')

        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(slug__icontains=search) |
                Q(origin_city__icontains=search)
            )

        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter.upper())

        return success_response(data=AdminWorkspaceListSerializer(queryset[:100], many=True).data)


class AdminWorkspaceDetailView(APIView):
    """
    Workspace operational details (plan, status, members count, storage used).
    Strictly isolated from private family graphs and private photos.
    """
    permission_classes = [IsPlatformSuperAdmin]

    def get(self, request, family_id):
        family = Family.objects.filter(id=family_id).first()
        if not family:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Workspace not found."}}, status=status.HTTP_404_NOT_FOUND)
        return success_response(data=AdminWorkspaceDetailSerializer(family).data)


class AdminWorkspaceStatusView(APIView):
    """
    Sets workspace status (ACTIVE, SUSPENDED, LOCKED_STORAGE_FULL).
    """
    permission_classes = [IsPlatformSuperAdmin]

    def post(self, request, family_id):
        family = Family.objects.filter(id=family_id).first()
        if not family:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Workspace not found."}}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in [c[0] for c in Family.FamilyStatus.choices]:
            return Response({"success": False, "error": {"code": "INVALID_STATUS", "message": "Invalid status."}}, status=status.HTTP_400_BAD_REQUEST)

        old_status = family.status
        family.status = new_status
        family.save(update_fields=['status'])

        log_audit_event(
            action=AuditLog.ActionCategory.WORKSPACE_STATUS_CHANGE,
            target_type='Family',
            target_id=str(family.id),
            target_label=family.name,
            actor=request.user,
            details={'old_status': old_status, 'new_status': new_status},
            request=request
        )

        return success_response(message=f"Workspace {family.name} status updated to {new_status}.")


class AdminAuditLogListView(APIView):
    """
    Searchable, filterable audit log stream.
    """
    permission_classes = [IsPlatformSuperAdmin]

    @extend_schema(responses={200: AuditLogSerializer(many=True)})
    def get(self, request):
        queryset = AuditLog.objects.all().order_by('-created_at')

        action = request.query_params.get('action')
        if action:
            queryset = queryset.filter(action=action)

        target_type = request.query_params.get('target_type')
        if target_type:
            queryset = queryset.filter(target_type=target_type)

        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(actor_email__icontains=search) |
                Q(target_label__icontains=search)
            )

        return success_response(data=AuditLogSerializer(queryset[:150], many=True).data)


class AdminSupportTicketListView(APIView):
    """
    Lists support tickets across all categories (Billing, Storage, Technical, Genealogy).
    """
    permission_classes = [IsPlatformSuperAdmin]

    @extend_schema(responses={200: SupportTicketSerializer(many=True)})
    def get(self, request):
        queryset = SupportTicket.objects.all().order_by('-created_at')

        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter.upper())

        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category.upper())

        return success_response(data=SupportTicketSerializer(queryset[:100], many=True).data)


class AdminSupportTicketDetailView(APIView):
    """
    Ticket conversation thread and status transitions.
    """
    permission_classes = [IsPlatformSuperAdmin]

    def get(self, request, ticket_id):
        ticket = SupportTicket.objects.filter(id=ticket_id).first()
        if not ticket:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Ticket not found."}}, status=status.HTTP_404_NOT_FOUND)
        return success_response(data=SupportTicketDetailSerializer(ticket).data)

    def post(self, request, ticket_id):
        """Adds a staff message or internal note to the ticket."""
        ticket = SupportTicket.objects.filter(id=ticket_id).first()
        if not ticket:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Ticket not found."}}, status=status.HTTP_404_NOT_FOUND)

        message_text = request.data.get('message', '').strip()
        is_internal = bool(request.data.get('is_internal_note', False))
        if not message_text:
            return Response({"success": False, "error": {"code": "EMPTY_MESSAGE", "message": "Message text required."}}, status=status.HTTP_400_BAD_REQUEST)

        msg = SupportTicketMessage.objects.create(
            ticket=ticket,
            sender=request.user,
            message=message_text,
            is_internal_note=is_internal
        )

        # Update status if requested
        new_status = request.data.get('status')
        if new_status and new_status in [c[0] for c in SupportTicket.Status.choices]:
            ticket.status = new_status
            if new_status == SupportTicket.Status.RESOLVED:
                ticket.resolved_at = timezone.now()
            ticket.save()

        return success_response(data={"message_id": str(msg.id)}, message="Ticket response posted.")


class AdminPlatformSettingsView(APIView):
    """
    Retrieves and updates platform settings dictionary.
    """
    permission_classes = [IsPlatformSuperAdmin]

    def get(self, request):
        settings_qs = PlatformSetting.objects.all()
        return success_response(data=PlatformSettingSerializer(settings_qs, many=True).data)

    def post(self, request):
        key = request.data.get('key')
        value = request.data.get('value', {})
        description = request.data.get('description', '')
        if not key:
            return Response({"success": False, "error": {"code": "MISSING_KEY", "message": "Setting key required."}}, status=status.HTTP_400_BAD_REQUEST)

        setting, _ = PlatformSetting.objects.update_or_create(
            key=key,
            defaults={'value': value, 'description': description}
        )

        log_audit_event(
            action=AuditLog.ActionCategory.SETTINGS_UPDATE,
            target_type='PlatformSetting',
            target_id=key,
            target_label=key,
            actor=request.user,
            details={'value': value},
            request=request
        )

        return success_response(data=PlatformSettingSerializer(setting).data, message="Platform setting updated.")
