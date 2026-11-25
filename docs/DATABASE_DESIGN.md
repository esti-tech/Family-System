# KinKeep Database Design & Schema Specification

## 1. Database Engine & Principles
- **Engine**: PostgreSQL 16
- **Architecture**: Multi-tenant relational schema with foreign key integrity and JSONB metadata flexibility.
- **UUID Primary Keys**: Every primary entity uses UUIDv4 to prevent enumeration attacks and simplify distributed replication.
- **Timestamp Auditing**: All models inherit from `common.models.TimeStampedModel` (`id`, `created_at`, `updated_at`, `is_active`).

---

## 2. Entity Relationship Overview

```
 [User] 1 <---> * [FamilyMembership] * <---> 1 [Family]
   ^                                               |
   |                                               | 1
   |                                               +---> * [Person] (Genealogy)
   |                                               |        |
   |                                               |        +---> * [ParentChildRelationship]
   |                                               |        +---> * [SpouseRelationship]
   |                                               |
   |                                               +---> * [Story] (Oral & Written)
   |                                               |
   |                                               +---> * [Event] (Invitations, RSVPs)
   |                                               |        |
   |                                               |        +---> * [EventGuest]
   |                                               |        +---> * [GuestUploadSession]
   |                                               |
   |                                               +---> * [MediaAsset] (Vault)
   |                                               |
   |                                               +---> * [Memory]
   |                                               |        |
   |                                               |        +---> * [Album]
   |                                               |
   |                                               +---> 1 [FamilySubscription]
   |                                                        |
   |                                                        +---> * [Invoice]
   |                                                        +---> * [PaymentTransaction]
   |
[Platform Staff] ---> [AuditLog] (Immutable)
                ---> [PlatformNotice]
                ---> [SupportTicket]
```

---

## 3. Core Relational Schemas

### 3.1 `apps.accounts` (User Accounts & Authentication)
- **`User`**:
  - `id`: UUID (PK)
  - `email`: VARCHAR(255) (Unique, Indexed)
  - `full_name`: VARCHAR(255)
  - `phone_number`: VARCHAR(32) (Optional)
  - `status`: VARCHAR(20) (`PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, `INACTIVE`)
  - `preferred_language`: VARCHAR(10) (`en`, `am`, `om`, `ti`)
  - `avatar_url`: VARCHAR(1024) (Optional)
  - `is_staff`: BOOLEAN (Platform administration access)
  - `is_superuser`: BOOLEAN
  - `last_login_ip`: INET (Optional)
- **`EmailVerificationToken`**:
  - `id`: UUID (PK)
  - `user`: FK(`User`, on_delete=CASCADE)
  - `token_hash`: VARCHAR(64) (SHA-256)
  - `expires_at`: TIMESTAMP WITH TIME ZONE
  - `is_used`: BOOLEAN
- **`PasswordResetToken`**:
  - `id`: UUID (PK)
  - `user`: FK(`User`, on_delete=CASCADE)
  - `token_hash`: VARCHAR(64) (SHA-256)
  - `expires_at`: TIMESTAMP WITH TIME ZONE
  - `is_used`: BOOLEAN

---

### 3.2 `apps.families` (Workspaces & RBAC)
- **`Family`**:
  - `id`: UUID (PK)
  - `name`: VARCHAR(255)
  - `slug`: VARCHAR(255) (Unique, Indexed)
  - `motto`: TEXT (Optional)
  - `cultural_origin`: VARCHAR(100) (e.g., "Ethiopian - Shewa", "Global")
  - `cover_image_url`: VARCHAR(1024) (Optional)
  - `status`: VARCHAR(20) (`ACTIVE`, `SUSPENDED`, `DELINQUENT`)
  - `settings`: JSONB (Default permissions, notification rules)
- **`FamilyMembership`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `user`: FK(`User`, on_delete=CASCADE)
  - `role`: VARCHAR(20) (`OWNER`, `ADMIN`, `EDITOR`, `REVIEWER`, `VIEWER`)
  - `joined_at`: TIMESTAMP WITH TIME ZONE
  - `is_active`: BOOLEAN
  - *Unique Constraint*: (`family`, `user`)
- **`FamilyInvitation`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `invited_by`: FK(`User`, on_delete=SET_NULL)
  - `invitee_email`: VARCHAR(255) (Indexed)
  - `role`: VARCHAR(20)
  - `token_hash`: VARCHAR(64) (SHA-256)
  - `status`: VARCHAR(20) (`PENDING`, `ACCEPTED`, `DECLINED`, `EXPIRED`)
  - `expires_at`: TIMESTAMP WITH TIME ZONE

---

### 3.3 `apps.genealogy` (Lineage Graph & Persons)
- **`Person`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `first_name`: VARCHAR(100)
  - `last_name`: VARCHAR(100)
  - `patronymic_name`: VARCHAR(100) (Ethiopian/Semitic tradition)
  - `gender`: VARCHAR(20) (`MALE`, `FEMALE`, `OTHER`, `UNKNOWN`)
  - `birth_date`: DATE (Optional)
  - `birth_date_is_approximate`: BOOLEAN
  - `birth_place`: VARCHAR(255) (Optional)
  - `is_living`: BOOLEAN
  - `death_date`: DATE (Optional)
  - `death_date_is_approximate`: BOOLEAN
  - `biography`: TEXT (Optional)
  - `avatar_asset`: FK(`MediaAsset`, on_delete=SET_NULL, Optional)
  - `linked_user`: FK(`User`, on_delete=SET_NULL, Optional, Unique within family)
- **`ParentChildRelationship`**:
  - `id`: UUID (PK)
  - `parent`: FK(`Person`, related_name='children_relationships', on_delete=CASCADE)
  - `child`: FK(`Person`, related_name='parent_relationships', on_delete=CASCADE)
  - `relationship_type`: VARCHAR(20) (`BIOLOGICAL`, `ADOPTIVE`, `FOSTER`, `STEP`)
  - *Unique Constraint*: (`parent`, `child`)
  - *Constraint*: `parent != child`
- **`SpouseRelationship`**:
  - `id`: UUID (PK)
  - `person_a`: FK(`Person`, related_name='partnerships_a', on_delete=CASCADE)
  - `person_b`: FK(`Person`, related_name='partnerships_b', on_delete=CASCADE)
  - `marriage_date`: DATE (Optional)
  - `marriage_place`: VARCHAR(255) (Optional)
  - `is_current`: BOOLEAN
  - *Unique Constraint*: (`person_a`, `person_b`)
- **`TreeChangeProposal`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `proposed_by`: FK(`User`, on_delete=CASCADE)
  - `proposed_change`: JSONB (Delta representation of nodes and edges)
  - `status`: VARCHAR(20) (`PENDING`, `APPROVED`, `REJECTED`)
  - `reviewed_by`: FK(`User`, on_delete=SET_NULL, Optional)

---

### 3.4 `apps.heritage` (Stories & Timelines)
- **`Story`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `author`: FK(`User`, on_delete=SET_NULL)
  - `title`: VARCHAR(255)
  - `content`: TEXT (Markdown / HTML)
  - `excerpt`: TEXT
  - `language`: VARCHAR(10) (`en`, `am`, `om`, `ti`)
  - `status`: VARCHAR(20) (`DRAFT`, `PUBLISHED`, `ARCHIVED`)
  - `approximate_year`: INTEGER (Optional)
  - `audio_recording`: FK(`MediaAsset`, on_delete=SET_NULL, Optional)
  - `tagged_persons`: M2M(`Person`, related_name='stories')
  - `media_assets`: M2M(`MediaAsset`, related_name='stories')
- **`Milestone`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `title`: VARCHAR(255)
  - `description`: TEXT
  - `date`: DATE
  - `is_approximate`: BOOLEAN
  - `category`: VARCHAR(50) (`MIGRATION`, `BIRTH`, `UNION`, `ACHIEVEMENT`, `COMMUNITY`)

---

### 3.5 `apps.events` (Events, RSVPs & Ephemeral QR Codes)
- **`Event`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `created_by`: FK(`User`, on_delete=SET_NULL)
  - `title`: VARCHAR(255)
  - `description`: TEXT
  - `category`: VARCHAR(30) (`WEDDING`, `BIRTHDAY`, `MEMORIAL`, `REUNION`, `HOLIDAY`, `OTHER`)
  - `start_time`: TIMESTAMP WITH TIME ZONE
  - `end_time`: TIMESTAMP WITH TIME ZONE
  - `location_name`: VARCHAR(255)
  - `is_virtual`: BOOLEAN
  - `virtual_link`: VARCHAR(1024) (Optional)
  - `qr_token_hash`: VARCHAR(64) (Indexed, SHA-256 of public intake secret)
  - `qr_enabled`: BOOLEAN (Default: True)
  - `qr_expires_at`: TIMESTAMP WITH TIME ZONE
  - `require_moderation_for_uploads`: BOOLEAN (Default: True)
- **`EventGuest`**:
  - `id`: UUID (PK)
  - `event`: FK(`Event`, on_delete=CASCADE)
  - `name`: VARCHAR(255)
  - `email`: VARCHAR(255) (Optional)
  - `rsvp_status`: VARCHAR(20) (`INVITED`, `ACCEPTED`, `DECLINED`, `TENTATIVE`)
  - `invited_at`: TIMESTAMP WITH TIME ZONE

---

### 3.6 `apps.media_storage` & `apps.memories` (Vault & Albums)
- **`MediaAsset`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `uploader`: FK(`User`, on_delete=SET_NULL, Optional)
  - `storage_key`: VARCHAR(512) (S3/MinIO bucket path)
  - `original_filename`: VARCHAR(255)
  - `mime_type`: VARCHAR(100)
  - `size_bytes`: BIGINT (Indexed for quota aggregations)
  - `status`: VARCHAR(20) (`PENDING_UPLOAD`, `READY`, `PROCESSING_FAILED`)
  - `metadata`: JSONB (EXIF data, duration, width, height)
- **`Memory`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `title`: VARCHAR(255)
  - `description`: TEXT
  - `primary_asset`: FK(`MediaAsset`, on_delete=PROTECT)
  - `event`: FK(`Event`, on_delete=SET_NULL, Optional)
  - `tagged_people`: M2M(`Person`, related_name='memories')
  - `status`: VARCHAR(20) (`PENDING_MODERATION`, `APPROVED`, `TRASHED`)
  - `is_favorite`: BOOLEAN
  - `taken_at`: TIMESTAMP WITH TIME ZONE (Optional)
- **`Album`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `title`: VARCHAR(255)
  - `description`: TEXT
  - `cover_asset`: FK(`MediaAsset`, on_delete=SET_NULL, Optional)
  - `memories`: M2M(`Memory`, related_name='albums')

---

### 3.7 `apps.subscriptions` & `apps.payments` (Billing & Invoices)
- **`Plan`**:
  - `id`: UUID (PK)
  - `name`: VARCHAR(100)
  - `code`: VARCHAR(50) (Unique, e.g., `FREE_HERITAGE`, `FAMILY_ROOTS`, `DYNASTY_LEGACY`)
  - `storage_quota_gb`: INTEGER
  - `max_members`: INTEGER
  - `price_etb_monthly`: DECIMAL(10, 2)
  - `price_etb_annual`: DECIMAL(10, 2)
  - `price_usd_monthly`: DECIMAL(10, 2)
  - `price_usd_annual`: DECIMAL(10, 2)
  - `features`: JSONB (Feature flags, AI audio transcription, HD video)
- **`FamilySubscription`**:
  - `id`: UUID (PK)
  - `family`: OneToOneField(`Family`, on_delete=CASCADE)
  - `plan`: FK(`Plan`, on_delete=PROTECT)
  - `billing_cycle`: VARCHAR(20) (`MONTHLY`, `ANNUAL`)
  - `status`: VARCHAR(20) (`ACTIVE`, `TRIALING`, `PAST_DUE`, `CANCELED`)
  - `current_period_start`: TIMESTAMP WITH TIME ZONE
  - `current_period_end`: TIMESTAMP WITH TIME ZONE
  - `storage_bytes_cached`: BIGINT (Updated periodically or on upload)
- **`Invoice`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `subscription`: FK(`FamilySubscription`, on_delete=SET_NULL, Optional)
  - `invoice_number`: VARCHAR(50) (Unique, Indexed)
  - `amount`: DECIMAL(10, 2)
  - `currency`: VARCHAR(10) (`ETB`, `USD`)
  - `status`: VARCHAR(20) (`PENDING`, `PAID`, `VOID`)
  - `line_items`: JSONB
- **`PaymentTransaction`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=CASCADE)
  - `invoice`: FK(`Invoice`, on_delete=SET_NULL, Optional)
  - `provider`: VARCHAR(30) (`CHAPA`, `TELEBIRR`, `STRIPE`)
  - `provider_transaction_id`: VARCHAR(255) (Indexed)
  - `idempotency_key`: VARCHAR(255) (Unique)
  - `amount`: DECIMAL(10, 2)
  - `currency`: VARCHAR(10)
  - `status`: VARCHAR(20) (`INITIATED`, `SUCCESSFUL`, `FAILED`)
  - `payload_response`: JSONB

---

### 3.8 `apps.audit`, `apps.support`, `apps.platform_admin`
- **`AuditLog`** (Immutable Append-Only):
  - `id`: UUID (PK)
  - `actor`: FK(`User`, on_delete=SET_NULL, Optional)
  - `actor_email`: VARCHAR(255)
  - `action`: VARCHAR(100) (Indexed)
  - `target_type`: VARCHAR(100) (Indexed)
  - `target_id`: VARCHAR(255) (Indexed)
  - `target_label`: VARCHAR(255)
  - `ip_address`: INET (Optional)
  - `user_agent`: TEXT (Optional)
  - `details`: JSONB
  - `created_at`: TIMESTAMP WITH TIME ZONE
- **`SupportTicket`**:
  - `id`: UUID (PK)
  - `family`: FK(`Family`, on_delete=SET_NULL, Optional)
  - `user`: FK(`User`, on_delete=CASCADE)
  - `ticket_number`: VARCHAR(50) (Unique)
  - `subject`: VARCHAR(255)
  - `category`: VARCHAR(50) (`BILLING`, `STORAGE`, `GENEALOGY`, `ACCOUNT`, `TECHNICAL`)
  - `priority`: VARCHAR(20) (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
  - `status`: VARCHAR(20) (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)
- **`SupportTicketMessage`**:
  - `id`: UUID (PK)
  - `ticket`: FK(`SupportTicket`, on_delete=CASCADE, related_name='messages')
  - `sender`: FK(`User`, on_delete=SET_NULL)
  - `message`: TEXT
  - `is_internal_note`: BOOLEAN (Platform staff only)
