from django.utils import timezone
from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.families.permissions import IsFamilyMember, IsFamilyAdmin
from apps.families.models import FamilyRole
from apps.common.responses import success_response
from apps.heritage.models import Story, TimelineMilestone
from apps.heritage.serializers import (
    StorySerializer, CreateStorySerializer, TimelineMilestoneSerializer
)


class StoryListView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(responses={200: StorySerializer(many=True)})
    def get(self, request, id=None, slug=None):
        """Lists family stories with search, era, category, and status filtering."""
        family = request.family
        user_role = request.family_membership.role.code

        queryset = Story.objects.filter(family=family)

        # Non-admins only see published stories plus their own drafts
        if user_role not in [FamilyRole.SystemRole.OWNER, FamilyRole.SystemRole.ADMIN]:
            queryset = queryset.filter(
                Q(status=Story.StoryStatus.PUBLISHED) |
                Q(author=request.user)
            )

        status_param = request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param.upper())

        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category.upper())

        era = request.query_params.get('era')
        if era:
            queryset = queryset.filter(era__icontains=era)

        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(title_amharic__icontains=search) |
                Q(content__icontains=search) |
                Q(narrator_name__icontains=search) |
                Q(location_name__icontains=search)
            )

        serializer = StorySerializer(queryset, many=True)
        return success_response(data=serializer.data)

    @extend_schema(request=CreateStorySerializer, responses={201: StorySerializer})
    def post(self, request, id=None, slug=None):
        """Creates a new story (draft or published)."""
        family = request.family
        serializer = CreateStorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        story_status = serializer.validated_data.get('status', Story.StoryStatus.DRAFT)
        published_at = timezone.now() if story_status == Story.StoryStatus.PUBLISHED else None

        story = serializer.save(
            family=family,
            author=request.user,
            published_at=published_at
        )

        return success_response(
            data=StorySerializer(story).data,
            message=f"Story '{story.title}' created.",
            status_code=status.HTTP_201_CREATED
        )


class StoryDetailView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, story_id, id=None, slug=None):
        """Retrieves story details and increments view count."""
        family = request.family
        story = Story.objects.filter(
            Q(id=story_id) | Q(slug=story_id), family=family
        ).first()

        if not story:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Story not found in this family."}},
                status=status.HTTP_404_NOT_FOUND
            )

        story.view_count += 1
        story.save(update_fields=['view_count'])

        return success_response(data=StorySerializer(story).data)

    def patch(self, request, story_id, id=None, slug=None):
        """Updates a story. Allowed for Author, Admin, or Owner."""
        family = request.family
        story = Story.objects.filter(
            Q(id=story_id) | Q(slug=story_id), family=family
        ).first()

        if not story:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Story not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        is_author = story.author == request.user
        is_admin = request.family_membership.role.code in [FamilyRole.SystemRole.OWNER, FamilyRole.SystemRole.ADMIN]

        if not (is_author or is_admin):
            return Response(
                {"success": False, "error": {"code": "FORBIDDEN", "message": "Only the author or family admin can edit this story."}},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = CreateStorySerializer(story, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        if serializer.validated_data.get('status') == Story.StoryStatus.PUBLISHED and not story.published_at:
            story.published_at = timezone.now()

        updated_story = serializer.save()
        return success_response(data=StorySerializer(updated_story).data, message="Story updated.")

    def delete(self, request, story_id, id=None, slug=None):
        """Deletes a story."""
        family = request.family
        story = Story.objects.filter(
            Q(id=story_id) | Q(slug=story_id), family=family
        ).first()

        if not story:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Story not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        is_author = story.author == request.user
        is_admin = request.family_membership.role.code in [FamilyRole.SystemRole.OWNER, FamilyRole.SystemRole.ADMIN]

        if not (is_author or is_admin):
            return Response(
                {"success": False, "error": {"code": "FORBIDDEN", "message": "Only the author or family admin can delete this story."}},
                status=status.HTTP_403_FORBIDDEN
            )

        story.delete()
        return success_response(message="Story deleted.")


class StoryPublishView(APIView):
    permission_classes = [IsFamilyMember]

    def post(self, request, story_id, id=None, slug=None):
        """Publishes a draft story."""
        family = request.family
        story = Story.objects.filter(
            Q(id=story_id) | Q(slug=story_id), family=family
        ).first()

        if not story:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Story not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        story.status = Story.StoryStatus.PUBLISHED
        story.published_at = timezone.now()
        story.save(update_fields=['status', 'published_at'])

        return success_response(data=StorySerializer(story).data, message="Story published to family archive.")


class TimelineMilestoneListView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(responses={200: TimelineMilestoneSerializer(many=True)})
    def get(self, request, id=None, slug=None):
        """Returns historical milestones chronologically."""
        family = request.family
        queryset = TimelineMilestone.objects.filter(family=family).order_by('year', 'date')

        era = request.query_params.get('era')
        if era:
            queryset = queryset.filter(era__icontains=era)

        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category.upper())

        serializer = TimelineMilestoneSerializer(queryset, many=True)
        return success_response(data=serializer.data)

    @extend_schema(request=TimelineMilestoneSerializer, responses={201: TimelineMilestoneSerializer})
    def post(self, request, id=None, slug=None):
        """Creates a timeline milestone."""
        family = request.family
        serializer = TimelineMilestoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        milestone = serializer.save(family=family, created_by=request.user)
        return success_response(
            data=TimelineMilestoneSerializer(milestone).data,
            message=f"Milestone '{milestone.title}' added to timeline.",
            status_code=status.HTTP_201_CREATED
        )


class HeritageOverviewView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, id=None, slug=None):
        """Aggregates oral audio memoirs, featured stories, and historical milestones for the Heritage Showcase."""
        family = request.family

        featured_stories = Story.objects.filter(
            family=family, status=Story.StoryStatus.PUBLISHED
        ).order_by('-view_count')[:4]

        audio_memoirs = Story.objects.filter(
            family=family, status=Story.StoryStatus.PUBLISHED
        ).exclude(audio_url='').order_by('-created_at')[:4]

        milestones = TimelineMilestone.objects.filter(
            family=family
        ).order_by('year')[:6]

        return success_response(data={
            "featured_stories": StorySerializer(featured_stories, many=True).data,
            "audio_memoirs": StorySerializer(audio_memoirs, many=True).data,
            "milestones": TimelineMilestoneSerializer(milestones, many=True).data,
            "total_stories": Story.objects.filter(family=family, status=Story.StoryStatus.PUBLISHED).count(),
            "total_audio_recordings": Story.objects.filter(family=family).exclude(audio_url='').count(),
            "total_milestones": TimelineMilestone.objects.filter(family=family).count(),
        })
