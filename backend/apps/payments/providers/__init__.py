from typing import Dict, Type
from .base import BasePaymentProvider
from .chapa import ChapaPaymentProvider
from .telebirr import TelebirrPaymentProvider
from .stripe import StripePaymentProvider

PROVIDER_REGISTRY: Dict[str, Type[BasePaymentProvider]] = {
    'CHAPA': ChapaPaymentProvider,
    'TELEBIRR': TelebirrPaymentProvider,
    'STRIPE': StripePaymentProvider,
}


def get_payment_provider(provider_name: str) -> BasePaymentProvider:
    """Factory returning the configured provider adapter instance."""
    normalized = (provider_name or 'CHAPA').upper()
    provider_cls = PROVIDER_REGISTRY.get(normalized, ChapaPaymentProvider)
    return provider_cls()
