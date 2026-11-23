from django.urls import path
from apps.families.views import (
    FamilyListCreateView, FamilyDetailView, FamilyMemberListView,
    FamilyMemberDetailView, InvitationInspectView, InvitationAcceptView,
    FamilyDashboardSummaryView
)

urlpatterns = [
    path('', FamilyListCreateView.as_view(), name='family-list-create'),
    path('<uuid:id>', FamilyDetailView.as_view(), name='family-detail'),
    path('<uuid:id>/dashboard-summary', FamilyDashboardSummaryView.as_view(), name='family-dashboard-summary'),
    path('<uuid:id>/members', FamilyMemberListView.as_view(), name='family-members'),
    path('<uuid:id>/members/<uuid:member_id>', FamilyMemberDetailView.as_view(), name='family-member-detail'),
    path('<uuid:id>/invitations', FamilyMemberListView.as_view(), name='family-invitations'),
    path('invitations/<str:token>', InvitationInspectView.as_view(), name='invitation-inspect'),
    path('invitations/<str:token>/accept', InvitationAcceptView.as_view(), name='invitation-accept'),
]
