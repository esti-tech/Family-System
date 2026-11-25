from rest_framework import serializers
from apps.payments.models import PaymentTransaction


class CheckoutInitiateSerializer(serializers.Serializer):
    plan_slug = serializers.CharField(required=True)
    provider = serializers.ChoiceField(
        choices=PaymentTransaction.PaymentProvider.choices,
        default=PaymentTransaction.PaymentProvider.CHAPA
    )
    return_url = serializers.CharField(required=False, allow_blank=True, default='')
    cancel_url = serializers.CharField(required=False, allow_blank=True, default='')


class PaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'reference', 'provider', 'provider_tx_id', 'amount',
            'currency', 'status', 'payment_method_type', 'checkout_url',
            'completed_at', 'error_message', 'created_at'
        ]
        read_only_fields = fields
