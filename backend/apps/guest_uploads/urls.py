from django.urls import path
from apps.guest_uploads.views import (
    EventQRTokenManageView, EventQRTokenRevokeView,
    PublicQRInspectView, PublicGuestSessionStartView,
    PublicGuestUploadView
)

urlpatterns = [
    # Family workspace QR token management
    path('by-slug/<str:slug>/events/<str:event_id>/qr-tokens/', EventQRTokenManageView.as_view(), name='slug-event-qr-tokens'),
    path('by-slug/<str:slug>/events/qr-tokens/<str:token_id>/revoke/', EventQRTokenRevokeView.as_view(), name='slug-event-qr-revoke'),
    path('<uuid:id>/events/<str:event_id>/qr-tokens/', EventQRTokenManageView.as_view(), name='event-qr-tokens'),
    path('<uuid:id>/events/qr-tokens/<str:token_id>/revoke/', EventQRTokenRevokeView.as_view(), name='event-qr-revoke'),

    # Public Guest Portal Endpoints (No account required)
    path('public/qr/inspect/<str:raw_token>/', PublicQRInspectView.as_view(), name='public-qr-inspect'),
    path('public/sessions/start/', PublicGuestSessionStartView.as_view(), name='public-guest-session-start'),
    path('public/upload/', PublicGuestUploadView.as_view(), name='public-guest-upload'),
]
