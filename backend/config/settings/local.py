import os
from .base import *

DEBUG = True

# Check if PostgreSQL driver is available and configured
HAS_POSTGRES_DRIVER = False
try:
    import psycopg
    HAS_POSTGRES_DRIVER = True
except ImportError:
    try:
        import psycopg2
        HAS_POSTGRES_DRIVER = True
    except ImportError:
        HAS_POSTGRES_DRIVER = False

USE_POSTGRES = os.getenv('USE_POSTGRES', 'False').lower() in ('true', '1') and HAS_POSTGRES_DRIVER

if USE_POSTGRES:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME', 'kinkeep_db'),
            'USER': os.getenv('DB_USER', 'kinkeep_admin'),
            'PASSWORD': os.getenv('DB_PASSWORD', 'kinkeep_secure_dev_password_2026'),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '5432'),
        }
    }
else:
    # Safe default for local schema generation and unit testing
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# MinIO / S3 Local Settings
MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT', 'http://localhost:9000')
MINIO_PUBLIC_URL = os.getenv('MINIO_PUBLIC_URL', 'http://localhost:9000')
MINIO_ROOT_USER = os.getenv('MINIO_ROOT_USER', 'kinkeep_minio_admin')
MINIO_ROOT_PASSWORD = os.getenv('MINIO_ROOT_PASSWORD', 'kinkeep_minio_dev_password_2026')
MINIO_BUCKET_NAME = os.getenv('MINIO_BUCKET_NAME', 'kinkeep-private-media')
