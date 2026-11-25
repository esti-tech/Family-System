from django.urls import path
from apps.platform_admin.views import (
    AdminDashboardStatsView, AdminUserListView, AdminUserDetailView,
    AdminUserSuspendView, AdminUserActivateView, AdminUserNoticeView,
    AdminWorkspaceListView, AdminWorkspaceDetailView, AdminWorkspaceStatusView,
    AdminAuditLogListView, AdminSupportTicketListView, AdminSupportTicketDetailView,
    AdminPlatformSettingsView
)

urlpatterns = [
    # Dashboard stats
    path('dashboard/', AdminDashboardStatsView.as_view(), name='admin-dashboard'),

    # User management
    path('users/', AdminUserListView.as_view(), name='admin-users-list'),
    path('users/<uuid:user_id>/', AdminUserDetailView.as_view(), name='admin-users-detail'),
    path('users/<uuid:user_id>/suspend/', AdminUserSuspendView.as_view(), name='admin-users-suspend'),
    path('users/<uuid:user_id>/activate/', AdminUserActivateView.as_view(), name='admin-users-activate'),
    path('users/<uuid:user_id>/notice/', AdminUserNoticeView.as_view(), name='admin-users-notice'),

    # Workspace management
    path('workspaces/', AdminWorkspaceListView.as_view(), name='admin-workspaces-list'),
    path('workspaces/<uuid:family_id>/', AdminWorkspaceDetailView.as_view(), name='admin-workspaces-detail'),
    path('workspaces/<uuid:family_id>/status/', AdminWorkspaceStatusView.as_view(), name='admin-workspaces-status'),

    # Audit logging
    path('audit-logs/', AdminAuditLogListView.as_view(), name='admin-audit-logs'),

    # Support management
    path('support/', AdminSupportTicketListView.as_view(), name='admin-support-list'),
    path('support/<uuid:ticket_id>/', AdminSupportTicketDetailView.as_view(), name='admin-support-detail'),

    # Settings
    path('settings/', AdminPlatformSettingsView.as_view(), name='admin-settings'),
]
