from django.urls import path
from apps.events.views import (
    EventListView, EventDetailView, EventGuestListView,
    EventGuestRSVPView, EventGuestbookView
)

urlpatterns = [
    # Slug-based routes
    path('by-slug/<str:slug>/events/', EventListView.as_view(), name='slug-events-list'),
    path('by-slug/<str:slug>/events/<str:event_id>/', EventDetailView.as_view(), name='slug-events-detail'),
    path('by-slug/<str:slug>/events/<str:event_id>/guests/', EventGuestListView.as_view(), name='slug-events-guests'),
    path('by-slug/<str:slug>/events/<str:event_id>/guests/<uuid:guest_id>/rsvp/', EventGuestRSVPView.as_view(), name='slug-events-guest-rsvp'),
    path('by-slug/<str:slug>/events/<str:event_id>/guestbook/', EventGuestbookView.as_view(), name='slug-events-guestbook'),

    # UUID-based routes
    path('<uuid:id>/events/', EventListView.as_view(), name='events-list'),
    path('<uuid:id>/events/<str:event_id>/', EventDetailView.as_view(), name='events-detail'),
    path('<uuid:id>/events/<str:event_id>/guests/', EventGuestListView.as_view(), name='events-guests'),
    path('<uuid:id>/events/<str:event_id>/guests/<uuid:guest_id>/rsvp/', EventGuestRSVPView.as_view(), name='events-guest-rsvp'),
    path('<uuid:id>/events/<str:event_id>/guestbook/', EventGuestbookView.as_view(), name='events-guestbook'),
]
