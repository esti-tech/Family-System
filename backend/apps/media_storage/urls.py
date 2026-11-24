from django.urls import path
from apps.media_storage.views import MediaUploadIntentView

urlpatterns = [
    path('by-slug/<str:slug>/media/upload-intent/', MediaUploadIntentView.as_view(), name='slug-media-upload-intent'),
    path('<uuid:id>/media/upload-intent/', MediaUploadIntentView.as_view(), name='media-upload-intent'),
]
