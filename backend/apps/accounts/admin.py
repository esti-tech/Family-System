from django.contrib import admin
from apps.accounts.models import User, EmailVerificationToken, PasswordResetToken

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'status', 'is_staff', 'is_superuser', 'created_at')
    search_fields = ('email', 'full_name')
    list_filter = ('status', 'is_staff', 'is_superuser')

@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token_hash', 'expires_at', 'used_at', 'created_at')
    search_fields = ('user__email',)

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token_hash', 'expires_at', 'used_at', 'created_at')
    search_fields = ('user__email',)
