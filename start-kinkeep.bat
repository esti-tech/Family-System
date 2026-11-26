@echo off
title KinKeep Full-Stack Launcher
echo ============================================================
echo           Launching KinKeep Full-Stack System
echo ============================================================
echo.
echo [1/2] Launching Django REST API Backend (Port 8000)...
start "KinKeep Backend API" cmd /k "cd /d H:\KInKeep\Family-System\backend && python manage.py runserver 0.0.0.0:8000"

echo [2/2] Launching Next.js 14 Frontend (Port 3000)...
start "KinKeep Frontend" cmd /k "cd /d H:\KInKeep\Family-System\frontend && npm run dev"

echo.
echo ============================================================
echo KinKeep is running!
echo - Web App:      http://localhost:3000
echo - Django Admin: http://localhost:8000/admin/
echo - Swagger API:  http://localhost:8000/api/schema/swagger-ui/
echo - PostgreSQL:   Running in background on port 5432
echo ============================================================
pause
