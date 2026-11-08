@echo off
setlocal

title ExamPro Development Environment Stopper

echo =====================================================================
echo                     ExamPro Dev Environment Stopper
echo =====================================================================
echo.

cd /d "%~dp0"

echo [*] Stopping Docker infrastructure containers (MySQL, Keycloak, Postgres)...
docker compose stop mysql keycloak postgres

echo.
echo [OK] Docker containers stopped.
echo (To close Backend and Frontend, close their respective command prompt windows.)
echo.
pause
