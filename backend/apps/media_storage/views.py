from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.families.permissions import IsFamilyMember
from apps.common.responses import success_response
from apps.media_storage.serializers import MediaUploadIntentSerializer
from apps.media_storage.services import create_media_upload_intent


class MediaUploadIntentView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(request=MediaUploadIntentSerializer)
    def post(self, request, id=None, slug=None):
        """Generates secure upload intent parameters, validates file specs, and checks storage quota."""
        family = request.family
        serializer = MediaUploadIntentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            intent_data = create_media_upload_intent(
                family=family,
                file_name=serializer.validated_data['file_name'],
                mime_type=serializer.validated_data['mime_type'],
                file_size_bytes=serializer.validated_data['file_size_bytes'],
                user=request.user
            )
        except ValueError as e:
            return Response(
                {"success": False, "error": {"code": "VALIDATION_ERROR", "message": str(e)}},
                status=status.HTTP_400_BAD_REQUEST
            )

        return success_response(
            data=intent_data,
            message="Media upload intent generated.",
            status_code=status.HTTP_201_CREATED
        )
