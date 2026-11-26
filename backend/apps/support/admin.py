from django.contrib import admin
from apps.support.models import SupportTicket, SupportTicketMessage

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_number', 'subject', 'category', 'priority', 'status', 'user', 'created_at')
    list_filter = ('category', 'priority', 'status')
    search_fields = ('ticket_number', 'subject', 'user__email')

@admin.register(SupportTicketMessage)
class SupportTicketMessageAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'sender', 'is_internal_note', 'created_at')
    list_filter = ('is_internal_note',)
    search_fields = ('ticket__ticket_number', 'sender__email', 'message')
