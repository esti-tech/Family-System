import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from apps.common.models import UUIDModel, TimestampedModel

class CustomUserManager(BaseUserManager):
    """Custom manager for KinKeep users where email is the unique identifier for auth."""
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('status', User.AccountStatus.ACTIVE)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin, UUIDModel, TimestampedModel):
    """
    Platform-wide User Identity.
    Decoupled from lineage tree persons (many persons in a tree will never have a User account).
    """
    class AccountStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Verification'
        ACTIVE = 'ACTIVE', 'Active'
        SUSPENDED = 'SUSPENDED', 'Suspended'
        DEACTIVATED = 'DEACTIVATED', 'Deactivated'

    class Language(models.TextChoices):
        EN = 'en', 'English'
        AM = 'am', 'Amharic'
        OM = 'om', 'Oromo'
        TI = 'ti', 'Tigrinya'

    email = models.EmailField(max_length=320, unique=True, db_index=True)
    phone_number = models.CharField(max_length=32, blank=True, null=True, unique=True)
    full_name = models.CharField(max_length=200)
    status = models.CharField(
        max_length=20,
        choices=AccountStatus.choices,
        default=AccountStatus.PENDING,
        db_index=True
    )
    is_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    preferred_language = models.CharField(
        max_length=10,
        choices=Language.choices,
        default=Language.EN
    )
    last_login_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.full_name} ({self.email})"

    @property
    def is_active(self):
        return self.status == self.AccountStatus.ACTIVE and self.deleted_at is None

class UserProfile(UUIDModel, TimestampedModel):
    """Extended user metadata, bio, location and timezone."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar_media_id = models.UUIDField(null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    location_country = models.CharField(max_length=100, blank=True, null=True)
    location_city = models.CharField(max_length=100, blank=True, null=True)
    timezone = models.CharField(max_length=50, default='UTC')

    class Meta:
        db_table = 'user_profiles'

    def __str__(self):
        return f"Profile of {self.user.email}"

class UserSession(UUIDModel, TimestampedModel):
    """
    Revocable refresh token session tracking with security fingerprint.
    Stores only the SHA-256 hash of the issued refresh token.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    refresh_token_hash = models.CharField(max_length=255, unique=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    is_revoked = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    last_active_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'user_sessions'
        indexes = [
            models.Index(fields=['user', 'expires_at'], name='idx_sessions_user_active', condition=models.Q(is_revoked=False)),
        ]

    def __str__(self):
        return f"Session {self.id} for {self.user.email} (Revoked: {self.is_revoked})"

class EmailVerificationToken(UUIDModel):
    """Single-use token or OTP for verifying newly registered user accounts."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_tokens')
    token_hash = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=6, blank=True, null=True) # 6-digit OTP option
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'email_verification_tokens'

    @property
    def is_valid(self):
        return self.used_at is None and self.expires_at > timezone.now()

class PasswordResetToken(UUIDModel):
    """Single-use token for secure password recovery."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token_hash = models.CharField(max_length=255, unique=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'password_reset_tokens'

    @property
    def is_valid(self):
        return self.used_at is None and self.expires_at > timezone.now()
