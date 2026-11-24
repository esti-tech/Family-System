from django.urls import path
from apps.heritage.views import (
    StoryListView, StoryDetailView, StoryPublishView,
    TimelineMilestoneListView, HeritageOverviewView
)

urlpatterns = [
    # Slug-based routes
    path('by-slug/<str:slug>/heritage/overview/', HeritageOverviewView.as_view(), name='slug-heritage-overview'),
    path('by-slug/<str:slug>/stories/', StoryListView.as_view(), name='slug-heritage-story-list'),
    path('by-slug/<str:slug>/stories/<str:story_id>/', StoryDetailView.as_view(), name='slug-heritage-story-detail'),
    path('by-slug/<str:slug>/stories/<str:story_id>/publish/', StoryPublishView.as_view(), name='slug-heritage-story-publish'),
    path('by-slug/<str:slug>/timeline/', TimelineMilestoneListView.as_view(), name='slug-heritage-timeline-list'),

    # UUID-based routes
    path('<uuid:id>/heritage/overview/', HeritageOverviewView.as_view(), name='heritage-overview'),
    path('<uuid:id>/stories/', StoryListView.as_view(), name='heritage-story-list'),
    path('<uuid:id>/stories/<str:story_id>/', StoryDetailView.as_view(), name='heritage-story-detail'),
    path('<uuid:id>/stories/<str:story_id>/publish/', StoryPublishView.as_view(), name='heritage-story-publish'),
    path('<uuid:id>/timeline/', TimelineMilestoneListView.as_view(), name='heritage-timeline-list'),
]
