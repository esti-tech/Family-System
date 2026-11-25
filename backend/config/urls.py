from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # OpenAPI 3 Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API v1 Versioned Endpoints
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/families/', include('apps.families.urls')),
    path('api/v1/families/', include('apps.genealogy.urls')),
    path('api/v1/families/', include('apps.heritage.urls')),
    path('api/v1/families/', include('apps.media_storage.urls')),
    path('api/v1/families/', include('apps.events.urls')),
    path('api/v1/families/', include('apps.memories.urls')),
    path('api/v1/families/', include('apps.guest_uploads.urls')),
    path('api/v1/guest-uploads/', include('apps.guest_uploads.urls')),
    path('api/v1/subscriptions/', include('apps.subscriptions.urls')),
    path('api/v1/families/', include('apps.subscriptions.urls')),
    path('api/v1/payments/', include('apps.payments.urls')),
    path('api/v1/families/', include('apps.payments.urls')),
    path('api/v1/platform-admin/', include('apps.platform_admin.urls')),
    path('api/v1/invitations/', include('apps.families.urls')),

]
