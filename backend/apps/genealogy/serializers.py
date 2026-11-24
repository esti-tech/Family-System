from rest_framework import serializers
from apps.genealogy.models import (
    Person, ParentChildRelationship, PartnerRelationship, PersonAccountLink, PendingTreeChange
)
from apps.genealogy.services import would_create_parent_child_cycle


class PersonSerializer(models_serializer := serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Person
        fields = [
            'id', 'family_id', 'first_name', 'father_name', 'grandfather_name',
            'full_name', 'nickname', 'maiden_name', 'gender', 'is_living',
            'birth_date', 'birth_year', 'birth_date_is_approximate', 'birth_place',
            'death_date', 'death_year', 'death_date_is_approximate', 'death_place',
            'biography', 'cultural_titles', 'avatar_url', 'generation_level',
            'privacy_level', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'family_id', 'created_at', 'updated_at']


class CreatePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = [
            'first_name', 'father_name', 'grandfather_name', 'nickname', 'maiden_name',
            'gender', 'is_living', 'birth_date', 'birth_year', 'birth_date_is_approximate',
            'birth_place', 'death_date', 'death_year', 'death_date_is_approximate',
            'death_place', 'biography', 'cultural_titles', 'avatar_url', 'generation_level',
            'privacy_level'
        ]


class ParentChildRelationshipSerializer(serializers.ModelSerializer):
    parent = PersonSerializer(read_only=True)
    child = PersonSerializer(read_only=True)

    class Meta:
        model = ParentChildRelationship
        fields = ['id', 'family_id', 'parent', 'child', 'relationship_type', 'created_at']


class CreateParentChildSerializer(serializers.Serializer):
    parent_id = serializers.UUIDField()
    child_id = serializers.UUIDField()
    relationship_type = serializers.ChoiceField(
        choices=ParentChildRelationship.RelationshipType.choices,
        default=ParentChildRelationship.RelationshipType.BIOLOGICAL
    )

    def validate(self, attrs):
        parent_id = attrs['parent_id']
        child_id = attrs['child_id']

        if parent_id == child_id:
            raise serializers.ValidationError("A person cannot be their own parent.")

        family = self.context.get('family')
        if not family:
            raise serializers.ValidationError("Family context required.")

        parent = Person.objects.filter(id=parent_id, family=family).first()
        child = Person.objects.filter(id=child_id, family=family).first()

        if not parent or not child:
            raise serializers.ValidationError("Both parent and child must exist within this family workspace.")

        # Check existing edge
        if ParentChildRelationship.objects.filter(family=family, parent=parent, child=child).exists():
            raise serializers.ValidationError("This parent-child relationship already exists.")

        # DAG Cycle Detection
        if would_create_parent_child_cycle(parent_id, child_id, family.id):
            raise serializers.ValidationError(
                "Cannot add relationship: would create a circular loop in the family tree."
            )

        attrs['parent'] = parent
        attrs['child'] = child
        return attrs


class PartnerRelationshipSerializer(serializers.ModelSerializer):
    person1 = PersonSerializer(read_only=True)
    person2 = PersonSerializer(read_only=True)

    class Meta:
        model = PartnerRelationship
        fields = [
            'id', 'family_id', 'person1', 'person2', 'relationship_type',
            'marriage_date', 'marriage_place', 'is_current', 'created_at'
        ]


class CreatePartnerSerializer(serializers.Serializer):
    person1_id = serializers.UUIDField()
    person2_id = serializers.UUIDField()
    relationship_type = serializers.ChoiceField(
        choices=PartnerRelationship.RelationshipType.choices,
        default=PartnerRelationship.RelationshipType.MARRIED
    )
    marriage_date = serializers.DateField(required=False, allow_null=True)
    marriage_place = serializers.CharField(max_length=200, required=False, allow_blank=True)
    is_current = serializers.BooleanField(default=True)

    def validate(self, attrs):
        p1_id = attrs['person1_id']
        p2_id = attrs['person2_id']

        if p1_id == p2_id:
            raise serializers.ValidationError("A person cannot be partnered with themselves.")

        family = self.context.get('family')
        p1 = Person.objects.filter(id=p1_id, family=family).first()
        p2 = Person.objects.filter(id=p2_id, family=family).first()

        if not p1 or not p2:
            raise serializers.ValidationError("Both partners must exist within this family workspace.")

        # Check existing partner edge in either orientation
        from django.db.models import Q
        exists = PartnerRelationship.objects.filter(
            family=family
        ).filter(
            (Q(person1=p1, person2=p2) | Q(person1=p2, person2=p1))
        ).exists()

        if exists:
            raise serializers.ValidationError("A partner relationship already exists between these two persons.")

        attrs['person1'] = p1
        attrs['person2'] = p2
        return attrs


class KinshipCalculateSerializer(serializers.Serializer):
    person_a_id = serializers.UUIDField()
    person_b_id = serializers.UUIDField()


class PendingTreeChangeSerializer(serializers.ModelSerializer):
    proposed_by_email = serializers.CharField(source='proposed_by.email', read_only=True)
    target_person_name = serializers.CharField(source='target_person.full_name', read_only=True)

    class Meta:
        model = PendingTreeChange
        fields = [
            'id', 'family_id', 'proposed_by_email', 'change_type', 'target_person_name',
            'target_person_id', 'payload', 'status', 'reviewed_by_id', 'review_notes',
            'created_at', 'reviewed_at'
        ]
        read_only_fields = ['id', 'family_id', 'status', 'reviewed_by_id', 'created_at', 'reviewed_at']
