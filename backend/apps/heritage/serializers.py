from rest_framework import serializers
from apps.heritage.models import Story, StoryPersonLink, TimelineMilestone
from apps.genealogy.serializers import PersonSerializer
from apps.genealogy.models import Person


class StoryPersonLinkSerializer(serializers.ModelSerializer):
    person = PersonSerializer(read_only=True)

    class Meta:
        model = StoryPersonLink
        fields = ['id', 'person', 'role_in_story']


class StorySerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    linked_persons = PersonSerializer(many=True, read_only=True)

    class Meta:
        model = Story
        fields = [
            'id', 'family_id', 'title', 'title_amharic', 'slug', 'author_name',
            'narrator_name', 'summary', 'content', 'content_amharic', 'status',
            'category', 'era', 'event_year', 'event_date_is_approximate',
            'location_name', 'audio_url', 'audio_duration_seconds', 'cover_image_url',
            'linked_persons', 'tags', 'view_count', 'created_at', 'updated_at',
            'published_at'
        ]
        read_only_fields = ['id', 'family_id', 'slug', 'view_count', 'created_at', 'updated_at']


class CreateStorySerializer(serializers.ModelSerializer):
    linked_person_ids = serializers.ListField(
        child=serializers.UUIDField(), required=False, write_only=True
    )

    class Meta:
        model = Story
        fields = [
            'title', 'title_amharic', 'narrator_name', 'summary', 'content',
            'content_amharic', 'status', 'category', 'era', 'event_year',
            'event_date_is_approximate', 'location_name', 'audio_url',
            'audio_duration_seconds', 'cover_image_url', 'tags', 'linked_person_ids'
        ]

    def create(self, validated_data):
        linked_person_ids = validated_data.pop('linked_person_ids', [])
        story = super().create(validated_data)

        if linked_person_ids:
            family = story.family
            valid_persons = Person.objects.filter(id__in=linked_person_ids, family=family)
            for p in valid_persons:
                StoryPersonLink.objects.create(story=story, person=p)

        return story

    def update(self, instance, validated_data):
        linked_person_ids = validated_data.pop('linked_person_ids', None)
        story = super().update(instance, validated_data)

        if linked_person_ids is not None:
            StoryPersonLink.objects.filter(story=story).delete()
            family = story.family
            valid_persons = Person.objects.filter(id__in=linked_person_ids, family=family)
            for p in valid_persons:
                StoryPersonLink.objects.create(story=story, person=p)

        return story


class TimelineMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineMilestone
        fields = [
            'id', 'family_id', 'title', 'title_amharic', 'year', 'date',
            'is_approximate_date', 'era', 'description', 'location',
            'category', 'icon', 'primary_story_id', 'created_at'
        ]
        read_only_fields = ['id', 'family_id', 'created_at']
