from django.contrib import admin
from apps.subscriptions.models import Plan, FamilySubscription, Invoice

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'price_etb', 'price_usd', 'billing_interval', 'storage_limit_gb', 'member_limit', 'is_active')
    list_filter = ('billing_interval', 'is_active')
    search_fields = ('name', 'slug')

@admin.register(FamilySubscription)
class FamilySubscriptionAdmin(admin.ModelAdmin):
    list_display = ('family', 'plan', 'status', 'currency', 'current_period_end')
    list_filter = ('status', 'currency')
    search_fields = ('family__name', 'plan__name')

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'family', 'amount', 'currency', 'status', 'paid_at')
    list_filter = ('status', 'currency')
    search_fields = ('invoice_number', 'family__name')
