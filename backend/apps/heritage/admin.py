from django.contrib import admin
from apps.heritage.models import Story, StoryPersonLink, TimelineMilestone

@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'family', 'category', 'status', 'event_year', 'author', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('title', 'title_amharic', 'content', 'family__name')

@admin.register(StoryPersonLink)
class StoryPersonLinkAdmin(admin.ModelAdmin):
    list_display = ('story', 'person', 'role_in_story')
    search_fields = ('story__title', 'person__first_name')

@admin.register(TimelineMilestone)
class TimelineMilestoneAdmin(admin.ModelAdmin):
    list_display = ('year', 'title', 'category', 'family', 'era')
    list_filter = ('category',)
    search_fields = ('title', 'family__name', 'description')
