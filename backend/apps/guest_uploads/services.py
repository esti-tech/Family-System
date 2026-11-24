import secrets
import hashlib
from datetime import timedelta
from typing import Tuple, Dict, Optional
from django.utils import timezone
from apps.events.models import Event
from apps.guest_uploads.models import EventQRToken, GuestUploadSession


def hash_token(token: str) -> str:
    """Computes SHA-256 hex digest of a token."""
    return hashlib.sha256(token.encode('utf-8')).hexdigest()


def generate_event_qr_token(
    event: Event,
    label: str = "Table Tent QR",
    expires_in_days: int = 7,
    max_uploads: int = 150
) -> Tuple[EventQRToken, str]:
    """
    Generates a cryptographically random QR token for an event.
    Stores the SHA-256 hash in the database, never the raw token.
    """
    raw_token = f"kinkeep_qr_{secrets.token_urlsafe(32)}"
    token_h = hash_token(raw_token)
    expires_at = timezone.now() + timedelta(days=expires_in_days)

    token_obj = EventQRToken.objects.create(
        family=event.family,
        event=event,
        token_hash=token_h,
        label=label,
        expires_at=expires_at,
        max_uploads=max_uploads
    )

    return token_obj, raw_token


def inspect_event_qr_token(raw_token: str) -> Dict:
    """
    Inspects and validates an event QR token publicly.
    Returns event overview without exposing workspace internal data.
    """
    token_h = hash_token(raw_token)
    qr_token = EventQRToken.objects.filter(token_hash=token_h).select_related('event', 'family').first()

    if not qr_token or not qr_token.is_valid:
        raise ValueError("This QR code is invalid, expired, or has reached its upload limit.")

    return {
        "event_id": str(qr_token.event.id),
        "event_title": qr_token.event.title,
        "event_type": qr_token.event.event_type,
        "family_name": qr_token.family.name,
        "location": qr_token.event.location_name,
        "start_datetime": qr_token.event.start_datetime.isoformat(),
        "require_moderation": qr_token.event.require_guest_upload_moderation,
        "token_label": qr_token.label,
    }


def create_guest_upload_session(
    raw_token: str,
    guest_nickname: str = "Family Guest",
    ip_address: Optional[str] = None,
    user_agent: str = ""
) -> Tuple[GuestUploadSession, str]:
    """
    Initializes a temporary guest upload session for an attendee without requiring an account.
    """
    token_h = hash_token(raw_token)
    qr_token = EventQRToken.objects.filter(token_hash=token_h).first()

    if not qr_token or not qr_token.is_valid:
        raise ValueError("Cannot establish guest session: invalid or expired QR code.")

    raw_session_token = f"kinkeep_sess_{secrets.token_urlsafe(32)}"
    session_h = hash_token(raw_session_token)
    expires_at = timezone.now() + timedelta(hours=24)

    session = GuestUploadSession.objects.create(
        qr_token=qr_token,
        session_token_hash=session_h,
        guest_nickname=guest_nickname.strip() or "Family Guest",
        ip_address=ip_address,
        user_agent=user_agent[:300],
        expires_at=expires_at
    )

    return session, raw_session_token


def verify_guest_session(session_token: str) -> GuestUploadSession:
    """Verifies a guest upload session token."""
    session_h = hash_token(session_token)
    session = GuestUploadSession.objects.filter(
        session_token_hash=session_h
    ).select_related('qr_token__event', 'qr_token__family').first()

    if not session or not session.is_valid:
        raise ValueError("Guest upload session has expired or is invalid.")

    return session
