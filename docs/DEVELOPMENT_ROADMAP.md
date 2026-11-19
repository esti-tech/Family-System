# KinKeep: Development Roadmap & Milestones

The KinKeep platform is being developed in 9 distinct, testable phases:

| Phase | Title | Core Deliverables | Verification Criteria |
|:---:|:---|:---|:---|
| **Phase 1** | **Foundation & Auth** | Docker Compose (Postgres, Redis, MinIO), Django scaffold, Next.js App Router setup, JWT auth + revocable sessions, API documentation, Auth pages 01–06. | Auth unit tests passing, token rotation verified, UI responsive. |
| **Phase 2** | **Workspace Tenancy & RBAC** | `families`, `family_memberships`, RBAC permission engine, tenant middleware, workspace switcher, invitation flows (Pages 07–17). | Negative tests proving User A cannot read Family B workspace. |
| **Phase 3** | **Genealogy & Kinship Graph** | `persons`, `parent_child_relationships`, `partner_relationships`, DFS cycle detection, React Flow custom node visualization (Pages 18–23). | Graph traversal tests, acyclicity assertion tests, UI tree render. |
| **Phase 4** | **Heritage & Timelines** | `stories`, `timeline_events`, Markdown editor, audio oral history player, person tagging (Pages 24–28). | Story creation & person linking integration tests. |
| **Phase 5** | **Events & RSVPs** | `events`, `event_guests`, RSVP workflow, calendar views, QR code issuance (Pages 29–36). | Event scheduling & guest RSVP acceptance tests. |
| **Phase 6** | **Media Storage & Zero-Auth QR** | MinIO signed URLs, `media_files`, `memories`, `albums`, `event_qr_tokens`, zero-auth guest mobile upload screen (Pages 37–45). | File checksum deduplication tests, guest upload rate-limiting tests. |
| **Phase 7** | **Subscriptions & Payments** | `plans`, `subscriptions`, `storage_usage` counter, Chapa/Telebirr gateway adapters with webhook signature verification (Pages 46–50). | Quota rejection tests, mock payment callback idempotency test. |
| **Phase 8** | **Super Admin Console** | Platform admin metrics dashboard, user suspension, workspace freeze, audit log search (Pages 51–62). | Super Admin permission guard tests (non-admin access denied). |
| **Phase 9** | **Testing & Production Polish** | Nginx reverse proxy config, PostgreSQL backup scripts, responsive QA, Lighthouse 90+ score. | 100% passing automated test suite. |
