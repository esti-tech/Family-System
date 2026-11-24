from django.utils import timezone
from django.db.models import Q
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.families.permissions import IsFamilyMember, IsFamilyAdmin
from apps.families.models import FamilyRole
from apps.common.responses import success_response
from apps.genealogy.models import (
    Person, ParentChildRelationship, PartnerRelationship, PendingTreeChange
)
from apps.genealogy.serializers import (
    PersonSerializer, CreatePersonSerializer,
    ParentChildRelationshipSerializer, CreateParentChildSerializer,
    PartnerRelationshipSerializer, CreatePartnerSerializer,
    KinshipCalculateSerializer, PendingTreeChangeSerializer
)
from apps.genealogy.services import (
    calculate_kinship, detect_potential_duplicates, export_family_tree_graph
)


class PersonListView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(responses={200: PersonSerializer(many=True)})
    def get(self, request, id=None, slug=None):
        """Lists and searches people belonging to this family workspace."""
        family = request.family
        queryset = Person.objects.filter(family=family)

        query = request.query_params.get('search')
        if query:
            queryset = queryset.filter(
                Q(first_name__icontains=query) |
                Q(father_name__icontains=query) |
                Q(grandfather_name__icontains=query) |
                Q(nickname__icontains=query)
            )

        gender = request.query_params.get('gender')
        if gender:
            queryset = queryset.filter(gender=gender)

        is_living = request.query_params.get('is_living')
        if is_living is not None:
            queryset = queryset.filter(is_living=is_living.lower() in ['true', '1'])

        generation = request.query_params.get('generation')
        if generation:
            queryset = queryset.filter(generation_level=int(generation))

        serializer = PersonSerializer(queryset, many=True)
        return success_response(data=serializer.data)

    @extend_schema(request=CreatePersonSerializer, responses={201: PersonSerializer})
    def post(self, request, id=None, slug=None):
        """Adds a new person to the family tree or queues a change proposal."""
        family = request.family
        serializer = CreatePersonSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_role = request.family_membership.role.code
        requires_approval = (
            family.settings.get('approval_mode') == 'ADMIN_APPROVAL' and
            user_role not in [FamilyRole.SystemRole.OWNER, FamilyRole.SystemRole.ADMIN]
        )

        if requires_approval:
            proposal = PendingTreeChange.objects.create(
                family=family,
                proposed_by=request.user,
                change_type=PendingTreeChange.ChangeType.ADD_PERSON,
                payload=serializer.validated_data,
                status=PendingTreeChange.Status.PENDING
            )
            return success_response(
                data=PendingTreeChangeSerializer(proposal).data,
                message="Tree change proposal submitted for administrator review.",
                status_code=status.HTTP_202_ACCEPTED
            )

        person = serializer.save(family=family, created_by=request.user)
        return success_response(
            data=PersonSerializer(person).data,
            message=f"{person.full_name} added to family archive.",
            status_code=status.HTTP_201_CREATED
        )


class PersonDetailView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, person_id, id=None, slug=None):
        """Retrieves complete profile details for a person including biological and partner relations."""
        family = request.family
        person = Person.objects.filter(id=person_id, family=family).first()
        if not person:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Person not found in this family."}},
                status=status.HTTP_404_NOT_FOUND
            )

        data = PersonSerializer(person).data

        # Load parents
        parents = Person.objects.filter(
            id__in=ParentChildRelationship.objects.filter(
                family=family, child=person
            ).values_list('parent_id', flat=True)
        )
        data['parents'] = PersonSerializer(parents, many=True).data

        # Load children
        children = Person.objects.filter(
            id__in=ParentChildRelationship.objects.filter(
                family=family, parent=person
            ).values_list('child_id', flat=True)
        )
        data['children'] = PersonSerializer(children, many=True).data

        # Load partners
        partner_p1 = PartnerRelationship.objects.filter(family=family, person1=person).values_list('person2_id', flat=True)
        partner_p2 = PartnerRelationship.objects.filter(family=family, person2=person).values_list('person1_id', flat=True)
        partner_ids = list(partner_p1) + list(partner_p2)
        partners = Person.objects.filter(id__in=partner_ids)
        data['partners'] = PersonSerializer(partners, many=True).data

        return success_response(data=data)

    def patch(self, request, person_id, id=None, slug=None):
        """Updates person biographical details."""
        family = request.family
        person = Person.objects.filter(id=person_id, family=family).first()
        if not person:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Person not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        user_role = request.family_membership.role.code
        requires_approval = (
            family.settings.get('approval_mode') == 'ADMIN_APPROVAL' and
            user_role not in [FamilyRole.SystemRole.OWNER, FamilyRole.SystemRole.ADMIN]
        )

        serializer = CreatePersonSerializer(person, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        if requires_approval:
            proposal = PendingTreeChange.objects.create(
                family=family,
                proposed_by=request.user,
                change_type=PendingTreeChange.ChangeType.EDIT_PERSON,
                target_person=person,
                payload=serializer.validated_data,
                status=PendingTreeChange.Status.PENDING
            )
            return success_response(
                data=PendingTreeChangeSerializer(proposal).data,
                message="Edit proposal submitted for administrator approval.",
                status_code=status.HTTP_202_ACCEPTED
            )

        updated_person = serializer.save()
        return success_response(data=PersonSerializer(updated_person).data, message="Person profile updated.")

    def delete(self, request, person_id, id=None, slug=None):
        """Removes a person record (Admin only)."""
        family = request.family
        if request.family_membership.role.code not in [FamilyRole.SystemRole.OWNER, FamilyRole.SystemRole.ADMIN]:
            return Response(
                {"success": False, "error": {"code": "FORBIDDEN", "message": "Admin authorization required to delete person."}},
                status=status.HTTP_403_FORBIDDEN
            )

        person = Person.objects.filter(id=person_id, family=family).first()
        if not person:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Person not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        person.delete()
        return success_response(message="Person removed from family archive.")


class FamilyTreeGraphView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, id=None, slug=None):
        """Returns nodes and edges formatted for the interactive React Flow canvas."""
        family = request.family
        graph_data = export_family_tree_graph(family.id)
        return success_response(data=graph_data)


class ParentChildRelationshipView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(request=CreateParentChildSerializer)
    def post(self, request, id=None, slug=None):
        """Creates a parent-child directed relationship edge with cycle detection."""
        family = request.family
        serializer = CreateParentChildSerializer(data=request.data, context={'family': family})
        serializer.is_valid(raise_exception=True)

        edge = ParentChildRelationship.objects.create(
            family=family,
            parent=serializer.validated_data['parent'],
            child=serializer.validated_data['child'],
            relationship_type=serializer.validated_data['relationship_type']
        )

        return success_response(
            data=ParentChildRelationshipSerializer(edge).data,
            message="Parent-child relationship created successfully.",
            status_code=status.HTTP_201_CREATED
        )

    def delete(self, request, relationship_id, id=None, slug=None):
        """Deletes a parent-child relationship edge."""
        family = request.family
        edge = ParentChildRelationship.objects.filter(id=relationship_id, family=family).first()
        if not edge:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Relationship not found."}},
                status=status.HTTP_404_NOT_FOUND
            )
        edge.delete()
        return success_response(message="Relationship removed.")


class PartnerRelationshipView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(request=CreatePartnerSerializer)
    def post(self, request, id=None, slug=None):
        """Creates a spouse/partner relationship between two persons."""
        family = request.family
        serializer = CreatePartnerSerializer(data=request.data, context={'family': family})
        serializer.is_valid(raise_exception=True)

        edge = PartnerRelationship.objects.create(
            family=family,
            person1=serializer.validated_data['person1'],
            person2=serializer.validated_data['person2'],
            relationship_type=serializer.validated_data['relationship_type'],
            marriage_date=serializer.validated_data.get('marriage_date'),
            marriage_place=serializer.validated_data.get('marriage_place', ''),
            is_current=serializer.validated_data.get('is_current', True)
        )

        return success_response(
            data=PartnerRelationshipSerializer(edge).data,
            message="Partner relationship recorded successfully.",
            status_code=status.HTTP_201_CREATED
        )

    def delete(self, request, relationship_id, id=None, slug=None):
        """Deletes a partner relationship edge."""
        family = request.family
        edge = PartnerRelationship.objects.filter(id=relationship_id, family=family).first()
        if not edge:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Relationship not found."}},
                status=status.HTTP_404_NOT_FOUND
            )
        edge.delete()
        return success_response(message="Partner relationship removed.")


class KinshipCalculateView(APIView):
    permission_classes = [IsFamilyMember]

    @extend_schema(request=KinshipCalculateSerializer)
    def post(self, request, id=None, slug=None):
        """Calculates dynamic kinship degree and English + Amharic terms between two people."""
        family = request.family
        serializer = KinshipCalculateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        p1 = Person.objects.filter(id=serializer.validated_data['person_a_id'], family=family).first()
        p2 = Person.objects.filter(id=serializer.validated_data['person_b_id'], family=family).first()

        if not p1 or not p2:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Both persons must exist in this family."}},
                status=status.HTTP_404_NOT_FOUND
            )

        kinship_result = calculate_kinship(p1, p2)
        return success_response(data=kinship_result)


class DuplicatePersonCheckView(APIView):
    permission_classes = [IsFamilyMember]

    def post(self, request, id=None, slug=None):
        """Checks for candidate duplicate records in the family workspace before saving."""
        family = request.family
        duplicates = detect_potential_duplicates(
            request.data, family.id, exclude_person_id=request.data.get('exclude_id')
        )
        return success_response(data=duplicates)


class PendingTreeChangeListView(APIView):
    permission_classes = [IsFamilyMember]

    def get(self, request, id=None, slug=None):
        """Lists pending tree modification proposals."""
        family = request.family
        proposals = PendingTreeChange.objects.filter(
            family=family, status=PendingTreeChange.Status.PENDING
        )
        serializer = PendingTreeChangeSerializer(proposals, many=True)
        return success_response(data=serializer.data)


class PendingTreeChangeActionView(APIView):
    permission_classes = [IsFamilyAdmin]

    def post(self, request, proposal_id, action, id=None, slug=None):
        """Admin approves or rejects a tree change proposal."""
        family = request.family
        proposal = PendingTreeChange.objects.filter(
            id=proposal_id, family=family, status=PendingTreeChange.Status.PENDING
        ).first()

        if not proposal:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Pending proposal not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        notes = request.data.get('review_notes', '')

        if action.lower() == 'approve':
            # Execute the proposal payload into real records
            if proposal.change_type == PendingTreeChange.ChangeType.ADD_PERSON:
                serializer = CreatePersonSerializer(data=proposal.payload)
                if serializer.is_valid():
                    serializer.save(family=family, created_by=proposal.proposed_by)
            elif proposal.change_type == PendingTreeChange.ChangeType.EDIT_PERSON and proposal.target_person:
                serializer = CreatePersonSerializer(proposal.target_person, data=proposal.payload, partial=True)
                if serializer.is_valid():
                    serializer.save()

            proposal.status = PendingTreeChange.Status.APPROVED
            proposal.reviewed_by = request.user
            proposal.reviewed_at = timezone.now()
            proposal.review_notes = notes
            proposal.save()

            return success_response(message="Proposal approved and merged into family graph.")

        elif action.lower() == 'reject':
            proposal.status = PendingTreeChange.Status.REJECTED
            proposal.reviewed_by = request.user
            proposal.reviewed_at = timezone.now()
            proposal.review_notes = notes
            proposal.save()

            return success_response(message="Proposal rejected.")

        return Response(
            {"success": False, "error": {"code": "BAD_REQUEST", "message": "Invalid action. Use 'approve' or 'reject'."}},
            status=status.HTTP_400_BAD_REQUEST
        )
