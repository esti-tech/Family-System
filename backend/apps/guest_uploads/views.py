from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.families.permissions import IsFamilyMember, IsFamilyAdmin
from apps.common.responses import success_response
from apps.events.models import Event
from apps.guest_uploads.models import EventQRToken
from apps.guest_uploads.serializers import (
    EventQRTokenSerializer, CreateQRTokenSerializer,
    GuestSessionInitSerializer, GuestMemoryUploadSerializer
)
from apps.guest_uploads.services import (
    generate_event_qr_token, inspect_event_qr_token,
    create_guest_upload_session, verify_guest_session
)
from apps.media_storage.services import create_media_upload_intent
from apps.memories.models import Memory


class EventQRTokenManageView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, event_id, id=None, slug=None):
        """Lists active QR upload tokens for an event."""
        family = request.family
        event = Event.objects.filter(id=event_id, family=family).first()
        if not event:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Event not found."}}, status=status.HTTP_404_NOT_FOUND)

        tokens = event.qr_tokens.all()
        return success_response(data=EventQRTokenSerializer(tokens, many=True).data)

    @extend_schema(request=CreateQRTokenSerializer)
    def post(self, request, event_id, id=None, slug=None):
        """Generates a new cryptographic QR code token for table tents / attendee posters."""
        family = request.family
        event = Event.objects.filter(id=event_id, family=family).first()
        if not event:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Event not found."}}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateQRTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token_obj, raw_token = generate_event_qr_token(
            event=event,
            label=serializer.validated_data.get('label', 'Table Tent QR'),
            expires_in_days=serializer.validated_data.get('expires_in_days', 7),
            max_uploads=serializer.validated_data.get('max_uploads', 150)
        )

        return success_response(
            data={
                "id": str(token_obj.id),
                "label": token_obj.label,
                "expires_at": token_obj.expires_at.isoformat(),
                "qr_token": raw_token, # Sent once to client to generate QR code graphic
                "upload_portal_url": f"http://localhost:3000/events/upload/{raw_token}",
            },
            message="QR token generated.",
            status_code=status.HTTP_201_CREATED
        )


class EventQRTokenRevokeView(APIView):
    permission_classes = [IsFamilyAdmin]

    def post(self, request, token_id, id=None, slug=None):
        """Revokes a QR token."""
        family = request.family
        token_obj = EventQRToken.objects.filter(id=token_id, family=family).first()
        if not token_obj:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Token not found."}}, status=status.HTTP_404_NOT_FOUND)

        token_obj.is_revoked = True
        token_obj.save(update_fields=['is_revoked'])
        return success_response(message="QR upload token revoked.")


class PublicQRInspectView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request, raw_token):
        """Publicly inspects an event QR code for guests without an account."""
        try:
            event_meta = inspect_event_qr_token(raw_token)
        except ValueError as e:
            return Response(
                {"success": False, "error": {"code": "INVALID_TOKEN", "message": str(e)}},
                status=status.HTTP_400_BAD_REQUEST
            )

        return success_response(data=event_meta)


class PublicGuestSessionStartView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=GuestSessionInitSerializer)
    def post(self, request):
        """Starts an ephemeral guest upload session."""
        serializer = GuestSessionInitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        raw_token = serializer.validated_data['qr_token']
        guest_nickname = serializer.validated_data.get('guest_nickname', 'Guest Attendee')

        ip = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')

        try:
            session, raw_session_token = create_guest_upload_session(
                raw_token=raw_token,
                guest_nickname=guest_nickname,
                ip_address=ip,
                user_agent=user_agent
            )
        except ValueError as e:
            return Response(
                {"success": False, "error": {"code": "INVALID_TOKEN", "message": str(e)}},
                status=status.HTTP_400_BAD_REQUEST
            )

        return success_response(
            data={
                "session_token": raw_session_token,
                "guest_nickname": session.guest_nickname,
                "event_title": session.qr_token.event.title,
                "expires_at": session.expires_at.isoformat(),
            },
            message=f"Welcome, {session.guest_nickname}!",
            status_code=status.HTTP_201_CREATED
        )


class PublicGuestUploadView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=GuestMemoryUploadSerializer)
    def post(self, request):
        """Processes an authenticated guest upload into the moderation quarantine queue."""
        auth_header = request.headers.get('Authorization', '')
        session_token = request.headers.get('X-Guest-Session') or (
            auth_header.split(' ')[1] if auth_header.startswith('Bearer ') else auth_header
        )
        if not session_token:
            return Response(
                {"success": False, "error": {"code": "UNAUTHORIZED", "message": "Guest session token required."}},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            session = verify_guest_session(session_token)
        except ValueError as e:
            return Response(
                {"success": False, "error": {"code": "INVALID_SESSION", "message": str(e)}},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = GuestMemoryUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        event = session.qr_token.event
        family = session.qr_token.family

        # Create media upload intent
        try:
            intent = create_media_upload_intent(
                family=family,
                file_name=serializer.validated_data['file_name'],
                mime_type=serializer.validated_data['mime_type'],
                file_size_bytes=serializer.validated_data['file_size_bytes'],
                is_quarantined=event.require_guest_upload_moderation
            )
        except ValueError as e:
            return Response(
                {"success": False, "error": {"code": "UPLOAD_REJECTED", "message": str(e)}},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create memory record in vault (either Published or Pending Review based on event policy)
        moderation_status = (
            Memory.ModerationStatus.PENDING if event.require_guest_upload_moderation
            else Memory.ModerationStatus.APPROVED
        )
        memory_status = (
            Memory.MemoryStatus.PENDING_REVIEW if event.require_guest_upload_moderation
            else Memory.MemoryStatus.PUBLISHED
        )

        caption = serializer.validated_data.get('caption') or f"Photo by {session.guest_nickname}"
        memory = Memory.objects.create(
            family=family,
            media_asset_id=intent['media_asset_id'],
            title=caption[:100],
            description=caption,
            media_type=intent['media_type'],
            media_url=intent['public_url'],
            thumbnail_url=intent['thumbnail_url'],
            event=event,
            status=memory_status,
            moderation_status=moderation_status,
            guest_session=session
        )

        session.qr_token.uploads_count += 1
        session.qr_token.save(update_fields=['uploads_count'])

        return success_response(
            data={
                "memory_id": str(memory.id),
                "upload_url": intent['upload_url'],
                "status": memory.status,
                "message": "Upload queued for moderation." if event.require_guest_upload_moderation else "Upload completed!"
            },
            message="Media uploaded successfully.",
            status_code=status.HTTP_201_CREATED
        )
