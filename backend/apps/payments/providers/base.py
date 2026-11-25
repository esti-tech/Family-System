from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple
from decimal import Decimal


class BasePaymentProvider(ABC):
    """
    Abstract interface for all KinKeep payment gateways (Telebirr, Chapa, Stripe).
    Guarantees consistent checkout generation, callback validation, and status verification.
    """

    @abstractmethod
    def initialize_transaction(
        self,
        reference: str,
        amount: Decimal,
        currency: str,
        customer_email: str,
        customer_name: str,
        return_url: str,
        callback_url: str,
        metadata: Dict[str, Any] = None,
    ) -> Dict[str, Any]:
        """
        Communicates with the provider to create a hosted checkout session or payment intent.
        Returns dict containing 'checkout_url' and 'provider_tx_id'.
        """
        pass

    @abstractmethod
    def verify_webhook_signature(
        self, payload_raw: bytes, headers: Dict[str, str]
    ) -> Tuple[bool, str]:
        """
        Validates cryptographic signatures (HMAC SHA-256 or RSA) to ensure
        the callback originates from the legitimate payment provider.
        """
        pass

    @abstractmethod
    def verify_transaction_status(self, reference: str, provider_tx_id: str = "") -> Tuple[bool, str, Dict[str, Any]]:
        """
        Performs an outbound server-to-server query to verify the definitive status of a payment.
        """
        pass
