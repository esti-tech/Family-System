from django.contrib import admin
from apps.genealogy.models import (
    Person, ParentChildRelationship, PartnerRelationship,
    PersonAccountLink, PendingTreeChange
)

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'family', 'gender', 'generation_level', 'is_living', 'birth_year')
    search_fields = ('first_name', 'father_name', 'grandfather_name', 'family__name')
    list_filter = ('gender', 'is_living', 'generation_level')

@admin.register(ParentChildRelationship)
class ParentChildRelationshipAdmin(admin.ModelAdmin):
    list_display = ('parent', 'child', 'relationship_type', 'family')
    list_filter = ('relationship_type',)
    search_fields = ('parent__first_name', 'child__first_name', 'family__name')

@admin.register(PartnerRelationship)
class PartnerRelationshipAdmin(admin.ModelAdmin):
    list_display = ('person1', 'person2', 'relationship_type', 'is_current', 'family')
    list_filter = ('relationship_type', 'is_current')
    search_fields = ('person1__first_name', 'person2__first_name')

@admin.register(PersonAccountLink)
class PersonAccountLinkAdmin(admin.ModelAdmin):
    list_display = ('person', 'user', 'is_verified', 'family')
    list_filter = ('is_verified',)
    search_fields = ('person__first_name', 'user__email')

@admin.register(PendingTreeChange)
class PendingTreeChangeAdmin(admin.ModelAdmin):
    list_display = ('change_type', 'family', 'status', 'proposed_by', 'created_at')
    list_filter = ('change_type', 'status')
