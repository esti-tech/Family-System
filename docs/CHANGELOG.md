# KinKeep Changelog

All notable changes to the KinKeep platform will be documented in this file.

## [Unreleased] - Phase 2: Family Workspace, Multi-Tenancy & RBAC
### Added
- Git feature branch `feature/02-family-workspace-and-rbac`.
- Models: `Family`, `FamilyRole`, `Permission`, `RolePermission`, `FamilyMembership`, `FamilyInvitation`.
- Tenant permissions and isolation services (`IsFamilyMember`, `IsFamilyAdmin`, `IsFamilyOwner`).
- Seed logic for 5 core system roles (`FAMILY_OWNER`, `FAMILY_ADMIN`, `FAMILY_EDITOR`, `FAMILY_REVIEWER`, `FAMILY_VIEWER`).
- Invitation token generation and secure acceptance flow.
- 11 unit tests covering authentication, multi-tenant isolation, and RBAC permissions.
- Next.js Workspace Shell (`WorkspaceSidebar`, `WorkspaceTopBar`) and Pages 07 to 17:
  - Page 07: Family Selection (`/families`)
  - Page 08: Create Family (`/families/new`)
  - Page 09: Join Family (`/families/join`)
  - Page 10: Invitation Acceptance (`/invitations/[token]`)
  - Page 11: Family Workspace Dashboard (`/[familySlug]/dashboard`)
  - Page 12: Family Members Directory (`/[familySlug]/members`)
  - Page 13: Invite Family Member (`/[familySlug]/members/invite`)
  - Page 14: Member Permissions Editor (`/[familySlug]/members/[id]/permissions`)
  - Page 15: Family Settings (`/[familySlug]/settings`)
  - Page 16: User Profile (`/profile`)
  - Page 17: Notifications (`/[familySlug]/notifications`)

## [Phase 1] - Foundation & Authentication
### Added
- Git feature branch `feature/01-foundation-and-auth`.
- Root project structure, `.gitignore`, `.env.example`, and `docker-compose.yml` for PostgreSQL 16, Redis 7, and MinIO.
- Engineering documentation suite in `/docs`.
- Django backend layout with `apps/common` and `apps/accounts`.
- Next.js 14/15 App Router frontend scaffold with Tailwind CSS and KinKeep design tokens.
