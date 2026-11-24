from rest_framework import serializers
from apps.memories.models import Memory, Album, AlbumMemoryLink
from apps.genealogy.serializers import PersonSerializer
from apps.genealogy.models import Person


class MemorySerializer(serializers.ModelSerializer):
    linked_persons = PersonSerializer(many=True, read_only=True)
    uploader_name = serializers.SerializerMethodField()

    class Meta:
        model = Memory
        fields = [
            'id', 'family_id', 'title', 'description', 'media_type', 'media_url',
            'thumbnail_url', 'event_id', 'linked_persons', 'taken_at', 'taken_year',
            'taken_at_is_approximate', 'location_name', 'status', 'moderation_status',
            'moderation_notes', 'uploader_name', 'created_at', 'updated_at', 'trashed_at'
        ]
        read_only_fields = ['id', 'family_id', 'status', 'moderation_status', 'created_at', 'updated_at']

    def get_uploader_name(self, obj):
        if obj.created_by:
            return obj.created_by.full_name
        if obj.guest_session:
            return f"Guest: {obj.guest_session.guest_nickname}"
        return "Family Archive"


class CreateMemorySerializer(serializers.ModelSerializer):
    linked_person_ids = serializers.ListField(
        child=serializers.UUIDField(), required=False, write_only=True
    )
    album_id = serializers.UUIDField(required=False, write_only=True)

    class Meta:
        model = Memory
        fields = [
            'title', 'description', 'media_type', 'media_url', 'thumbnail_url',
            'event', 'taken_at', 'taken_year', 'taken_at_is_approximate',
            'location_name', 'linked_person_ids', 'album_id'
        ]

    def create(self, validated_data):
        linked_person_ids = validated_data.pop('linked_person_ids', [])
        album_id = validated_data.pop('album_id', None)

        memory = super().create(validated_data)

        if linked_person_ids:
            valid_persons = Person.objects.filter(id__in=linked_person_ids, family=memory.family)
            memory.linked_persons.set(valid_persons)

        if album_id:
            album = Album.objects.filter(id=album_id, family=memory.family).first()
            if album:
                AlbumMemoryLink.objects.create(album=album, memory=memory)

        return memory


class AlbumSerializer(serializers.ModelSerializer):
    memory_count = serializers.SerializerMethodField()
    memories = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = [
            'id', 'family_id', 'title', 'slug', 'description', 'cover_media_url',
            'memory_count', 'memories', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'family_id', 'slug', 'created_at', 'updated_at']

    def get_memory_count(self, obj):
        return obj.memories.filter(status=Memory.MemoryStatus.PUBLISHED).count()

    def get_memories(self, obj):
        qs = obj.memories.filter(status=Memory.MemoryStatus.PUBLISHED)[:12]
        return MemorySerializer(qs, many=True).data


class CreateAlbumSerializer(serializers.ModelSerializer):
    initial_memory_ids = serializers.ListField(
        child=serializers.UUIDField(), required=False, write_only=True
    )

    class Meta:
        model = Album
        fields = ['title', 'description', 'cover_media_url', 'initial_memory_ids']

    def create(self, validated_data):
        memory_ids = validated_data.pop('initial_memory_ids', [])
        album = super().create(validated_data)

        if memory_ids:
            valid_mems = Memory.objects.filter(id__in=memory_ids, family=album.family)
            for idx, m in enumerate(valid_mems):
                AlbumMemoryLink.objects.create(album=album, memory=m, order=idx)

        return album


class AddMemoryToAlbumSerializer(serializers.Serializer):
    memory_ids = serializers.ListField(child=serializers.UUIDField())


class ModerationActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['APPROVE', 'REJECT', 'FLAG'])
    notes = serializers.CharField(required=False, allow_blank=True, default='')
