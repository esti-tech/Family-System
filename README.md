# KinKeep — Digital Family Heritage & Memory Preservation Platform

KinKeep is a secure, multi-tenant family heritage and memory preservation platform designed to preserve multi-generational family trees, biographical stories, historical timelines, family events, and curated multimedia collections with cultural warmth, particularly tailored for Ethiopian and East African diaspora and homeland traditions.

---

## 🛠 Technology Stack

- **Frontend**: Next.js 14/15 App Router, React, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, React Flow, Recharts.
- **Backend**: Python 3.12+, Django 5.x, Django REST Framework, Celery, Redis.
- **Database**: PostgreSQL 16 (Hybrid relational schema with JSONB metadata).
- **Object Storage**: MinIO (local dev) / S3-compatible private object storage (production).
- **Infrastructure**: Docker & Docker Compose, Nginx.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Docker & Docker Compose
- Node.js (v18+) & npm
- Python (v3.12+)

### 2. Start Supporting Infrastructure
```bash
# Launch PostgreSQL, Redis, and MinIO in the background
docker compose up -d
```
MinIO console will be accessible at: `http://localhost:9001` (Credentials in `.env.example`).

### 3. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```
Interactive API docs (Swagger/OpenAPI): `http://localhost:8000/api/schema/swagger-ui/`

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
KinKeep application will be accessible at: `http://localhost:3000`

---

## 📂 Project Architecture

```
Family-System/
├── backend/                   # Django REST Framework modular backend
│   ├── apps/
│   │   ├── accounts/          # User authentication, profiles, session tokens
│   │   ├── common/            # Base models, custom handlers, standardized errors
│   │   ├── families/          # Multi-tenant workspace and RBAC
│   │   ├── genealogy/         # Lineage graph, persons, relationship engine
│   │   ├── heritage/          # Stories and historical milestones
│   │   ├── events/            # Family events, invitations & RSVPs
│   │   ├── media_storage/     # MinIO/S3 presigned upload & metadata registry
│   │   ├── memories/          # Memories, albums, moderation
│   │   ├── guest_uploads/     # Zero-auth QR intake
│   │   ├── subscriptions/     # Plans, billing, storage quota accounting
│   │   ├── payments/          # Payment gateway adapters (Chapa, Telebirr)
│   │   ├── notifications/     # In-app and email notifications
│   │   ├── support/           # Helpdesk and ticketing
│   │   ├── audit/             # Immutable audit logging
│   │   └── platform_admin/    # Super Admin console services
│   └── config/                # Django configuration (settings, urls, celery)
├── frontend/                  # Next.js 14/15 App Router frontend
│   ├── public/                # Static assets, branding, Ethiopian motifs
│   └── src/
│       ├── app/               # Next.js App Router (route groups)
│       ├── components/        # shadcn primitives and shared heirloom cards
│       ├── features/          # Domain-specific components and hooks
│       ├── lib/               # Utilities and graph layout helpers
│       ├── services/          # API client with token rotation interceptors
│       └── types/             # TypeScript definitions aligned with API schema
├── docs/                      # Architectural and engineering documentation
├── docker-compose.yml         # Container definitions for Postgres, Redis, MinIO
└── .env.example               # Environment variables template
```

---

## 📜 Documentation Index

All architectural documentation is maintained under `/docs`:
- `docs/PROJECT_OVERVIEW.md`: High-level vision and product rules.
- `docs/ARCHITECTURE.md`: Complete system architecture and trust boundaries.
- `docs/DATABASE_DESIGN.md`: PostgreSQL schema, constraints, and JSONB usage.
- `docs/API_DOCUMENTATION.md`: REST API endpoint specification.
- `docs/FRONTEND_GUIDE.md`: Next.js design tokens, layouts, and component patterns.
- `docs/BACKEND_GUIDE.md`: Django services, selectors, and permission enforcement.
