import uuid
import hashlib
from typing import Dict, Tuple
from django.conf import settings
from apps.families.models import Family
from apps.media_storage.models import MediaAsset

# Allowed MIME types
ALLOWED_MIME_TYPES = {
    # Images
    'image/jpeg': MediaAsset.MediaType.IMAGE,
    'image/png': MediaAsset.MediaType.IMAGE,
    'image/webp': MediaAsset.MediaType.IMAGE,
    'image/heic': MediaAsset.MediaType.IMAGE,
    # Videos
    'video/mp4': MediaAsset.MediaType.VIDEO,
    'video/quicktime': MediaAsset.MediaType.VIDEO,
    'video/webm': MediaAsset.MediaType.VIDEO,
    # Audios
    'audio/mpeg': MediaAsset.MediaType.AUDIO,
    'audio/mp3': MediaAsset.MediaType.AUDIO,
    'audio/wav': MediaAsset.MediaType.AUDIO,
    'audio/aac': MediaAsset.MediaType.AUDIO,
    'audio/x-m4a': MediaAsset.MediaType.AUDIO,
    # Documents
    'application/pdf': MediaAsset.MediaType.DOCUMENT,
}

MAX_FILE_SIZES = {
    MediaAsset.MediaType.IMAGE: 50 * 1024 * 1024,      # 50 MB
    MediaAsset.MediaType.VIDEO: 500 * 1024 * 1024,    # 500 MB
    MediaAsset.MediaType.AUDIO: 100 * 1024 * 1024,    # 100 MB
    MediaAsset.MediaType.DOCUMENT: 25 * 1024 * 1024,  # 25 MB
}

DEFAULT_FAMILY_STORAGE_LIMIT_BYTES = 5 * 1024 * 1024 * 1024 # 5 GB tier


def validate_file_specs(mime_type: str, file_size_bytes: int) -> Tuple[bool, str, str]:
    """Validates MIME type and file size limits."""
    media_type = ALLOWED_MIME_TYPES.get(mime_type.lower())
    if not media_type:
        return False, f"Unsupported file type '{mime_type}'. Supported: JPEG, PNG, WEBP, MP4, MOV, MP3, WAV, PDF.", ""

    max_size = MAX_FILE_SIZES.get(media_type, 25 * 1024 * 1024)
    if file_size_bytes > max_size:
        max_mb = max_size // (1024 * 1024)
        return False, f"File size exceeds maximum allowed of {max_mb}MB for {media_type}.", ""

    return True, "", media_type


def check_family_storage_quota(family: Family, incoming_bytes: int) -> Tuple[bool, str]:
    """Checks whether the workspace has enough available storage quota."""
    # Sum file sizes of active media assets in family
    total_used = MediaAsset.objects.filter(
        family=family, processing_status=MediaAsset.ProcessingStatus.READY
    ).aggregate(total=models.Sum('file_size_bytes'))['total'] or 0

    storage_limit = family.settings.get('storage_limit_bytes', DEFAULT_FAMILY_STORAGE_LIMIT_BYTES)

    if (total_used + incoming_bytes) > storage_limit:
        return False, "Family workspace storage quota exceeded. Upgrade plan to expand storage capacity."

    return True, ""


from django.db import models


def create_media_upload_intent(
    family: Family,
    file_name: str,
    mime_type: str,
    file_size_bytes: int,
    user=None,
    is_quarantined: bool = False
) -> Dict:
    """
    Validates file specs, checks storage quota, generates private S3/MinIO key,
    and returns upload parameters with media record.
    """
    valid, err, media_type = validate_file_specs(mime_type, file_size_bytes)
    if not valid:
        raise ValueError(err)

    quota_ok, quota_err = check_family_storage_quota(family, file_size_bytes)
    if not quota_ok:
        raise ValueError(quota_err)

    ext = file_name.split('.')[-1].lower() if '.' in file_name else 'bin'
    file_uuid = uuid.uuid4().hex
    storage_key = f"families/{family.id}/media/{file_uuid}.{ext}"

    # MinIO / S3 mock upload endpoint or direct upload path
    upload_url = f"https://storage.kinkeep.com/upload/{storage_key}"
    public_url = f"https://storage.kinkeep.com/{storage_key}"
    thumbnail_url = f"https://storage.kinkeep.com/thumbnails/{file_uuid}.webp" if media_type == MediaAsset.MediaType.IMAGE else ""

    media_asset = MediaAsset.objects.create(
        family=family,
        uploaded_by=user,
        media_type=media_type,
        file_name=file_name,
        mime_type=mime_type,
        file_size_bytes=file_size_bytes,
        storage_key=storage_key,
        public_url=public_url,
        thumbnail_url=thumbnail_url,
        processing_status=MediaAsset.ProcessingStatus.READY,
        is_quarantined=is_quarantined
    )

    return {
        "media_asset_id": str(media_asset.id),
        "upload_url": upload_url,
        "storage_key": storage_key,
        "public_url": public_url,
        "thumbnail_url": thumbnail_url,
        "media_type": media_type,
    }
