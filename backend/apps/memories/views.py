from django.utils import timezone
from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.families.permissions import IsFamilyMember, IsFamilyAdmin
from apps.families.models import FamilyRole
from apps.common.responses import success_response
from apps.memories.models import Memory, Album, AlbumMemoryLink
from apps.memories.serializers import (
    MemorySerializer, CreateMemorySerializer,
    AlbumSerializer, CreateAlbumSerializer,
    AddMemoryToAlbumSerializer, ModerationActionSerializer
)


class MemoryListView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(responses={200: MemorySerializer(many=True)})
    def get(self, request, id=None, slug=None):
        """Lists active published memories in the family vault."""
        family = request.family
        queryset = Memory.objects.filter(
            family=family, status=Memory.MemoryStatus.PUBLISHED
        )

        media_type = request.query_params.get('type')
        if media_type:
            queryset = queryset.filter(media_type=media_type.upper())

        event_id = request.query_params.get('event_id')
        if event_id:
            queryset = queryset.filter(event_id=event_id)

        person_id = request.query_params.get('person_id')
        if person_id:
            queryset = queryset.filter(linked_persons__id=person_id)

        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(location_name__icontains=search)
            )

        serializer = MemorySerializer(queryset.distinct(), many=True)
        return success_response(data=serializer.data)

    @extend_schema(request=CreateMemorySerializer, responses={201: MemorySerializer})
    def post(self, request, id=None, slug=None):
        """Creates a memory item in the family vault."""
        family = request.family
        serializer = CreateMemorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        memory = serializer.save(
            family=family,
            created_by=request.user,
            status=Memory.MemoryStatus.PUBLISHED,
            moderation_status=Memory.ModerationStatus.APPROVED
        )

        return success_response(
            data=MemorySerializer(memory).data,
            message=f"Memory '{memory.title}' added to vault.",
            status_code=status.HTTP_201_CREATED
        )


class MemoryDetailView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, memory_id, id=None, slug=None):
        """Retrieves single memory details."""
        family = request.family
        memory = Memory.objects.filter(id=memory_id, family=family).first()
        if not memory:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Memory not found."}}, status=status.HTTP_404_NOT_FOUND)

        return success_response(data=MemorySerializer(memory).data)

    def patch(self, request, memory_id, id=None, slug=None):
        """Updates memory metadata (title, description, tags, approximate date)."""
        family = request.family
        memory = Memory.objects.filter(id=memory_id, family=family).first()
        if not memory:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Memory not found."}}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateMemorySerializer(memory, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()

        return success_response(data=MemorySerializer(updated).data, message="Memory updated.")

    def delete(self, request, memory_id, id=None, slug=None):
        """Moves a memory to trash."""
        family = request.family
        memory = Memory.objects.filter(id=memory_id, family=family).first()
        if not memory:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Memory not found."}}, status=status.HTTP_404_NOT_FOUND)

        memory.status = Memory.MemoryStatus.TRASHED
        memory.trashed_at = timezone.now()
        memory.save(update_fields=['status', 'trashed_at'])

        return success_response(message="Memory moved to trash.")


class MemoryTrashView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, id=None, slug=None):
        """Lists memories currently in the trash."""
        family = request.family
        trashed = Memory.objects.filter(family=family, status=Memory.MemoryStatus.TRASHED)
        return success_response(data=MemorySerializer(trashed, many=True).data)

    def post(self, request, memory_id, action, id=None, slug=None):
        """Restores or permanently deletes a trashed memory."""
        family = request.family
        memory = Memory.objects.filter(id=memory_id, family=family, status=Memory.MemoryStatus.TRASHED).first()
        if not memory:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Item not in trash."}}, status=status.HTTP_404_NOT_FOUND)

        if action.lower() == 'restore':
            memory.status = Memory.MemoryStatus.PUBLISHED
            memory.trashed_at = None
            memory.save(update_fields=['status', 'trashed_at'])
            return success_response(message="Memory restored to vault.")

        elif action.lower() == 'purge':
            is_admin = request.family_membership.role.code in [FamilyRole.SystemRole.OWNER, FamilyRole.SystemRole.ADMIN]
            if not is_admin:
                return Response({"success": False, "error": {"code": "FORBIDDEN", "message": "Admin authorization required to permanently purge."}}, status=status.HTTP_403_FORBIDDEN)

            memory.delete()
            return success_response(message="Memory permanently deleted.")

        return Response({"success": False, "error": {"code": "BAD_REQUEST", "message": "Use 'restore' or 'purge'."}}, status=status.HTTP_400_BAD_REQUEST)


class ModerationQueueView(APIView):
    permission_classes = [IsFamilyAdmin]

    def get(self, request, id=None, slug=None):
        """Lists unapproved guest uploads waiting for family review."""
        family = request.family
        pending_memories = Memory.objects.filter(
            family=family, moderation_status=Memory.ModerationStatus.PENDING
        )
        return success_response(data=MemorySerializer(pending_memories, many=True).data)

    @extend_schema(request=ModerationActionSerializer)
    def post(self, request, memory_id, id=None, slug=None):
        """Approves, flags, or rejects a pending guest upload."""
        family = request.family
        memory = Memory.objects.filter(id=memory_id, family=family).first()
        if not memory:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Memory not found."}}, status=status.HTTP_404_NOT_FOUND)

        serializer = ModerationActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        action = serializer.validated_data['action']
        notes = serializer.validated_data.get('notes', '')

        if action == 'APPROVE':
            memory.moderation_status = Memory.ModerationStatus.APPROVED
            memory.status = Memory.MemoryStatus.PUBLISHED
            if memory.media_asset:
                memory.media_asset.is_quarantined = False
                memory.media_asset.save(update_fields=['is_quarantined'])
            msg = "Memory approved and published to family vault."
        elif action == 'REJECT':
            memory.moderation_status = Memory.ModerationStatus.REJECTED
            memory.status = Memory.MemoryStatus.TRASHED
            msg = "Memory rejected."
        else:
            memory.moderation_status = Memory.ModerationStatus.FLAGGED
            msg = "Memory flagged for discussion."

        memory.moderation_notes = notes
        memory.save(update_fields=['moderation_status', 'status', 'moderation_notes'])

        return success_response(data=MemorySerializer(memory).data, message=msg)


class AlbumListView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(responses={200: AlbumSerializer(many=True)})
    def get(self, request, id=None, slug=None):
        """Lists family albums."""
        family = request.family
        albums = Album.objects.filter(family=family)
        return success_response(data=AlbumSerializer(albums, many=True).data)

    @extend_schema(request=CreateAlbumSerializer, responses={201: AlbumSerializer})
    def post(self, request, id=None, slug=None):
        """Creates a new album without duplicating memory files."""
        family = request.family
        serializer = CreateAlbumSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        album = serializer.save(family=family, created_by=request.user)
        return success_response(
            data=AlbumSerializer(album).data,
            message=f"Album '{album.title}' created.",
            status_code=status.HTTP_201_CREATED
        )


class AlbumDetailView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, album_id, id=None, slug=None):
        """Retrieves album and all associated memories in order."""
        family = request.family
        album = Album.objects.filter(
            Q(id=album_id) | Q(slug=album_id), family=family
        ).first()
        if not album:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Album not found."}}, status=status.HTTP_404_NOT_FOUND)

        links = AlbumMemoryLink.objects.filter(
            album=album, memory__status=Memory.MemoryStatus.PUBLISHED
        ).select_related('memory').order_by('order')

        memories = [link.memory for link in links]
        data = AlbumSerializer(album).data
        data['memories'] = MemorySerializer(memories, many=True).data

        return success_response(data=data)

    def patch(self, request, album_id, id=None, slug=None):
        """Updates album title or description."""
        family = request.family
        album = Album.objects.filter(
            Q(id=album_id) | Q(slug=album_id), family=family
        ).first()
        if not album:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Album not found."}}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateAlbumSerializer(album, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()

        return success_response(data=AlbumSerializer(updated).data, message="Album updated.")

    def delete(self, request, album_id, id=None, slug=None):
        """Deletes album without deleting underlying memories."""
        family = request.family
        album = Album.objects.filter(
            Q(id=album_id) | Q(slug=album_id), family=family
        ).first()
        if not album:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Album not found."}}, status=status.HTTP_404_NOT_FOUND)

        album.delete()
        return success_response(message="Album deleted (memories preserved in vault).")


class AlbumAddMemoriesView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(request=AddMemoryToAlbumSerializer)
    def post(self, request, album_id, id=None, slug=None):
        """Adds existing memories to an album without duplicating media files."""
        family = request.family
        album = Album.objects.filter(
            Q(id=album_id) | Q(slug=album_id), family=family
        ).first()
        if not album:
            return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Album not found."}}, status=status.HTTP_404_NOT_FOUND)

        serializer = AddMemoryToAlbumSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        memory_ids = serializer.validated_data['memory_ids']
        valid_mems = Memory.objects.filter(id__in=memory_ids, family=family)

        current_max = AlbumMemoryLink.objects.filter(album=album).count()
        added_count = 0

        for idx, m in enumerate(valid_mems):
            _, created = AlbumMemoryLink.objects.get_or_create(
                album=album, memory=m, defaults={'order': current_max + idx}
            )
            if created:
                added_count += 1

        return success_response(
            message=f"{added_count} memories added to album '{album.title}'."
        )
