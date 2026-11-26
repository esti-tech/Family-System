from django.contrib import admin
from apps.payments.models import PaymentTransaction

@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('reference', 'family', 'provider', 'amount', 'currency', 'status', 'created_at')
    list_filter = ('provider', 'status', 'currency')
    search_fields = ('reference', 'provider_tx_id', 'family__name')
