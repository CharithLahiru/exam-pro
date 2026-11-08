# ExamPro

ExamPro is a full-stack educational testing and examination management platform. The repository is structured as a decoupled monorepo featuring a Spring Boot backend, a Keycloak-secured identity provider, a MySQL persistence tier, and a modern React/Vite single-page application.

---

## Architecture Overview

```
+---------------------------------------------------------------------------------+
|                                    CLIENT                                       |
|  React 19 + TypeScript + Vite SPA                                               |
|  - Dev server: Port 5173 (base: /exam-pro/)                                     |
|  - Production: Nginx / Static CDN (base: /)                                     |
|  - Axios client with Bearer Token & Refresh Token Interceptor                   |
+------------------------------------+--------------------------------------------+
                                     |
                  +------------------+------------------+
                  | REST API (JSON)                     | OpenID Connect / OAuth2
                  v                                     v
+-----------------------------------+   +-----------------------------------------+
|             BACKEND               |   |                KEYCLOAK                 |
|  Spring Boot 3.5.6 (Port 8085)    |<->|  Identity & Access Management           |
|  - OAuth2 Resource Server (JWT)   |   |  - Port: 8081 (Docker) / 8086 (Config)  |
|  - Keycloak Admin Client (REST)   |   |  - Realm: exampro-realm                 |
|  - Spring Data JPA + Hibernate    |   |  - Client ID: exampro-client            |
|  - Swagger: /swagger-ui.html      |   |  - Roles: STUDENT, TEACHER, ADMIN       |
+-----------------+-----------------+   +--------------------+--------------------+
                  |                                          |
                  | JDBC (Port 3306)                         | JDBC (Port 5432)
                  v                                          v
+-----------------------------------+   +-----------------------------------------+
|          MYSQL DATABASE           |   |            POSTGRES DATABASE            |
|  Database: examprodb              |   |  Database: keycloak                     |
|  Port: 3306                       |   |  Port: 5432 (Internal)                  |
+-----------------------------------+   +-----------------------------------------+
```

---

## Tech Stack & Prerequisites

### Technologies
- **Backend**: Java 17, Spring Boot 3.5.6, Spring Security OAuth2 Resource Server, Spring Data JPA, Springdoc OpenAPI 2.6.0, Keycloak Admin Client 23.0.1.
- **Frontend**: React 19, TypeScript 5.8, Vite 7, React Router DOM 7, Axios.
- **Identity & Security**: Keycloak 24.0.0, OAuth2 / OIDC, JWT.
- **Databases**: MySQL 8.0 (Application DB), PostgreSQL 15 (Keycloak DB).
- **Containerization**: Docker, Docker Compose.

### System Requirements
- **Java**: OpenJDK / Eclipse Temurin 17+
- **Node.js**: Node 18.x or 20.x (with npm 9+)
- **Build Tools**: Maven 3.9+ (bundled via `mvnw` wrapper)
- **Container Runtime**: Docker Engine 24+ and Docker Compose v2+
- **Database Client**: MySQL 8.0+ (optional if using Docker)

---

## Port & Endpoint Directory

| Service | Host Port | Internal Port | Description / URL |
| :--- | :--- | :--- | :--- |
| **Frontend (Dev)** | `5173` | `5173` | `http://localhost:5173/exam-pro/` |
| **Backend API** | `8085` | `8085` | `http://localhost:8085` |
| **Swagger UI** | `8085` | `8085` | `http://localhost:8085/swagger-ui.html` |
| **OpenAPI Specification** | `8085` | `8085` | `http://localhost:8085/api-docs` |
| **Keycloak IAM** | `8081` / `8086` | `8080` | `http://localhost:8081` (Admin Console) |
| **MySQL Database** | `3306` | `3306` | `jdbc:mysql://localhost:3306/examprodb` |
| **PostgreSQL (Keycloak)**| `5432` | `5432` | Dedicated to Keycloak container |

---

## 1. Development Environment (`dev`)

> **Windows One-Click Shortcut**: You can double-click or run [`dev_run.bat`](file:///d:/Research/ExamPro/Project/dev_run.bat) from the project root. It will automatically check Docker, launch the MySQL/Keycloak/PostgreSQL containers, and open separate terminal windows for the Spring Boot backend and Vite frontend! To stop Docker containers later, run [`dev_stop.bat`](file:///d:/Research/ExamPro/Project/dev_stop.bat).

Follow these instructions to run the full application stack manually with live code reload:

### Step 1.1: Clone & Configure Environment
Clone the repository and inspect the project root:
```bash
git clone https://github.com/CharithLahiru/exam-pro.git
cd exam-pro

# On Linux/macOS
cp .env.example .env

# On Windows (PowerShell)
Copy-Item .env.example .env
```

### Step 1.2: Start Infrastructure Services (MySQL, Keycloak, Postgres)
Run the backing infrastructure using Docker Compose:
```bash
docker compose up -d mysql keycloak postgres
```
> **Note**: Verify that the database `examprodb` exists in MySQL:
> ```sql
> CREATE DATABASE IF NOT EXISTS examprodb;
> CREATE USER IF NOT EXISTS 'exampro'@'%' IDENTIFIED BY 'Password@12';
> GRANT ALL PRIVILEGES ON examprodb.* TO 'exampro'@'%';
> FLUSH PRIVILEGES;
> ```

### Step 1.3: Configure Keycloak Realm
1. Navigate to Keycloak Admin Console at `http://localhost:8081` (or `http://localhost:8086`).
2. Log in with admin credentials (`admin` / `admin123` or your configured `.env` values).
3. Create a realm named **`exampro-realm`**.
4. Create an OpenID Connect client named **`exampro-client`**:
   - Access Type / Client Authentication: `ON` (Confidential)
   - Service Accounts Enabled: `ON`
   - Valid Redirect URIs: `http://localhost:5173/*`, `http://localhost:8085/*`
   - Web Origins: `*` (or `http://localhost:5173`)
5. Under **Roles**, create three realm roles:
   - `STUDENT`
   - `TEACHER`
   - `ADMIN`
6. Copy the Client Secret from the **Credentials** tab and update `KEYCLOAK_CLIENT_SECRET` in `.env` and `keycloak.credentials.secret` in `application.properties`.

### Step 1.4: Run Backend (Dev Mode)
Open a terminal in `exam-pro/backend/exampro`:
```bash
cd exam-pro/backend/exampro

# On Linux/macOS
./mvnw spring-boot:run

# On Windows
.\mvnw.cmd spring-boot:run
```
- API Documentation: `http://localhost:8085/swagger-ui.html`
- Health Endpoint: `http://localhost:8085/actuator/health`

### Step 1.5: Run Frontend (Dev Mode)
Open a separate terminal in `exam-pro/frontend`:
```bash
cd exam-pro/frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173/exam-pro/`.

---

## 2. Build Guide

### 2.1 Backend Build

#### Option A: Standalone Executable JAR (Maven)
Compile, run tests, and package the Spring Boot backend into an executable JAR:
```bash
cd exam-pro/backend/exampro

# Linux/macOS
./mvnw clean package

# Windows (Command Prompt / PowerShell)
.\mvnw.cmd clean package

# Skip unit tests during build (faster packaging)
.\mvnw.cmd clean package -DskipTests
```
The packaged JAR will be created at:
`exam-pro/backend/exampro/target/exampro-1.0.0.0.jar`

To run the built JAR directly:
```bash
java -jar target/exampro-1.0.0.0.jar
```

#### Option B: Docker Container Image
Build the multi-stage Alpine-based container image:
```bash
# From repository root (current location -D:\Research\ExamPro\Project)
docker build -t exampro-backend:latest ./exam-pro/backend/exampro

# Or from the backend directory
cd exam-pro/backend/exampro
docker build -t exampro-backend:latest .
```

---

### 2.2 Frontend Build

#### Step 1: Install Dependencies
```bash
cd exam-pro/frontend
npm install
```

#### Step 2: Configure Environment Variables
Ensure your environment file (`.env` or `.env.production`) contains the appropriate backend API URL:
```env
VITE_API_BASE_URL=http://localhost:8085
```

#### Step 3: Typecheck & Compile
Run the Vite build script:
```bash
npm run build
```
This runs TypeScript project compilation (`tsc -b`) followed by Vite's production bundling.  
The compiled static assets will be output to:
`exam-pro/frontend/dist/`

#### Step 4: Preview Build Locally
To test the production build locally before deployment:
```bash
npm run preview
```
This starts Vite's local preview server at `http://localhost:4173/exam-pro/`.

---

## 3. Deployment Guide

ExamPro supports multiple deployment strategies depending on your target infrastructure:

### Strategy A: Full-Stack Docker Compose (All-in-One Deployment)

The project includes a root `docker-compose.yml` that orchestrates MySQL, PostgreSQL, Keycloak, and the Backend API.

> **Important**: The `backend` service is configured under the `full` and `app` profiles. You must pass `--profile full` to launch the backend alongside infrastructure services.

1. **Configure Environment Variables**:
   ```bash
   cp .env.example .env   # On Windows: Copy-Item .env.example .env
   ```
   Adjust credentials, hostnames, and secrets in `.env`.

2. **Build and Launch All Services**:
   ```bash
   docker compose --profile full up -d --build
   ```

3. **Verify Deployment**:
   ```bash
   docker compose ps
   docker compose logs -f backend
   ```

4. **Stop Services**:
   ```bash
   docker compose --profile full down
   ```

---

### Strategy B: Frontend Deployment to GitHub Pages

The frontend project is pre-configured with `gh-pages` and base path `/exam-pro/`.

1. **Verify `homepage` in `package.json`**:
   Ensure `homepage` matches your GitHub Pages URL (e.g., `https://<username>.github.io/exam-pro`).

2. **Deploy to GitHub Pages**:
   ```bash
   cd exam-pro/frontend
   npm run deploy
   ```
   *Note: This automatically triggers `npm run build` (`predeploy`) and pushes the `dist/` bundle to the `gh-pages` branch on your remote repository.*

---

### Strategy C: Frontend Production Deployment (Nginx / Docker)

To serve the frontend static build in production with client-side SPA routing:

1. **Build Static Assets**:
   ```bash
   cd exam-pro/frontend
   npm run build
   ```

2. **Serve with Nginx**:
   Place the contents of `exam-pro/frontend/dist/` into `/usr/share/nginx/html` and apply the following Nginx virtual host configuration:
   ```nginx
   server {
       listen 80;
       server_name exampro.yourdomain.com;
       root /usr/share/nginx/html;
       index index.html;

       # Ensure React Router client-side routing works
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests to backend (Optional reverse-proxy setup)
       location /api/ {
           proxy_pass http://backend:8085/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **Frontend Dockerfile (Optional Standalone Container)**:
   Create a `Dockerfile` inside `exam-pro/frontend`:
   ```dockerfile
   # Stage 1: Build
   FROM node:20-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   # Stage 2: Serve with Nginx
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

---

### Strategy D: Production Server Deployment (Standalone / VM)

For deployments on AWS EC2, DigitalOcean Droplets, or on-premise VMs:

1. **Deploy Backend as a Systemd Service**:
   Copy the built JAR to `/opt/exampro/backend/app.jar` and create `/etc/systemd/system/exampro-backend.service`:
   ```ini
   [Unit]
   Description=ExamPro Backend Service
   After=network.target mysql.service

   [Service]
   User=exampro
   WorkingDirectory=/opt/exampro/backend
   ExecStart=/usr/bin/java -jar app.jar
   EnvironmentFile=/opt/exampro/backend/.env
   SuccessExitStatus=143
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```
   Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now exampro-backend
   ```

2. **Run Backend Container Standalone**:
   ```bash
   docker run -d \
     --name exampro-backend \
     -p 8085:8085 \
     --restart unless-stopped \
     -e SPRING_PROFILES_ACTIVE=prod \
     -e SPRING_DATASOURCE_URL=jdbc:mysql://<db-host>:3306/examprodb \
     -e SPRING_DATASOURCE_USERNAME=exampro \
     -e SPRING_DATASOURCE_PASSWORD=StrongPassword123 \
     -e KEYCLOAK_AUTH_SERVER_URL=https://auth.yourdomain.com \
     -e KEYCLOAK_REALM=exampro-realm \
     -e KEYCLOAK_CREDENTIALS_SECRET=YourProductionSecret \
     exampro-backend:latest
   ```

---

## 4. Quality Assurance & Testing

### Backend Testing
Run unit and integration test suites:
```bash
cd exam-pro/backend/exampro

# Linux/macOS
./mvnw test

# Windows
.\mvnw.cmd test
```

### Frontend Validation & Linting
Validate TypeScript code quality and style:
```bash
cd exam-pro/frontend
npm run lint
npm run build
```

---

## 5. Production Security & Hardening Checklist

Before deploying to production environments, verify the following security requirements:
- [ ] **Database Schema**: Set `spring.jpa.hibernate.ddl-auto=validate`. Schema alterations must be managed using controlled migration scripts (e.g. Flyway or Liquibase), never dynamic Hibernate auto-updates.
- [ ] **SQL Logging**: Set `spring.jpa.show-sql=false` to prevent sensitive query data and parameters from leaking into logs.
- [ ] **CORS Restriction**: In `SecurityConfig.java`, replace wildcard origin patterns (`allowedOriginPatterns("*")`) with explicit trusted domains (e.g., `https://exampro.yourdomain.com`).
- [ ] **Secret Externalization**: Pass all sensitive parameters via environment variables or secret vaults (AWS Secrets Manager, HashiCorp Vault). Never commit credentials to source control.
- [ ] **SSL/TLS Termination**: Place all services behind a reverse proxy (Nginx, Traefik, AWS ALB, Cloudflare) enforcing HTTPS and HTTP/2.
- [ ] **Keycloak Production Mode**: Run Keycloak using `start` rather than `start-dev`, with proper SSL certificates and hostname configuration.


---

## Troubleshooting Guide

### 1. Keycloak Port Inconsistency (8081 vs 8086)
- **Symptom**: `Connection refused` when backend attempts to connect to `http://localhost:8086`.
- **Cause**: Backend compose exposes Keycloak on `8081:8080`, whereas `application.properties` historically references `8086`.
- **Solution**: Set `keycloak.auth-server-url=http://localhost:8081` in your properties, or pass `KEYCLOAK_AUTH_SERVER_URL=http://localhost:8081` as an environment variable.

### 2. MySQL Connection Refused
- **Symptom**: `Communications link failure: Connection refused: localhost:3306`.
- **Cause**: MySQL service is not running or credentials differ.
- **Solution**: Ensure MySQL container or local daemon is active. Verify with:
  ```bash
  docker compose ps mysql
  ```

### 3. Cross-Origin Resource Sharing (CORS) Errors
- **Symptom**: Browser reports `No 'Access-Control-Allow-Origin' header is present`.
- **Cause**: Frontend origin not matched in `SecurityConfig.java` or Keycloak client configuration.
- **Solution**: Check that Keycloak client `exampro-client` has `+` or `http://localhost:5173` under **Web Origins**, and backend `SecurityConfig` allows the requesting origin.

---

## License
This project is licensed under the terms described in the repository.
