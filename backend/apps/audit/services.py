from typing import Any, Dict
from apps.audit.models import AuditLog


def log_audit_event(
    action: str,
    target_type: str,
    target_id: str,
    target_label: str = '',
    actor: Any = None,
    details: Dict[str, Any] = None,
    request: Any = None
) -> AuditLog:
    """
    Creates an immutable audit log record for security, administrative oversight, and SOC2 compliance.
    """
    actor_user = None
    actor_email = 'system@kinkeep.family'

    if actor and hasattr(actor, 'is_authenticated') and actor.is_authenticated:
        actor_user = actor
        actor_email = getattr(actor, 'email', '')
    elif request and hasattr(request, 'user') and request.user.is_authenticated:
        actor_user = request.user
        actor_email = getattr(request.user, 'email', '')

    ip_address = None
    user_agent = ''
    if request:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0].strip()
        else:
            ip_address = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]

    return AuditLog.objects.create(
        actor=actor_user,
        actor_email=actor_email,
        action=action,
        target_type=target_type,
        target_id=str(target_id),
        target_label=target_label,
        ip_address=ip_address,
        user_agent=user_agent,
        details=details or {}
    )
