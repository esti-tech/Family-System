from django.contrib import admin
from apps.events.models import Event, EventGuest, EventGuestbookEntry

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'family', 'event_type', 'status', 'start_datetime', 'location_city')
    list_filter = ('event_type', 'status')
    search_fields = ('title', 'family__name', 'location_name', 'location_city')

@admin.register(EventGuest)
class EventGuestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'event', 'rsvp_status', 'party_size', 'email')
    list_filter = ('rsvp_status',)
    search_fields = ('full_name', 'email', 'event__title')

@admin.register(EventGuestbookEntry)
class EventGuestbookEntryAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'event', 'created_at')
    search_fields = ('author_name', 'event__title', 'message')
