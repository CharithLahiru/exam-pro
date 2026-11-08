@echo off
setlocal EnableDelayedExpansion

title ExamPro Development Environment Launcher

echo =====================================================================
echo                     ExamPro Dev Environment Runner
echo =====================================================================
echo.

cd /d "%~dp0"

:: 1. Check/create .env file
if not exist ".env" (
    if exist ".env.example" (
        echo [*] .env not found. Creating from .env.example...
        copy .env.example .env >nul
        echo [OK] Created .env
    ) else (
        echo [!] Warning: .env.example not found. Proceeding with defaults...
    )
)

:: 2. Check Docker
echo [*] Checking Docker daemon status...
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [!] ERROR: Docker daemon is not running.
    echo     Please start Docker Desktop and run this script again.
    echo.
    pause
    exit /b 1
)

:: 3. Start Infrastructure Containers (MySQL, Keycloak, Postgres)
echo [*] Starting Docker infrastructure containers (MySQL, Keycloak, Postgres)...
docker compose up -d mysql keycloak postgres
if %ERRORLEVEL% neq 0 (
    echo [!] Failed to start Docker containers.
    echo.
    pause
    exit /b 1
)
echo [OK] Infrastructure services are up and running.
echo.

:: 4. Start Backend Server in a new window
echo [*] Launching Backend Spring Boot server...
start "ExamPro Backend (Spring Boot :8085)" cmd /k "cd /d "%~dp0exam-pro\backend\exampro" && echo Starting Spring Boot... && mvnw.cmd spring-boot:run"

:: 5. Start Frontend Vite Dev Server in a new window
echo [*] Launching Frontend Vite server...
start "ExamPro Frontend (Vite :5173)" cmd /k "cd /d "%~dp0exam-pro\frontend" && if not exist "node_modules" (echo Installing npm packages... && npm install) && echo Starting Vite dev server... && npm run dev"

echo.
echo =====================================================================
echo                   ExamPro is starting up!
echo =====================================================================
echo.
echo  - Frontend Application:    http://localhost:5173/exam-pro/
echo  - Backend API / Swagger:   http://localhost:8085/swagger-ui.html
echo  - Backend Health Check:    http://localhost:8085/actuator/health
echo  - Keycloak Admin Console:  http://localhost:8081  (admin / admin123)
echo.
echo Note: If this is your first run, configure Keycloak realm 'exampro-realm'
echo       and client 'exampro-client' as outlined in README.md.
echo.
echo Press any key to exit this launcher window (services will stay running).
pause >nul
exit /b 0
