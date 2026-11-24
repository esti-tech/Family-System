from collections import deque
from typing import Dict, List, Optional, Set, Tuple
from django.db.models import Q
from apps.genealogy.models import Person, ParentChildRelationship, PartnerRelationship


def would_create_parent_child_cycle(parent_id, child_id, family_id) -> bool:
    """
    Checks if adding an edge (parent_id -> child_id) would introduce a cycle in the DAG.
    A cycle occurs if parent_id is already a descendant of child_id.
    """
    if str(parent_id) == str(child_id):
        return True

    visited: Set[str] = set()
    queue = deque([str(child_id)])

    while queue:
        curr_id = queue.popleft()
        if curr_id == str(parent_id):
            return True
        if curr_id in visited:
            continue
        visited.add(curr_id)

        # Retrieve direct children of curr_id
        child_edges = ParentChildRelationship.objects.filter(
            family_id=family_id, parent_id=curr_id
        ).values_list('child_id', flat=True)

        for next_child_id in child_edges:
            str_next = str(next_child_id)
            if str_next not in visited:
                queue.append(str_next)

    return False


def get_ancestors_with_depth(person_id, family_id) -> Dict[str, int]:
    """
    Returns a dictionary of ancestor_id -> minimum generation distance from person_id.
    person_id itself is at depth 0.
    """
    ancestors: Dict[str, int] = {str(person_id): 0}
    queue = deque([(str(person_id), 0)])

    while queue:
        curr_id, depth = queue.popleft()

        parent_ids = ParentChildRelationship.objects.filter(
            family_id=family_id, child_id=curr_id
        ).values_list('parent_id', flat=True)

        for pid in parent_ids:
            str_pid = str(pid)
            new_depth = depth + 1
            if str_pid not in ancestors or new_depth < ancestors[str_pid]:
                ancestors[str_pid] = new_depth
                queue.append((str_pid, new_depth))

    return ancestors


def calculate_kinship(person_a: Person, person_b: Person) -> Dict:
    """
    Computes kinship relation between person_a and person_b.
    Returns dynamic English & Amharic relationship titles, generation offset, and common ancestor.
    """
    if person_a.family_id != person_b.family_id:
        return {
            "relationship_code": "CROSS_FAMILY",
            "relationship_en": "Different Families",
            "relationship_am": "የተለያየ ቤተሰብ",
            "degree": -1,
            "description": "Persons belong to different workspaces.",
        }

    if person_a.id == person_b.id:
        return {
            "relationship_code": "SELF",
            "relationship_en": "Self",
            "relationship_am": "ራሴ",
            "degree": 0,
            "description": f"{person_a.full_name}",
        }

    family_id = person_a.family_id

    # 1. Direct Partner / Spouse Check
    partner_rel = PartnerRelationship.objects.filter(
        family_id=family_id
    ).filter(
        (Q(person1=person_a) & Q(person2=person_b)) |
        (Q(person1=person_b) & Q(person2=person_a))
    ).first()

    if partner_rel:
        b_gender = person_b.gender
        en_title = "Husband" if b_gender == Person.Gender.MALE else "Wife" if b_gender == Person.Gender.FEMALE else "Spouse"
        am_title = "ባል" if b_gender == Person.Gender.MALE else "ሚስት" if b_gender == Person.Gender.FEMALE else "የትዳር አጋር"
        return {
            "relationship_code": "SPOUSE",
            "relationship_en": en_title,
            "relationship_am": am_title,
            "degree": 1,
            "description": f"{person_b.full_name} is the {en_title.lower()} of {person_a.full_name}.",
        }

    # 2. Biological Lowest Common Ancestor (LCA)
    anc_a = get_ancestors_with_depth(person_a.id, family_id)
    anc_b = get_ancestors_with_depth(person_b.id, family_id)

    common_ancestors = set(anc_a.keys()).intersection(set(anc_b.keys()))

    if common_ancestors:
        # Find LCA that minimizes total distance
        best_lca_id = min(common_ancestors, key=lambda anc_id: anc_a[anc_id] + anc_b[anc_id])
        d_a = anc_a[best_lca_id]
        d_b = anc_b[best_lca_id]
        lca_person = Person.objects.filter(id=best_lca_id).first()

        b_gender = person_b.gender
        is_male = b_gender == Person.Gender.MALE
        is_female = b_gender == Person.Gender.FEMALE

        # Kinship classification based on (distance_from_a_to_LCA, distance_from_b_to_LCA)
        if d_a == 1 and d_b == 0:
            # B is parent of A
            en = "Father" if is_male else "Mother" if is_female else "Parent"
            am = "አባት" if is_male else "እናት" if is_female else "ወላጅ"
            code = "PARENT"
        elif d_a == 0 and d_b == 1:
            # B is child of A
            en = "Son" if is_male else "Daughter" if is_female else "Child"
            am = "ወንድ ልጅ" if is_male else "ሴት ልጅ" if is_female else "ልጅ"
            code = "CHILD"
        elif d_a == 2 and d_b == 0:
            # B is grandparent of A
            en = "Grandfather" if is_male else "Grandmother" if is_female else "Grandparent"
            am = "አያት (ወንድ)" if is_male else "አያት (ሴት)" if is_female else "አያት"
            code = "GRANDPARENT"
        elif d_a == 0 and d_b == 2:
            # B is grandchild of A
            en = "Grandson" if is_male else "Granddaughter" if is_female else "Grandchild"
            am = "የልጅ ልጅ (ወንድ)" if is_male else "የልጅ ልጅ (ሴት)" if is_female else "የልጅ ልጅ"
            code = "GRANDCHILD"
        elif d_a == 1 and d_b == 1:
            # Siblings (share parent)
            en = "Brother" if is_male else "Sister" if is_female else "Sibling"
            am = "ወንድም" if is_male else "እህት" if is_female else "የስጋ ዘመድ"
            code = "SIBLING"
        elif d_a == 2 and d_b == 1:
            # B is sibling of A's parent -> Uncle or Aunt to A
            en = "Uncle" if is_male else "Aunt" if is_female else "Paternal/Maternal Relative"
            am = "አጎት" if is_male else "አክስት" if is_female else "አጎት/አክስት"
            code = "UNCLE_AUNT"
        elif d_a == 1 and d_b == 2:
            # B is child of A's sibling -> Nephew or Niece to A
            en = "Nephew" if is_male else "Niece" if is_female else "Sibling's Child"
            am = "የወንድም/እህት ልጅ (ወንድ)" if is_male else "የወንድም/እህት ልጅ (ሴት)" if is_female else "የወንድም/እህት ልጅ"
            code = "NIECE_NEPHEW"
        elif d_a == 2 and d_b == 2:
            # First cousins
            en = "First Cousin"
            am = "የአጎት/አክስት ልጅ"
            code = "FIRST_COUSIN"
        elif d_a == 3 and d_b == 0:
            # Great-grandparent
            en = "Great-Grandfather" if is_male else "Great-Grandmother" if is_female else "Great-Grandparent"
            am = "ቅድመ አያት"
            code = "GREAT_GRANDPARENT"
        elif d_a == 0 and d_b == 3:
            # Great-grandchild
            en = "Great-Grandchild"
            am = "የቅድመ አያት ልጅ"
            code = "GREAT_GRANDCHILD"
        else:
            # Extended / generational cousin
            degree = d_a + d_b
            en = f"Extended Relative ({degree}th degree)"
            am = f"የሩቅ ዘመድ ({degree}ኛ ደረጃ)"
            code = "EXTENDED_RELATIVE"

        return {
            "relationship_code": code,
            "relationship_en": en,
            "relationship_am": am,
            "degree": d_a + d_b,
            "common_ancestor": {
                "id": str(lca_person.id),
                "name": lca_person.full_name,
            } if lca_person else None,
            "description": f"{person_b.full_name} is the {en.lower()} of {person_a.full_name}.",
        }

    return {
        "relationship_code": "UNLINKED",
        "relationship_en": "Unlinked Relative",
        "relationship_am": "ያልተገናኘ ዘመድ",
        "degree": 99,
        "description": "No direct genealogical path found in the family tree canvas yet.",
    }


def detect_potential_duplicates(data: dict, family_id, exclude_person_id=None) -> List[Dict]:
    """
    Detects potential duplicate persons based on patronymic names and dates within the workspace.
    Does NOT automatically merge.
    """
    first_name = (data.get('first_name') or '').strip()
    father_name = (data.get('father_name') or '').strip()
    birth_year = data.get('birth_year')

    if not first_name:
        return []

    query = Q(family_id=family_id, first_name__iexact=first_name)
    if father_name:
        query &= Q(father_name__iexact=father_name)

    candidates = Person.objects.filter(query)
    if exclude_person_id:
        candidates = candidates.exclude(id=exclude_person_id)

    duplicates = []
    for candidate in candidates[:5]:
        score = 60
        reasons = ["Matching first and patronymic names"]

        if birth_year and candidate.birth_year:
            year_diff = abs(candidate.birth_year - int(birth_year))
            if year_diff == 0:
                score += 30
                reasons.append(f"Identical birth year ({birth_year})")
            elif year_diff <= 2:
                score += 20
                reasons.append(f"Close birth year (within {year_diff} years)")

        if data.get('birth_place') and candidate.birth_place:
            if data['birth_place'].strip().lower() == candidate.birth_place.strip().lower():
                score += 10
                reasons.append(f"Matching birth place ({candidate.birth_place})")

        duplicates.append({
            "id": str(candidate.id),
            "full_name": candidate.full_name,
            "birth_year": candidate.birth_year,
            "generation_level": candidate.generation_level,
            "confidence_score": min(score, 99),
            "match_reasons": reasons,
        })

    return duplicates


def export_family_tree_graph(family_id) -> Dict:
    """
    Aggregates persons and relationship edges formatted for React Flow canvas visualization.
    Calculates 2D coordinates arranged by generation level and horizontal spread.
    """
    persons = Person.objects.filter(family_id=family_id).order_by('generation_level', 'birth_year')
    parent_child_edges = ParentChildRelationship.objects.filter(family_id=family_id)
    partner_edges = PartnerRelationship.objects.filter(family_id=family_id)

    # Group persons by generation tier
    tiers: Dict[int, List[Person]] = {}
    for p in persons:
        gen = p.generation_level or 1
        tiers.setdefault(gen, []).append(p)

    nodes = []
    NODE_WIDTH = 260
    NODE_HEIGHT = 140
    HORIZONTAL_GAP = 60
    VERTICAL_GAP = 180

    for gen, tier_persons in tiers.items():
        total_in_tier = len(tier_persons)
        total_width = total_in_tier * NODE_WIDTH + (total_in_tier - 1) * HORIZONTAL_GAP
        start_x = -total_width // 2

        for idx, p in enumerate(tier_persons):
            pos_x = start_x + idx * (NODE_WIDTH + HORIZONTAL_GAP)
            pos_y = (gen - 1) * (NODE_HEIGHT + VERTICAL_GAP)

            nodes.append({
                "id": str(p.id),
                "type": "personNode",
                "position": {"x": pos_x, "y": pos_y},
                "data": {
                    "id": str(p.id),
                    "fullName": p.full_name,
                    "firstName": p.first_name,
                    "fatherName": p.father_name,
                    "gender": p.gender,
                    "isLiving": p.is_living,
                    "birthYear": p.birth_year or (p.birth_date.year if p.birth_date else None),
                    "deathYear": p.death_year or (p.death_date.year if p.death_date else None),
                    "birthPlace": p.birth_place,
                    "culturalTitles": p.cultural_titles,
                    "avatarUrl": p.avatar_url,
                    "generationLevel": p.generation_level,
                }
            })

    edges = []
    # Parent-child directed edges
    for pc in parent_child_edges:
        edges.append({
            "id": f"pc-{pc.id}",
            "source": str(pc.parent_id),
            "target": str(pc.child_id),
            "type": "smoothstep",
            "animated": False,
            "style": {"stroke": "#C18B58", "strokeWidth": 2},
            "data": {"relationshipType": pc.relationship_type},
        })

    # Partner bi-directional edges
    for part in partner_edges:
        edges.append({
            "id": f"partner-{part.id}",
            "source": str(part.person1_id),
            "target": str(part.person2_id),
            "type": "straight",
            "style": {"stroke": "#D5C9B8", "strokeWidth": 2, "strokeDasharray": "4 4"},
            "data": {"relationshipType": part.relationship_type, "isPartner": True},
        })

    return {
        "nodes": nodes,
        "edges": edges,
        "total_persons": len(nodes),
        "total_generations": len(tiers),
    }
