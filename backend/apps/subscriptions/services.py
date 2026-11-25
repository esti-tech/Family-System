from decimal import Decimal
from typing import Dict, Any
from django.db.models import Sum, Count
from apps.families.models import Family
from apps.media_storage.models import MediaAsset
from apps.subscriptions.models import Plan, FamilySubscription


DEFAULT_STORAGE_LIMIT_BYTES = 5 * 1024 * 1024 * 1024 # 5 GB


def seed_default_plans():
    """
    Populates default subscription plans in PostgreSQL if not already present.
    """
    plans_data = [
        {
            "name": "Free Heritage",
            "slug": "free-heritage",
            "tagline": "Living memory preservation for small immediate households.",
            "description": "Essential genealogy tree, oral story recording, and photo memory archive.",
            "price_etb": Decimal('0.00'),
            "price_usd": Decimal('0.00'),
            "billing_interval": Plan.BillingInterval.MONTHLY,
            "storage_limit_bytes": 1 * 1024 * 1024 * 1024, # 1 GB
            "member_limit": 5,
            "badge": "Free Forever",
            "sort_order": 1,
            "features": {
                "genealogy_tree": True,
                "audio_recording": True,
                "qr_uploads": False,
                "high_res_export": False,
                "priority_support": False
            }
        },
        {
            "name": "Family Roots",
            "slug": "family-roots",
            "tagline": "Our most popular tier for extended Ethiopian families across the diaspora.",
            "description": "Unlimited event QR guest uploads, audio memoirs, 25GB storage, and full timeline continuum.",
            "price_etb": Decimal('350.00'),
            "price_usd": Decimal('5.00'),
            "billing_interval": Plan.BillingInterval.MONTHLY,
            "storage_limit_bytes": 25 * 1024 * 1024 * 1024, # 25 GB
            "member_limit": 25,
            "badge": "Most Popular",
            "sort_order": 2,
            "features": {
                "genealogy_tree": True,
                "audio_recording": True,
                "qr_uploads": True,
                "high_res_export": True,
                "priority_support": False
            }
        },
        {
            "name": "Dynasty Legacy",
            "slug": "dynasty-legacy",
            "tagline": "Full archival preservation for large clans and multi-generational lineages.",
            "description": "100GB vault storage, 100 members, 4K video streams, high-res heritage book exports.",
            "price_etb": Decimal('850.00'),
            "price_usd": Decimal('12.00'),
            "billing_interval": Plan.BillingInterval.MONTHLY,
            "storage_limit_bytes": 100 * 1024 * 1024 * 1024, # 100 GB
            "member_limit": 100,
            "badge": "Clan Archive",
            "sort_order": 3,
            "features": {
                "genealogy_tree": True,
                "audio_recording": True,
                "qr_uploads": True,
                "high_res_export": True,
                "priority_support": True
            }
        },
        {
            "name": "Ancestral Archive",
            "slug": "ancestral-archive",
            "tagline": "Enterprise institutional storage for historical houses and global family federations.",
            "description": "1TB storage capacity, 500 members, dedicated account manager, priority archiving.",
            "price_etb": Decimal('1800.00'),
            "price_usd": Decimal('25.00'),
            "billing_interval": Plan.BillingInterval.MONTHLY,
            "storage_limit_bytes": 1024 * 1024 * 1024 * 1024, # 1 TB
            "member_limit": 500,
            "badge": "Enterprise",
            "sort_order": 4,
            "features": {
                "genealogy_tree": True,
                "audio_recording": True,
                "qr_uploads": True,
                "high_res_export": True,
                "priority_support": True,
                "dedicated_archivist": True
            }
        }
    ]

    for p in plans_data:
        Plan.objects.update_or_create(slug=p['slug'], defaults=p)


def get_family_storage_summary(family: Family) -> Dict[str, Any]:
    """
    Computes real-time workspace storage usage, active member count, and plan entitlement limits.
    """
    # 1. Total bytes used in MediaAsset
    total_used_bytes = MediaAsset.objects.filter(
        family=family,
        processing_status=MediaAsset.ProcessingStatus.READY
    ).aggregate(total=Sum('file_size_bytes'))['total'] or 0

    # 2. Plan entitlements
    subscription = getattr(family, 'subscription', None)
    if subscription and subscription.is_active_subscription:
        plan = subscription.plan
        storage_limit_bytes = plan.storage_limit_bytes
        member_limit = plan.member_limit
        plan_name = plan.name
        plan_slug = plan.slug
        status = subscription.status
        days_remaining = subscription.days_remaining
        features = plan.features
    else:
        # Default fallback to Free Heritage or default limit
        free_plan = Plan.objects.filter(slug='free-heritage').first()
        storage_limit_bytes = free_plan.storage_limit_bytes if free_plan else DEFAULT_STORAGE_LIMIT_BYTES
        member_limit = free_plan.member_limit if free_plan else 5
        plan_name = free_plan.name if free_plan else "Free Heritage"
        plan_slug = free_plan.slug if free_plan else "free-heritage"
        status = "ACTIVE"
        days_remaining = 365
        features = free_plan.features if free_plan else {}

    # 3. Usage percentage
    usage_percent = round((total_used_bytes / max(storage_limit_bytes, 1)) * 100, 2)
    is_storage_full = total_used_bytes >= storage_limit_bytes

    # 4. Breakdown by media type
    media_breakdown = MediaAsset.objects.filter(
        family=family,
        processing_status=MediaAsset.ProcessingStatus.READY
    ).values('media_type').annotate(
        count=Count('id'),
        size=Sum('file_size_bytes')
    )

    type_summary = {
        "IMAGE": {"count": 0, "size_bytes": 0},
        "VIDEO": {"count": 0, "size_bytes": 0},
        "AUDIO": {"count": 0, "size_bytes": 0},
        "DOCUMENT": {"count": 0, "size_bytes": 0},
    }
    for item in media_breakdown:
        mtype = item['media_type']
        if mtype in type_summary:
            type_summary[mtype] = {
                "count": item['count'],
                "size_bytes": item['size'] or 0
            }

    # 5. Member count
    active_members_count = family.memberships.filter(status='ACTIVE').count()

    return {
        "plan_name": plan_name,
        "plan_slug": plan_slug,
        "status": status,
        "days_remaining": days_remaining,
        "storage_used_bytes": total_used_bytes,
        "storage_used_gb": round(total_used_bytes / (1024 * 1024 * 1024), 2),
        "storage_limit_bytes": storage_limit_bytes,
        "storage_limit_gb": round(storage_limit_bytes / (1024 * 1024 * 1024), 1),
        "usage_percentage": min(usage_percent, 100.0),
        "is_storage_full": is_storage_full,
        "active_members_count": active_members_count,
        "member_limit": member_limit,
        "is_member_limit_reached": active_members_count >= member_limit,
        "media_breakdown": type_summary,
        "features": features
    }
