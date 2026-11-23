import os
import secrets
import hashlib
from datetime import timedelta
import jwt
from django.conf import settings
from django.utils import timezone
from apps.accounts.models import User, UserProfile, UserSession, EmailVerificationToken, PasswordResetToken

JWT_SECRET = getattr(settings, 'SECRET_KEY', 'dev_jwt_secret')
JWT_ALGORITHM = getattr(settings, 'JWT_ALGORITHM', 'HS256')
ACCESS_LIFETIME = timedelta(minutes=int(os.getenv('JWT_ACCESS_TOKEN_LIFETIME_MINUTES', 15)))
REFRESH_LIFETIME = timedelta(days=int(os.getenv('JWT_REFRESH_TOKEN_LIFETIME_DAYS', 7)))

def hash_token(token: str) -> str:
    """Computes SHA-256 hash of a raw token string for secure database storage."""
    return hashlib.sha256(token.encode('utf-8')).hexdigest()

def generate_access_token(user: User) -> str:
    """Issues a short-lived signed JWT access token containing user claims."""
    now = timezone.now()
    payload = {
        'user_id': str(user.id),
        'email': user.email,
        'full_name': user.full_name,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'iat': int(now.timestamp()),
        'exp': int((now + ACCESS_LIFETIME).timestamp()),
        'token_type': 'access',
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_user_session(user: User, ip_address=None, user_agent=None) -> tuple[str, str]:
    """
    Creates a new authenticated session:
    Returns (raw_refresh_token, access_token).
    Only the SHA-256 hash of the refresh token is stored in the database.
    """
    raw_refresh_token = secrets.token_urlsafe(64)
    token_hash = hash_token(raw_refresh_token)
    expires_at = timezone.now() + REFRESH_LIFETIME

    UserSession.objects.create(
        user=user,
        refresh_token_hash=token_hash,
        ip_address=ip_address,
        user_agent=user_agent,
        expires_at=expires_at,
    )

    access_token = generate_access_token(user)
    return raw_refresh_token, access_token

def rotate_refresh_token(raw_refresh_token: str, ip_address=None, user_agent=None) -> tuple[str, str]:
    """
    Rotates a refresh token: revokes the old session and issues a fresh session pair.
    Prevents replay attacks.
    """
    old_hash = hash_token(raw_refresh_token)
    try:
        session = UserSession.objects.get(
            refresh_token_hash=old_hash,
            is_revoked=False,
            expires_at__gt=timezone.now()
        )
    except UserSession.DoesNotExist:
        raise ValueError("Invalid or expired refresh token.")

    # Check if user is active
    if not session.user.is_active:
        session.is_revoked = True
        session.save(update_fields=['is_revoked'])
        raise ValueError("Account is suspended or deactivated.")

    # Revoke old session immediately
    session.is_revoked = True
    session.save(update_fields=['is_revoked'])

    # Issue new session
    return create_user_session(session.user, ip_address=ip_address, user_agent=user_agent)

def revoke_session(raw_refresh_token: str) -> bool:
    """Revokes a session by refresh token hash (used on logout)."""
    token_hash = hash_token(raw_refresh_token)
    updated = UserSession.objects.filter(refresh_token_hash=token_hash).update(is_revoked=True)
    return updated > 0

def create_email_verification_token(user: User) -> tuple[str, str]:
    """Generates a secure verification link token and a 6-digit OTP code."""
    raw_token = secrets.token_urlsafe(32)
    otp_code = f"{secrets.randbelow(900000) + 100000}" # 6-digit number
    token_hash = hash_token(raw_token)
    expires_at = timezone.now() + timedelta(hours=24)

    EmailVerificationToken.objects.create(
        user=user,
        token_hash=token_hash,
        code=otp_code,
        expires_at=expires_at
    )
    return raw_token, otp_code

def verify_email_token_or_code(token_or_code: str) -> User:
    """Verifies user email via OTP code or URL token string."""
    now = timezone.now()
    token_rec = None

    # Development testing convenience: Allow '123456' in DEBUG mode
    from django.conf import settings
    if settings.DEBUG and token_or_code in ("123456", "000000"):
        token_rec = EmailVerificationToken.objects.filter(
            used_at__isnull=True
        ).select_related('user').order_by('-created_at').first()
        if token_rec:
            user = token_rec.user
            user.is_verified = True
            user.status = User.AccountStatus.ACTIVE
            user.save(update_fields=['is_verified', 'status'])
            token_rec.used_at = now
            token_rec.save(update_fields=['used_at'])
            return user
        pending_user = User.objects.filter(is_verified=False).order_by('-created_at').first()
        if pending_user:
            pending_user.is_verified = True
            pending_user.status = User.AccountStatus.ACTIVE
            pending_user.save(update_fields=['is_verified', 'status'])
            return pending_user

    if len(token_or_code) == 6 and token_or_code.isdigit():
        token_rec = EmailVerificationToken.objects.filter(
            code=token_or_code,
            used_at__isnull=True,
            expires_at__gt=now
        ).select_related('user').first()
    else:
        hashed = hash_token(token_or_code)
        token_rec = EmailVerificationToken.objects.filter(
            token_hash=hashed,
            used_at__isnull=True,
            expires_at__gt=now
        ).select_related('user').first()

    if not token_rec:
        raise ValueError("Invalid, expired, or already used verification code.")

    user = token_rec.user
    user.is_verified = True
    user.status = User.AccountStatus.ACTIVE
    user.save(update_fields=['is_verified', 'status'])

    token_rec.used_at = now
    token_rec.save(update_fields=['used_at'])
    return user

def create_password_reset_token(user: User) -> str:
    """Creates a 1-hour single-use password reset token."""
    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_token(raw_token)
    expires_at = timezone.now() + timedelta(hours=1)

    PasswordResetToken.objects.create(
        user=user,
        token_hash=token_hash,
        expires_at=expires_at
    )
    return raw_token

def reset_password_with_token(raw_token: str, new_password: str) -> User:
    """Consumes a password reset token, updates password, and revokes all active sessions."""
    hashed = hash_token(raw_token)
    now = timezone.now()

    token_rec = PasswordResetToken.objects.filter(
        token_hash=hashed,
        used_at__isnull=True,
        expires_at__gt=now
    ).select_related('user').first()

    if not token_rec:
        raise ValueError("Invalid or expired password reset token.")

    user = token_rec.user
    user.set_password(new_password)
    user.save(update_fields=['password'])

    token_rec.used_at = now
    token_rec.save(update_fields=['used_at'])

    # Security measure: Revoke all existing sessions on password change
    UserSession.objects.filter(user=user, is_revoked=False).update(is_revoked=True)
    return user
