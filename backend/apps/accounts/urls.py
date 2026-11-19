from django.urls import path
from apps.accounts.views import (
    RegisterView, LoginView, RefreshTokenView, LogoutView,
    VerifyEmailView, PasswordResetRequestView, PasswordResetConfirmView,
    CurrentUserView
)

urlpatterns = [
    path('register', RegisterView.as_view(), name='auth-register'),
    path('login', LoginView.as_view(), name='auth-login'),
    path('refresh', RefreshTokenView.as_view(), name='auth-refresh'),
    path('logout', LogoutView.as_view(), name='auth-logout'),
    path('verify-email', VerifyEmailView.as_view(), name='auth-verify-email'),
    path('password-reset/request', PasswordResetRequestView.as_view(), name='auth-reset-request'),
    path('password-reset/confirm', PasswordResetConfirmView.as_view(), name='auth-reset-confirm'),
    path('me', CurrentUserView.as_view(), name='auth-me'),
]
