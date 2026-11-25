from django.urls import path
from apps.payments.views import (
    CheckoutInitiateView, PaymentTransactionListView,
    PaymentWebhookView, VerifyPaymentStatusView
)

urlpatterns = [
    # Gateway callbacks & webhooks (Public unauthenticated)
    path('webhooks/<str:provider>/', PaymentWebhookView.as_view(), name='payment-webhook'),

    # Slug-based routes
    path('by-slug/<str:slug>/payments/checkout/', CheckoutInitiateView.as_view(), name='slug-payments-checkout'),
    path('by-slug/<str:slug>/payments/transactions/', PaymentTransactionListView.as_view(), name='slug-payments-transactions'),
    path('by-slug/<str:slug>/payments/verify/', VerifyPaymentStatusView.as_view(), name='slug-payments-verify'),

    # UUID-based routes
    path('<uuid:id>/payments/checkout/', CheckoutInitiateView.as_view(), name='payments-checkout'),
    path('<uuid:id>/payments/transactions/', PaymentTransactionListView.as_view(), name='payments-transactions'),
    path('<uuid:id>/payments/verify/', VerifyPaymentStatusView.as_view(), name='payments-verify'),
]
