# KinKeep: Project Overview & Core Tenets

KinKeep is a modern, responsive, multi-tenant digital family heritage and generational memory preservation platform. Designed with cultural depth tailored for Ethiopian and East African diaspora and homeland traditions, KinKeep allows families to build private digital archives that outlive generations.

## Core Strategic Invariants

1. **Separation of Users vs. Persons**:
   - A `User` is an authenticating login identity.
   - A `Person` is a human represented in a family tree.
   - Most persons in a family tree (ancestors, infants, living relatives who do not use the app) will never have a login account.
   - Linking a `User` to a `Person` occurs via a dedicated, permission-controlled bridge table (`person_account_links`).

2. **Strict Multi-Tenant Isolation**:
   - Every workspace resource is bounded by `family_id`.
   - Django ORM selectors automatically filter queries by the authenticated user's active family membership.
   - Cross-tenant data leakage is prevented at the database and application layers.

3. **Zero Binary Storage in PostgreSQL**:
   - PostgreSQL stores only structured metadata, SHA-256 hashes, and storage keys.
   - Media binaries are uploaded directly to MinIO (local) / S3 (production) using single-use presigned PUT URLs.
   - Private media is accessed only via short-lived (10-minute) presigned GET URLs after verifying active family membership.

4. **Graph-Derived Kinship**:
   - Direct parent-child and partner relationships are stored as foundational edges.
   - Extended kinship labels (cousins, aunts, uncles, grandparents) are computed dynamically relative to the viewer's position in the graph.
   - Mathematical acyclicity validation prevents parent-child loops (a child cannot be an ancestor of their parent).

5. **Zero-Auth Ephemeral Guest Uploads**:
   - Event attendees can scan an expiring QR code to upload photos and audio memories without creating a user account or gaining read access to private family workspace archives.

6. **Dedicated Super Admin Operations Console**:
   - Platform administration is segregated from family workspaces. Super Admins manage subscriptions, storage quotas, and platform users without browsing private family trees or memories.
