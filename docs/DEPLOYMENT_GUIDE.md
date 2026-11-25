# KinKeep Production Deployment & Operations Guide

## 1. Production Architecture Overview
In production, KinKeep operates as a high-availability containerized microservices stack:
- **Reverse Proxy / Ingress**: Nginx with Let's Encrypt TLS/SSL termination.
- **Frontend**: Next.js 14+ Node.js server container (SSR & SSG).
- **Backend API**: Gunicorn WSGI workers running Django REST Framework.
- **Asynchronous Task Workers**: Celery workers powered by Redis broker.
- **Database**: Managed PostgreSQL 16 with automated backups and connection pooling (PgBouncer).
- **Object Storage**: Private AWS S3 bucket with strict private access policies and CORS configuration.

---

## 2. Environment Configuration Reference

### Backend `.env.production`
```bash
# Core Security
DJANGO_SECRET_KEY="<strong-cryptographic-random-string-at-least-64-chars>"
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS="api.kinkeep.com,kinkeep.com"

# Database Configuration
DATABASE_URL="postgres://kinkeep_user:<db_password>@postgres-host:5432/kinkeep_prod"
DB_CONN_MAX_AGE=600

# Redis & Celery
REDIS_URL="redis://:redis_password@redis-host:6379/0"
CELERY_BROKER_URL="redis://:redis_password@redis-host:6379/1"

# Object Storage (AWS S3 / Cloudflare R2)
MEDIA_STORAGE_BACKEND="s3"
AWS_ACCESS_KEY_ID="<your-aws-access-key>"
AWS_SECRET_ACCESS_KEY="<your-aws-secret-key>"
AWS_STORAGE_BUCKET_NAME="kinkeep-vault-production"
AWS_S3_REGION_NAME="us-east-1"
AWS_S3_SIGNATURE_VERSION="s3v4"

# CORS & CSRF
CORS_ALLOWED_ORIGINS="https://kinkeep.com,https://app.kinkeep.com"
CSRF_TRUSTED_ORIGINS="https://api.kinkeep.com,https://kinkeep.com"

# JWT Security
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=15
JWT_REFRESH_TOKEN_LIFETIME_DAYS=14

# Payment Gateway Keys
CHAPA_SECRET_KEY="<chapa-secret-live>"
CHAPA_PUBLIC_KEY="<chapa-public-live>"
CHAPA_WEBHOOK_SECRET="<chapa-webhook-hmac-secret>"

TELEBIRR_APP_ID="<telebirr-app-id>"
TELEBIRR_APP_KEY="<telebirr-app-key>"
TELEBIRR_PUBLIC_KEY="<telebirr-public-key-pem>"

STRIPE_SECRET_KEY="<stripe-secret-key>"
STRIPE_WEBHOOK_SECRET="<stripe-webhook-signing-secret>"

# Email (SMTP / Amazon SES / SendGrid)
EMAIL_BACKEND="django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST="smtp.sendgrid.net"
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER="apikey"
EMAIL_HOST_PASSWORD="<sendgrid-api-key>"
DEFAULT_FROM_EMAIL="KinKeep Family Archives <noreply@kinkeep.com>"
```

### Frontend `.env.production`
```bash
NEXT_PUBLIC_API_URL="https://api.kinkeep.com/api/v1"
NEXT_PUBLIC_APP_URL="https://kinkeep.com"
NEXT_PUBLIC_CHAPA_PUBLIC_KEY="<chapa-public-live>"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="<stripe-publishable-key>"
```

---

## 3. Production Deployment with Docker Compose

### 3.1 Step-by-Step Server Bootstrap
```bash
# 1. Clone repository to deployment server
git clone https://github.com/kalkidan1919/Family-System.git /opt/kinkeep
cd /opt/kinkeep

# 2. Configure production secrets
cp .env.example .env.production
nano .env.production

# 3. Build container images
docker compose -f docker-compose.prod.yml build

# 4. Run database migrations
docker compose -f docker-compose.prod.yml run --rm backend python manage.py migrate

# 5. Seed default plans
docker compose -f docker-compose.prod.yml run --rm backend python manage.py shell -c "from apps.subscriptions.services import seed_default_plans; seed_default_plans()"

# 6. Create initial super admin
docker compose -f docker-compose.prod.yml run --rm backend python manage.py createsuperuser

# 7. Collect static files
docker compose -f docker-compose.prod.yml run --rm backend python manage.py collectstatic --noinput

# 8. Launch all services
docker compose -f docker-compose.prod.yml up -d
```

---

## 4. Nginx Reverse Proxy Configuration
```nginx
server {
    listen 80;
    server_name api.kinkeep.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.kinkeep.com;

    ssl_certificate /etc/letsencrypt/live/api.kinkeep.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.kinkeep.com/privkey.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /opt/kinkeep/backend/static/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 5. Security Hardening Checklist
- [x] Passwords hashed using PBKDF2 with SHA-256 (Django default 720,000 iterations).
- [x] JWT access tokens expire in 15 minutes; refresh tokens strictly rotated and blacklisted upon reuse.
- [x] S3 Media Buckets set to Private ACL; all file streaming handled via authenticated presigned URLs.
- [x] Ephemeral QR tokens stored as SHA-256 hashes in database.
- [x] Webhooks verified via provider HMAC / RSA signatures before credit or subscription activation.
- [x] Super Admin access restricted to staff users; audited in append-only `AuditLog` table.
- [x] Family data isolation guaranteed via `family=family` tenancy filters on all database queries.
