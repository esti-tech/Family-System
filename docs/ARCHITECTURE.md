# KinKeep System Architecture & Design Specification

## 1. System Overview & Vision
KinKeep is a modern, secure, multi-tenant digital family heritage, living genealogy, and generative memory preservation platform. Designed with cultural warmth—particularly tailored for Ethiopian, East African, and diaspora traditions as well as global families—KinKeep provides multi-generational lineage tracking, rich oral and written storytelling, media vault preservation, private event orchestration, and platform governance.

---

## 2. High-Level Architectural Diagram

```
+----------------------------------------------------------------------------------------------------+
|                                         CLIENT TIERS                                               |
|                                                                                                    |
|    +-----------------------------+      +-------------------------------+                          |
|    | Next.js App Router Frontend |      | Mobile QR Guest Upload Portal |                          |
|    | (TypeScript, React Flow)    |      | (Zero-Auth Ephemeral Session) |                          |
|    +-----------------------------+      +-------------------------------+                          |
+-----------------------------------|----------------------------------------------------------------+
                                    | HTTPS / JSON API (/api/v1/)
                                    v
+----------------------------------------------------------------------------------------------------+
|                                    APPLICATION GATEWAY                                             |
|                                                                                                    |
|                             Reverse Proxy / SSL / CORS / Rate Limiter                              |
+----------------------------------------------------------------------------------------------------+
                                    |
                                    v
+----------------------------------------------------------------------------------------------------+
|                                    BACKEND SERVICES (DJANGO / DRF)                                 |
|                                                                                                    |
|  +------------------+  +------------------+  +------------------+  +------------------+            |
|  |  apps.accounts   |  |  apps.families   |  |  apps.genealogy  |  |  apps.heritage   |            |
|  |  - Auth & JWT    |  |  - Workspaces    |  |  - DAG Graph     |  |  - Oral Stories  |            |
|  |  - Profiles      |  |  - RBAC Engine   |  |  - Kinship Calc  |  |  - Milestones    |            |
|  +------------------+  +------------------+  +------------------+  +------------------+            |
|                                                                                                    |
|  +------------------+  +------------------+  +------------------+  +------------------+            |
|  |   apps.events    |  |  apps.memories   |  |  apps.payments   |  |apps.platform_adm |            |
|  |  - RSVP & QR Gen |  |  - Vault & Albums|  |  - Chapa/Telebirr|  |  - Governance    |            |
|  |  - Moderation    |  |  - Quotas        |  |  - Subscriptions |  |  - Immutable Log |            |
|  +------------------+  +------------------+  +------------------+  +------------------+            |
+----------------------------------------------------------------------------------------------------+
             |                                 |                               |
             v                                 v                               v
+------------------------+      +-----------------------------+      +-------------------------------+
|      PostgreSQL 16     |      |       Redis & Celery        |      |      MinIO / Amazon S3        |
| Relational Entities &  |      |   Async tasks, rate limit   |      | Private Object Vault,         |
| JSONB Metadata         |      |   token buckets & caching   |      | Presigned Direct Uploads      |
+------------------------+      +-----------------------------+      +-------------------------------+
```

---

## 3. Core Architectural Subsystems

### 3.1 Multi-Tenancy & Family Workspace Isolation
1. **Tenant Separation**: Every primary resource (`Person`, `Story`, `Event`, `Memory`, `Album`, `FamilySubscription`) has a foreign key to `Family`.
2. **Strict Query & Mutation Guardrails**:
   - The frontend supplies `family_slug` or `family_id`.
   - The backend `FamilyAccessPermission` independently verifies that `request.user` possesses an active `FamilyMembership` within that target family.
   - Cross-tenant data leaks are mathematically impossible: Django querysets enforce `queryset.filter(family=family)`.

### 3.2 Role-Based Access Control (RBAC) Matrix
| Permission / Capability | Family Owner | Family Admin | Family Editor | Family Reviewer | Family Viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| Delete Workspace | **Yes** | No | No | No | No |
| Manage Subscriptions & Billing | **Yes** | **Yes** | No | No | No |
| Invite / Remove Members | **Yes** | **Yes** | No | No | No |
| Edit Roles & Permissions | **Yes** | **Yes** | No | No | No |
| Moderate Pending Uploads | **Yes** | **Yes** | **Yes** | **Yes** | No |
| Create / Edit Trees & Memories | **Yes** | **Yes** | **Yes** | No | No |
| View Published Trees & Vault | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |

### 3.3 Genealogy Engine & Lineage Directed Acyclic Graph (DAG)
1. **Separation of Concerns**: `Person` nodes exist independently of `User` accounts. A family tree may contain deceased ancestors from 1850 who never created digital accounts.
2. **Cycle Prevention**: Parent-child links represent a directed acyclic graph. Before saving any `ParentChildRelationship`, the backend executes depth-first cycle detection:
   $$\text{HasCycle}(Parent, Child) \iff Child \in \text{Ancestors}(Parent)$$
   If an ancestor is detected as a descendant, the mutation is immediately aborted with `HTTP 400 CYCLE_DETECTED`.
3. **Dynamic Kinship Calculation**:
   - Graph traversal (Bidirectional BFS) identifies Lowest Common Ancestors (LCA).
   - Generational degree ($d_1, d_2$) maps dynamically to linguistic and cultural kinship terms (e.g., Parent, First Cousin Once Removed, Great Uncle).

### 3.4 Media Vault & Private S3/MinIO Architecture
1. **Presigned Direct Uploads**:
   - Client requests upload permission with filename, MIME type, and file size in bytes.
   - Backend verifies family subscription storage quota:
     $$\text{UsedBytes} + \text{IncomingBytes} \le \text{QuotaBytes}$$
   - Backend issues a time-limited AWS S3 / MinIO presigned `PUT` URL.
   - Client streams the binary directly to private storage. The web server never proxies heavy media payloads.
2. **Complete & Verification**:
   - Client notifies backend upon upload completion.
   - Backend verifies binary presence, registers the `MediaAsset`, and marks the asset `READY`.
3. **Private Access Control**:
   - Media buckets are strictly private (no public read policy).
   - Reading media requires authenticated presigned `GET` URLs (15-minute expiration) generated only after validating the requester's active family membership.

### 3.5 Zero-Auth Ephemeral QR Guest Uploads
1. **Cryptographic Tokens**: Event organizers generate event QR codes containing a random 256-bit token.
2. **Hashed Storage**: Only the SHA-256 hash of the token is stored in the database (`qr_token_hash`).
3. **Ephemeral Guest Session**:
   - Guest scans QR code, opening a mobile-first upload screen without creating an account.
   - Backend issues an ephemeral session token (valid for event window only).
   - Guest uploads media into a quarantine state (`PENDING_MODERATION`).
   - Family editors review and approve guest uploads before they become visible in the family vault.
   - Guests have zero read access to existing family memories or tree data.

### 3.6 Multi-Gateway Billing & Quota Accounting
1. **Dynamic Plan Storage**: Plans are stored in PostgreSQL with dynamic storage limits (GB), member caps, and feature flags.
2. **Provider Abstraction**: Unified interface `BasePaymentProvider` supports:
   - **Chapa**: Ethiopian payment gateway supporting CBEBirr, Telebirr, and debit cards. Verified via HMAC SHA-256 webhook signatures.
   - **Telebirr**: Direct mobile money H5 integration with RSA signature validation.
   - **Stripe**: International card payments and subscriptions.
3. **Server-Side Verification**: Subscriptions are never activated by frontend claims; activation occurs exclusively upon verified webhook receipts or provider polling.

### 3.7 Platform Super Admin Governance & Privacy Wall
1. **Strict Separation**: Platform Super Admins (`is_staff=True`) govern business operations, subscription health, workspace statuses, and security holds.
2. **Privacy Wall**: Super Admin endpoints strictly exclude private family tree nodes, biographies, oral recordings, and media binaries.
3. **Audit Trail**: Every state mutation performed by an administrator produces an immutable row in `apps.audit.models.AuditLog`.
