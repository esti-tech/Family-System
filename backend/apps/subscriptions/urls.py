from django.urls import path
from apps.subscriptions.views import (
    PlanListView, FamilySubscriptionDetailView,
    FamilyStorageUsageView, FamilyInvoiceListView,
    FamilyCancelSubscriptionView
)

urlpatterns = [
    # Global plans
    path('plans/', PlanListView.as_view(), name='plans-list'),

    # Slug-based family workspace routes
    path('by-slug/<str:slug>/subscription/', FamilySubscriptionDetailView.as_view(), name='slug-family-subscription'),
    path('by-slug/<str:slug>/subscription/cancel/', FamilyCancelSubscriptionView.as_view(), name='slug-family-subscription-cancel'),
    path('by-slug/<str:slug>/storage/', FamilyStorageUsageView.as_view(), name='slug-family-storage'),
    path('by-slug/<str:slug>/invoices/', FamilyInvoiceListView.as_view(), name='slug-family-invoices'),

    # UUID-based family workspace routes
    path('<uuid:id>/subscription/', FamilySubscriptionDetailView.as_view(), name='family-subscription'),
    path('<uuid:id>/subscription/cancel/', FamilyCancelSubscriptionView.as_view(), name='family-subscription-cancel'),
    path('<uuid:id>/storage/', FamilyStorageUsageView.as_view(), name='family-storage'),
    path('<uuid:id>/invoices/', FamilyInvoiceListView.as_view(), name='family-invoices'),
]
