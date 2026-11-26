from django.contrib import admin
from apps.families.models import Family, FamilyRole, Permission, FamilyMembership, FamilyInvitation

@admin.register(Family)
class FamilyAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'origin_country', 'status', 'created_by', 'created_at')
    search_fields = ('name', 'slug', 'origin_city', 'origin_country')
    list_filter = ('status', 'origin_country')

@admin.register(FamilyRole)
class FamilyRoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'is_system')
    search_fields = ('name', 'code')

@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'module')
    list_filter = ('module',)
    search_fields = ('name', 'code')

@admin.register(FamilyMembership)
class FamilyMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'family', 'role', 'status', 'joined_at')
    list_filter = ('status', 'role')
    search_fields = ('user__email', 'family__name')

@admin.register(FamilyInvitation)
class FamilyInvitationAdmin(admin.ModelAdmin):
    list_display = ('email', 'family', 'role', 'status', 'expires_at')
    list_filter = ('status',)
    search_fields = ('email', 'family__name')
