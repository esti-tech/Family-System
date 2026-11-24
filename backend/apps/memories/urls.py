from django.urls import path
from apps.memories.views import (
    MemoryListView, MemoryDetailView, MemoryTrashView,
    ModerationQueueView, AlbumListView, AlbumDetailView,
    AlbumAddMemoriesView
)

urlpatterns = [
    # Slug-based routes
    path('by-slug/<str:slug>/memories/', MemoryListView.as_view(), name='slug-memories-list'),
    path('by-slug/<str:slug>/memories/trash/', MemoryTrashView.as_view(), name='slug-memories-trash-list'),
    path('by-slug/<str:slug>/memories/trash/<uuid:memory_id>/<str:action>/', MemoryTrashView.as_view(), name='slug-memories-trash-action'),
    path('by-slug/<str:slug>/memories/moderation/', ModerationQueueView.as_view(), name='slug-memories-moderation-list'),
    path('by-slug/<str:slug>/memories/moderation/<uuid:memory_id>/', ModerationQueueView.as_view(), name='slug-memories-moderation-action'),
    path('by-slug/<str:slug>/memories/<uuid:memory_id>/', MemoryDetailView.as_view(), name='slug-memories-detail'),
    path('by-slug/<str:slug>/albums/', AlbumListView.as_view(), name='slug-albums-list'),
    path('by-slug/<str:slug>/albums/<str:album_id>/', AlbumDetailView.as_view(), name='slug-albums-detail'),
    path('by-slug/<str:slug>/albums/<str:album_id>/add-memories/', AlbumAddMemoriesView.as_view(), name='slug-albums-add-memories'),

    # UUID-based routes
    path('<uuid:id>/memories/', MemoryListView.as_view(), name='memories-list'),
    path('<uuid:id>/memories/trash/', MemoryTrashView.as_view(), name='memories-trash-list'),
    path('<uuid:id>/memories/trash/<uuid:memory_id>/<str:action>/', MemoryTrashView.as_view(), name='memories-trash-action'),
    path('<uuid:id>/memories/moderation/', ModerationQueueView.as_view(), name='memories-moderation-list'),
    path('<uuid:id>/memories/moderation/<uuid:memory_id>/', ModerationQueueView.as_view(), name='memories-moderation-action'),
    path('<uuid:id>/memories/<uuid:memory_id>/', MemoryDetailView.as_view(), name='memories-detail'),
    path('<uuid:id>/albums/', AlbumListView.as_view(), name='albums-list'),
    path('<uuid:id>/albums/<str:album_id>/', AlbumDetailView.as_view(), name='albums-detail'),
    path('<uuid:id>/albums/<str:album_id>/add-memories/', AlbumAddMemoriesView.as_view(), name='albums-add-memories'),
]
