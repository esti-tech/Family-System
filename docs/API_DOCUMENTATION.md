# KinKeep REST API Specification (v1)

Base URL: `http://localhost:8000/api/v1/`  
OpenAPI / Swagger Interactive Documentation: `http://localhost:8000/api/schema/swagger-ui/`

---

## 1. Authentication & Accounts (`/api/v1/auth/`)

| Endpoint | Method | Auth Required | Description |
|---|:---:|:---:|---|
| `/auth/register/` | `POST` | No | Register new user account; sends verification email |
| `/auth/login/` | `POST` | No | Authenticate user; returns JWT access/refresh token pair |
| `/auth/refresh/` | `POST` | No | Rotate refresh token; returns fresh access token |
| `/auth/logout/` | `POST` | Yes | Blacklist refresh token; invalidate session |
| `/auth/verify-email/` | `POST` | No | Verify user email address with cryptographic token |
| `/auth/forgot-password/` | `POST` | No | Request password reset token via email |
| `/auth/reset-password/` | `POST` | No | Reset password with token hash verification |
| `/auth/me/` | `GET` | Yes | Retrieve current user profile and memberships |
| `/auth/me/` | `PATCH` | Yes | Update profile name, phone, language, avatar |

---

## 2. Family Workspaces & RBAC (`/api/v1/families/`)

| Endpoint | Method | Auth Required | Description |
|---|:---:|:---:|---|
| `/families/` | `GET` | Yes | List workspaces user belongs to |
| `/families/` | `POST` | Yes | Create new family workspace (assigns creator `OWNER`) |
| `/families/<slug>/` | `GET` | Yes | Retrieve family details, cover photo, settings |
| `/families/<slug>/` | `PATCH` | Yes | Update family details (Owner / Admin only) |
| `/families/<slug>/members/` | `GET` | Yes | List members and their assigned roles |
| `/families/<slug>/members/<membership_id>/` | `PATCH` | Yes | Update member role (Owner / Admin only) |
| `/families/<slug>/members/<membership_id>/` | `DELETE` | Yes | Remove member from family (Owner / Admin only) |
| `/families/<slug>/invitations/` | `POST` | Yes | Send invitation email to join family |
| `/invitations/<token>/` | `GET` | No | Inspect invitation details |
| `/invitations/<token>/accept/` | `POST` | Yes | Accept invitation and join workspace |
| `/invitations/<token>/decline/` | `POST` | Yes | Decline invitation |

---

## 3. Genealogy & Living Family Tree (`/api/v1/families/<slug>/tree/`)

| Endpoint | Method | Auth Required | Description |
|---|:---:|:---:|---|
| `/tree/` | `GET` | Yes | Retrieve complete family tree graph (nodes & edges) |
| `/tree/people/` | `GET` | Yes | Search, filter, and paginate family persons |
| `/tree/people/` | `POST` | Yes | Create new person profile (Editor+) |
| `/tree/people/<person_id>/` | `GET` | Yes | Person biography, dates, relationships |
| `/tree/people/<person_id>/` | `PATCH` | Yes | Update person biography and details (Editor+) |
| `/tree/people/<person_id>/` | `DELETE`| Yes | Remove person from tree (Admin+) |
| `/tree/relationships/parent-child/` | `POST` | Yes | Connect parent and child with DAG cycle detection |
| `/tree/relationships/parent-child/<id>/` | `DELETE`| Yes | Remove parent-child relationship |
| `/tree/relationships/spouse/` | `POST` | Yes | Connect marriage / partner relationship |
| `/tree/relationships/spouse/<id>/` | `DELETE`| Yes | Remove partner relationship |
| `/tree/kinship/` | `GET` | Yes | Calculate dynamic kinship between two persons |
| `/tree/proposals/` | `GET`, `POST`| Yes | List or submit tree change proposals |
| `/tree/proposals/<id>/review/` | `POST` | Yes | Approve or reject tree change proposal |

---

## 4. Heritage, Stories & Timelines (`/api/v1/families/<slug>/`)

| Endpoint | Method | Auth Required | Description |
|---|:---:|:---:|---|
| `/stories/` | `GET` | Yes | List family stories (published & drafts) |
| `/stories/` | `POST` | Yes | Create oral or written story (Editor+) |
| `/stories/<id>/` | `GET` | Yes | Story details, linked audio, tagged persons |
| `/stories/<id>/` | `PATCH` | Yes | Edit story or publish draft (Author/Admin) |
| `/stories/<id>/` | `DELETE` | Yes | Archive story |
| `/milestones/` | `GET` | Yes | Retrieve chronological family milestone timeline |
| `/milestones/` | `POST` | Yes | Add historical family milestone |

---

## 5. Events & Guest Management (`/api/v1/families/<slug>/events/`)

| Endpoint | Method | Auth Required | Description |
|---|:---:|:---:|---|
| `/events/` | `GET`, `POST`| Yes | List or create family events (Weddings, Reunions) |
| `/events/<id>/` | `GET`, `PATCH`| Yes | Event details, schedule, location, settings |
| `/events/<id>/guests/` | `GET`, `POST`| Yes | Guest list management and RSVP tracking |
| `/events/<id>/qr/` | `GET`, `POST`| Yes | Retrieve or regenerate event QR intake token |

---

## 6. Zero-Auth Public QR Guest Intake (`/api/v1/public/events/`)

| Endpoint | Method | Auth Required | Description |
|---|:---:|:---:|---|
| `/public/events/qr/<token>/inspect/` | `GET` | **No** | Verify QR validity, returns event name & dates |
| `/public/events/qr/<token>/session/` | `POST` | **No** | Generate ephemeral guest upload session token |
| `/public/events/qr/upload/` | `POST` | **No (Session)** | Upload guest media directly into moderation queue |

---

## 7. Media Vault, Memories & Albums (`/api/v1/families/<slug>/`)

| Endpoint | Method | Auth Required | Description |
|---|:---:|:---:|---|
| `/media/presigned-upload/` | `POST` | Yes | Request presigned S3/MinIO upload URL with quota check |
| `/media/confirm/` | `POST` | Yes | Confirm binary upload completion & verify storage |
| `/memories/` | `GET`, `POST`| Yes | List family memories or create memory |
| `/memories/<id>/` | `GET`, `PATCH`| Yes | Retrieve memory, update caption, tag people |
| `/memories/<id>/trash/` | `POST` | Yes | Move memory to trash |
| `/memories/moderation/` | `GET` | Yes | List pending guest and member uploads (Reviewer+) |
| `/memories/<id>/moderate/` | `POST` | Yes | Approve or reject pending memory |
| `/albums/` | `GET`, `POST`| Yes | List or create family albums |
| `/albums/<id>/` | `GET`, `PATCH`| Yes | Album details and memory collection |
| `/albums/<id>/memories/` | `POST` | Yes | Add existing memories to album without duplicating files |

---

## 8. Subscriptions, Payments & Quotas (`/api/v1/families/<slug>/billing/`)

| Endpoint | Method | Auth Required | Description |
|---|:---:|:---:|---|
| `/billing/plans/` | `GET` | Yes | List available subscription tiers and feature flags |
| `/billing/summary/` | `GET` | Yes | Current storage consumed (bytes/GB), quota, plan status |
| `/billing/checkout/` | `POST` | Yes | Initiate checkout (Chapa, Telebirr, Stripe) |
| `/billing/invoices/` | `GET` | Yes | Retrieve family billing ledger and invoices |
| `/payments/webhook/<provider>/` | `POST` | No (HMAC/Sig)| Process payment callback from gateway |

---

## 9. Platform Super Admin (`/api/v1/platform-admin/`)

*Requires `is_staff=True` or `is_superuser=True`. Excludes private family archives.*

| Endpoint | Method | Auth Required | Description |
|---|:---:|:---:|---|
| `/dashboard/` | `GET` | SuperAdmin | Aggregate KPIs, platform storage, revenue totals |
| `/users/` | `GET` | SuperAdmin | Paginated user management table |
| `/users/<id>/suspend/` | `POST` | SuperAdmin | Suspend account (Audited) |
| `/users/<id>/activate/` | `POST` | SuperAdmin | Reactivate account (Audited) |
| `/workspaces/` | `GET` | SuperAdmin | Workspace inventory and storage health |
| `/workspaces/<id>/status/`| `POST` | SuperAdmin | Freeze or activate workspace (Audited) |
| `/audit-logs/` | `GET` | SuperAdmin | Immutable administrative audit log explorer |
| `/support-tickets/` | `GET` | SuperAdmin | Platform support ticket triage queue |
| `/support-tickets/<id>/` | `GET`, `POST`| SuperAdmin | Support ticket thread and staff reply |
| `/settings/` | `GET`, `POST`| SuperAdmin | Platform operational parameters (Audited) |
