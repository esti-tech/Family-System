from rest_framework import serializers
from apps.subscriptions.models import Plan, FamilySubscription, Invoice


class PlanSerializer(serializers.ModelSerializer):
    storage_limit_gb = serializers.FloatField(read_only=True)

    class Meta:
        model = Plan
        fields = [
            'id', 'name', 'slug', 'tagline', 'description', 'price_etb',
            'price_usd', 'billing_interval', 'storage_limit_bytes',
            'storage_limit_gb', 'member_limit', 'features', 'badge',
            'is_active', 'sort_order'
        ]


class FamilySubscriptionSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    is_active_subscription = serializers.BooleanField(read_only=True)

    class Meta:
        model = FamilySubscription
        fields = [
            'id', 'family_id', 'plan', 'status', 'currency',
            'current_period_start', 'current_period_end',
            'cancel_at_period_end', 'days_remaining',
            'is_active_subscription', 'created_at', 'updated_at'
        ]
        read_only_fields = fields


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'amount', 'currency', 'status',
            'paid_at', 'due_date', 'billing_period_start',
            'billing_period_end', 'line_items', 'pdf_url', 'created_at'
        ]
        read_only_fields = fields
