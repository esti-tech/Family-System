# KinKeep Changelog

All notable changes to the KinKeep platform are documented in this file.

## [v1.0.0] - Production Readiness & System Completion (Stage 9)
### Completed
- **Full System Review & Verification**: Complete review of all 62 specified Figma screens, Next.js page navigation, mobile responsiveness, empty states, and validation states.
- **Unified Master Branch**: Merged and consolidated all features from Stages 1 through 8 into `main`.
- **Comprehensive Documentation Suite**:
  - `docs/ARCHITECTURE.md`: Complete system architecture, tenancy model, RBAC, DAG cycle detection, and security boundaries.
  - `docs/DATABASE_DESIGN.md`: Detailed PostgreSQL schemas, foreign keys, JSONB fields, indexes, and constraints.
  - `docs/API_DOCUMENTATION.md`: Full REST API reference for all endpoints under `/api/v1/`.
  - `docs/DEPLOYMENT_GUIDE.md`: Containerized production deployment, Nginx reverse proxy, S3/MinIO vault setup, and security checklist.
  - `docs/TESTING_AND_VERIFICATION.md`: Verification methodology, automated test coverage report (**64/64 tests green**), and multi-tenant security verification.

---

## [Phase 8B] - Platform Super Admin Panel
### Added
- Super Admin console: Dashboard, User Management, Workspace Directory, Platform Settings, Audit Logs Explorer, and Helpdesk.
- Models: `apps.audit.models.AuditLog`, `apps.platform_admin.models.PlatformNotice`, `apps.platform_admin.models.PlatformSetting`, `apps.support.models.SupportTicket`, `SupportTicketMessage`.
- Permissions: `IsPlatformSuperAdmin` enforcing strict privacy wall separating platform operations from private family content.
- Immutable append-only audit logging service (`log_audit_event`).
- Real-time aggregate platform metrics (no fabricated analytics).

---

## [Phase 8A] - Subscriptions, Payments & Storage Quotas
### Added
- Dynamic subscription tiers: `Free Heritage` (1GB), `Family Roots` (25GB), `Dynasty Legacy` (100GB), and `Ancestral Archive` (1TB).
- Payment provider abstraction (`BasePaymentProvider`) with concrete adapters for **Chapa**, **Telebirr**, and **Stripe**.
- Server-side cryptographic webhook validation (HMAC SHA-256 for Chapa, RSA for Telebirr, Stripe signatures).
- Storage quota calculation and real-time usage summary service.
- Next.js billing pages: Plans, Invoices, Telebirr/Card Checkout, and Storage Breakdown.

---

## [Phase 7B, 7C, 7D] - Events, Media Vault, Memories & Secure QR Guest Uploads
### Added
- Events management: Category support (Weddings, Birthdays, Reunions, Memorials), scheduling, and guest RSVP tracking.
- Ephemeral QR guest upload portal: Cryptographic token generation, SHA-256 token hashing, temporary guest sessions, and mobile-first intake screen.
- Private media vault: Presigned MinIO/S3 direct upload architecture, quota validation, and secure time-limited presigned viewing URLs.
- Memories & Albums: Multi-person tagging, event linking, non-duplicating album organization, and guest upload moderation queue.

---

## [Phase 7A] - Heritage, Oral Stories & Timelines
### Added
- Living family stories supporting written text and recorded voice narratives.
- Multilingual story support (Amharic, Oromo, Tigrinya, English).
- Milestone and timeline engine with approximate date resolution and historical categories.

---

## [Phase 6] - Living Genealogy Engine & Heritage Graph
### Added
- Independent `Person` records decoupled from registered `User` accounts.
- Lineage Directed Acyclic Graph (DAG) with depth-first search (DFS) cycle prevention.
- Dynamic kinship calculation engine using bidirectional Lowest Common Ancestor (LCA) traversal.
- Tree change proposals queue for collaborative tree modifications.
- React Flow interactive family tree canvas, person profiles, and relationship management.

---

## [Phase 5] - Family Workspaces & Multi-Tenancy RBAC
### Added
- Workspace creation, slug generation, cultural origin metadata, and cover photos.
- 5 configurable workspace roles: `Family Owner`, `Family Administrator`, `Family Editor`, `Family Reviewer`, `Family Viewer`.
- Tenant isolation enforced across every Django query and mutation.
- Member invitations, token generation, acceptance, and decline flows.

---

## [Phase 4] - Authentication & Identity Management
### Added
- User registration, login, logout, password hashing (PBKDF2 SHA-256), and JWT session lifecycle with token rotation.
- Cryptographic email verification and password reset workflows.
- Rate limiting for sensitive authentication endpoints.
- User profile management and language preferences.

---

## [Phase 1-3] - Foundation & UI Design System
### Added
- Full 62-page responsive Next.js frontend matching Figma designs with warm Ethiopian cultural heritage motifs.
- Docker Compose configuration for PostgreSQL 16, Redis 7, and MinIO.
