from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.families.models import Family, FamilyRole, FamilyMembership
from apps.genealogy.models import (
    Person, ParentChildRelationship, PartnerRelationship, PendingTreeChange
)
from apps.genealogy.services import calculate_kinship, would_create_parent_child_cycle

User = get_user_model()


class GenealogyTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Seed roles using standard SystemRole values
        self.owner_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.OWNER, defaults={'name': 'Family Owner'}
        )
        self.admin_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.ADMIN, defaults={'name': 'Family Admin'}
        )
        self.editor_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.EDITOR, defaults={'name': 'Family Editor'}
        )
        self.viewer_role, _ = FamilyRole.objects.get_or_create(
            code=FamilyRole.SystemRole.VIEWER, defaults={'name': 'Family Viewer'}
        )

        # Create primary family workspace
        self.user = User.objects.create_user(
            email='genealogy.tester@kinkeep.com',
            password='StrongPassword123!',
            full_name='Genealogy Tester'
        )
        self.family = Family.objects.create(
            name='Wolde Ancestral Family',
            slug='wolde-family',
            origin_city='Gondar',
            origin_country='Ethiopia',
            created_by=self.user,
            settings={'approval_mode': 'IMMEDIATE'}
        )
        self.membership = FamilyMembership.objects.create(
            family=self.family,
            user=self.user,
            role=self.owner_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        # Create separate foreign family for cross-tenant testing
        self.other_user = User.objects.create_user(
            email='other.tester@kinkeep.com',
            password='StrongPassword123!',
            full_name='Other Family Member'
        )
        self.other_family = Family.objects.create(
            name='Mekonnen Family',
            slug='mekonnen-family',
            created_by=self.other_user
        )
        self.other_membership = FamilyMembership.objects.create(
            family=self.other_family,
            user=self.other_user,
            role=self.owner_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        self.client.force_authenticate(user=self.user)

    def test_create_person(self):
        """Tests creating a person with patronymic naming and life details."""
        url = f'/api/v1/families/{self.family.id}/persons/'
        payload = {
            'first_name': 'Bekele',
            'father_name': 'Wolde',
            'grandfather_name': 'Mariam',
            'gender': 'MALE',
            'is_living': False,
            'birth_year': 1918,
            'birth_place': 'Gondar, Begemder',
            'cultural_titles': 'Grazmach',
            'generation_level': 1,
            'biography': 'Respected elder and community historian in Begemder.'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['data']['full_name'], 'Bekele Wolde Mariam')
        self.assertEqual(res.data['data']['cultural_titles'], 'Grazmach')

    def test_parent_child_relationship_creation(self):
        """Tests connecting a parent to a child in the same family."""
        parent = Person.objects.create(
            family=self.family, first_name='Bekele', father_name='Wolde',
            gender='MALE', generation_level=1
        )
        child = Person.objects.create(
            family=self.family, first_name='Yonas', father_name='Bekele',
            gender='MALE', generation_level=2
        )

        url = f'/api/v1/families/{self.family.id}/relationships/parent-child/'
        payload = {
            'parent_id': str(parent.id),
            'child_id': str(child.id),
            'relationship_type': 'BIOLOGICAL'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            ParentChildRelationship.objects.filter(family=self.family, parent=parent, child=child).exists()
        )

    def test_parent_child_cycle_detection(self):
        """
        Tests DAG cycle detection:
        If A is parent of B, and B is parent of C, then adding C as parent of A must be REJECTED.
        """
        a = Person.objects.create(family=self.family, first_name='Person A', generation_level=1)
        b = Person.objects.create(family=self.family, first_name='Person B', generation_level=2)
        c = Person.objects.create(family=self.family, first_name='Person C', generation_level=3)

        ParentChildRelationship.objects.create(family=self.family, parent=a, child=b)
        ParentChildRelationship.objects.create(family=self.family, parent=b, child=c)

        # Service level cycle check
        self.assertTrue(would_create_parent_child_cycle(c.id, a.id, self.family.id))

        # API level cycle rejection
        url = f'/api/v1/families/{self.family.id}/relationships/parent-child/'
        res = self.client.post(url, {'parent_id': str(c.id), 'child_id': str(a.id)}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("circular loop", str(res.data))

    def test_cannot_be_own_parent(self):
        """Tests that a person cannot be connected as their own parent."""
        p = Person.objects.create(family=self.family, first_name='Abebe')
        url = f'/api/v1/families/{self.family.id}/relationships/parent-child/'
        res = self.client.post(url, {'parent_id': str(p.id), 'child_id': str(p.id)}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cross_family_relationship_isolation(self):
        """Tests that relationships across different families are strictly prohibited."""
        p_fam1 = Person.objects.create(family=self.family, first_name='Fam1 Member')
        p_fam2 = Person.objects.create(family=self.other_family, first_name='Fam2 Member')

        url = f'/api/v1/families/{self.family.id}/relationships/parent-child/'
        res = self.client.post(url, {'parent_id': str(p_fam1.id), 'child_id': str(p_fam2.id)}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_relationship_prevention(self):
        """Tests that duplicate edges cannot be recorded."""
        p1 = Person.objects.create(family=self.family, first_name='Parent')
        p2 = Person.objects.create(family=self.family, first_name='Child')
        ParentChildRelationship.objects.create(family=self.family, parent=p1, child=p2)

        url = f'/api/v1/families/{self.family.id}/relationships/parent-child/'
        res = self.client.post(url, {'parent_id': str(p1.id), 'child_id': str(p2.id)}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_kinship_calculator_degrees(self):
        """Tests dynamic kinship calculation across parents, siblings, grandparents, and cousins."""
        # Setup 3-tier family:
        # Grandfather: Bekele
        # Children: Yonas (son), Hana (daughter)
        # Grandchild: Dawit (son of Yonas)
        # Cousin: Selam (daughter of Hana)
        grandfather = Person.objects.create(
            family=self.family, first_name='Bekele', gender='MALE', generation_level=1
        )
        son = Person.objects.create(
            family=self.family, first_name='Yonas', father_name='Bekele', gender='MALE', generation_level=2
        )
        daughter = Person.objects.create(
            family=self.family, first_name='Hana', father_name='Bekele', gender='FEMALE', generation_level=2
        )
        grandchild = Person.objects.create(
            family=self.family, first_name='Dawit', father_name='Yonas', gender='MALE', generation_level=3
        )
        cousin = Person.objects.create(
            family=self.family, first_name='Selam', father_name='Mekonnen', gender='FEMALE', generation_level=3
        )

        ParentChildRelationship.objects.create(family=self.family, parent=grandfather, child=son)
        ParentChildRelationship.objects.create(family=self.family, parent=grandfather, child=daughter)
        ParentChildRelationship.objects.create(family=self.family, parent=son, child=grandchild)
        ParentChildRelationship.objects.create(family=self.family, parent=daughter, child=cousin)

        # 1. Parent test: son -> grandfather (Father / አባት)
        k_father = calculate_kinship(son, grandfather)
        self.assertEqual(k_father['relationship_code'], 'PARENT')
        self.assertEqual(k_father['relationship_en'], 'Father')
        self.assertEqual(k_father['relationship_am'], 'አባት')

        # 2. Sibling test: son -> daughter (Sister / እህት)
        k_sibling = calculate_kinship(son, daughter)
        self.assertEqual(k_sibling['relationship_code'], 'SIBLING')
        self.assertEqual(k_sibling['relationship_en'], 'Sister')
        self.assertEqual(k_sibling['relationship_am'], 'እህት')

        # 3. Grandparent test: grandchild -> grandfather (Grandfather / አያት)
        k_grand = calculate_kinship(grandchild, grandfather)
        self.assertEqual(k_grand['relationship_code'], 'GRANDPARENT')
        self.assertEqual(k_grand['relationship_en'], 'Grandfather')

        # 4. Uncle/Aunt test: grandchild -> daughter (Aunt / አክስት)
        k_aunt = calculate_kinship(grandchild, daughter)
        self.assertEqual(k_aunt['relationship_code'], 'UNCLE_AUNT')
        self.assertEqual(k_aunt['relationship_en'], 'Aunt')
        self.assertEqual(k_aunt['relationship_am'], 'አክስት')

        # 5. First Cousin test: grandchild -> cousin (First Cousin / የአጎት/አክስት ልጅ)
        k_cousin = calculate_kinship(grandchild, cousin)
        self.assertEqual(k_cousin['relationship_code'], 'FIRST_COUSIN')
        self.assertEqual(k_cousin['relationship_am'], 'የአጎት/አክስት ልጅ')

    def test_tree_graph_export(self):
        """Tests that export_family_tree_graph provides React Flow compatible format."""
        p1 = Person.objects.create(family=self.family, first_name='Root Person', generation_level=1)
        p2 = Person.objects.create(family=self.family, first_name='Child Person', generation_level=2)
        ParentChildRelationship.objects.create(family=self.family, parent=p1, child=p2)

        url = f'/api/v1/families/{self.family.id}/tree/'
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data['data']
        self.assertEqual(len(data['nodes']), 2)
        self.assertEqual(len(data['edges']), 1)
        self.assertEqual(data['nodes'][0]['type'], 'personNode')
        self.assertIn('position', data['nodes'][0])

    def test_duplicate_person_detection(self):
        """Tests detecting duplicate persons by patronymic name and birth year."""
        Person.objects.create(
            family=self.family, first_name='Bekele', father_name='Wolde', birth_year=1918
        )

        url = f'/api/v1/families/{self.family.id}/persons/duplicates/'
        res = self.client.post(url, {
            'first_name': 'Bekele',
            'father_name': 'Wolde',
            'birth_year': 1918
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        duplicates = res.data['data']
        self.assertEqual(len(duplicates), 1)
        self.assertGreaterEqual(duplicates[0]['confidence_score'], 80)

    def test_tree_proposal_workflow(self):
        """Tests submitting, approving, and merging a tree change proposal under ADMIN_APPROVAL."""
        # Enable admin approval policy
        self.family.settings['approval_mode'] = 'ADMIN_APPROVAL'
        self.family.save()

        # Create an Editor user
        editor = User.objects.create_user(
            email='editor.tester@kinkeep.com', password='Password123!', full_name='Editor User'
        )
        FamilyMembership.objects.create(
            family=self.family, user=editor, role=self.editor_role,
            status=FamilyMembership.MembershipStatus.ACTIVE
        )

        # Editor submits add person
        self.client.force_authenticate(user=editor)
        url = f'/api/v1/families/{self.family.id}/persons/'
        res = self.client.post(url, {
            'first_name': 'Proposed Person',
            'father_name': 'Tester',
            'gender': 'FEMALE'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_202_ACCEPTED)
        proposal_id = res.data['data']['id']

        # Admin approves proposal
        self.client.force_authenticate(user=self.user)
        action_url = f'/api/v1/families/{self.family.id}/tree/proposals/{proposal_id}/approve/'
        res_approve = self.client.post(action_url, {'review_notes': 'Verified through baptismal record.'}, format='json')
        self.assertEqual(res_approve.status_code, status.HTTP_200_OK)

        # Verify person now exists in main table
        self.assertTrue(Person.objects.filter(family=self.family, first_name='Proposed Person').exists())
