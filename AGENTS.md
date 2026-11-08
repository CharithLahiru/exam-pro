# AGENTS.md: ExamPro AI Codebase Index & Architecture Guide

> **Audience**: AI Coding Assistants, LLMs, Subagents, and Pair-Programming Tools.  
> **Purpose**: Provides authoritative repository context, architectural boundaries, domain contracts, security lifecycles, and operational conventions to enable rapid reasoning and zero-hallucination code modifications.

---

## 1. System Overview & Technology Stack

ExamPro is a decoupled educational assessment monorepo divided into a Spring Boot 3 backend and a React 19/Vite frontend.

- **Primary Repository Root**: `D:\Research\ExamPro\Project`
- **Backend Directory**: `exam-pro/backend/exampro`
- **Frontend Directory**: `exam-pro/frontend`
- **Identity Provider**: Keycloak 24 (OIDC / OAuth2 Resource Server)
- **Primary Database**: MySQL 8.0 (Application Data)
- **Identity Database**: PostgreSQL 15 (Keycloak Internal Data)

### Tech Stack Details

| Layer | Component | Version / Framework | Core Libraries |
| :--- | :--- | :--- | :--- |
| **Backend** | Java REST API | Java 17, Spring Boot 3.5.6 | Spring Data JPA, Spring Security OAuth2 Resource Server, Springdoc OpenAPI 2.6.0, Keycloak Admin Client 23.0.1 |
| **Frontend** | React SPA | React 19.1.1, TypeScript 5.8.3, Vite 7.1.2 | React Router DOM 7.8.2, Axios 1.12.1 |
| **Auth** | IAM Server | Keycloak 24.0.0 | JWT, OpenID Connect (OIDC) |
| **DB** | Relational DB | MySQL 8.0 | MySQL Connector/J 8.0.28 |

---

## 2. Directory Layout & Component Map

```
D:\Research\ExamPro\Project
├── README.md                      # Human-facing multi-environment runbook
├── AGENTS.md                      # AI index & architectural specification (this file)
├── docker-compose.yml             # Unified root multi-service compose file
├── .env.example                   # Global environment variable template
├── .gitignore                     # Git ignore rules for Maven, Node, and IDE files
├── openspec/                      # OpenSpec specifications and changes
│   ├── config.yaml                # OpenSpec configuration
│   ├── changes/                   # Active and historical changes
│   └── specs/                     # Living system capability specifications
└── exam-pro/
    ├── backend/
    │   └── exampro/
    │       ├── pom.xml            # Maven project descriptor
    │       ├── Dockerfile         # Multi-stage Java 17 Temurin Alpine build
    │       ├── docker-compose.yml # Keycloak + PostgreSQL local compose
    │       └── src/
    │           ├── main/
    │           │   ├── java/com/logicx/exampro/
    │           │   │   ├── ExamproApplication.java      # Application entrypoint
    │           │   │   ├── config/                      # Security & Keycloak configuration
    │           │   │   │   ├── SecurityConfig.java      # Spring Security filter chain & CORS
    │           │   │   │   ├── KeycloakJwtAuthenticationConverter.java # Extracts realm roles to Spring Authorities
    │           │   │   │   ├── KeycloakUserService.java # Keycloak Admin API client interaction
    │           │   │   │   ├── AuthenticationController.java # Auth endpoints (/api/auth/*)
    │           │   │   │   └── SecurityUtils.java       # JWT token security context helper
    │           │   │   ├── controller/                  # REST Controllers
    │           │   │   │   ├── question/QuestionController.java
    │           │   │   │   └── user/UserController.java
    │           │   │   ├── dto/                         # Data Transfer Objects
    │           │   │   │   ├── UserRequest.java, UserResponse.java
    │           │   │   │   ├── QuestionRequest.java, QuestionResponse.java
    │           │   │   │   └── StatusResponse.java      # Standard API wrapper {status, message, data}
    │           │   │   ├── entity/                      # JPA Entities
    │           │   │   │   ├── User.java                # Application user model
    │           │   │   │   └── Question.java            # Exam question model
    │           │   │   ├── repository/_interface/       # Spring Data JPA Repositories
    │           │   │   │   ├── UserRepository.java
    │           │   │   │   └── QuestionRepository.java
    │           │   │   └── service/                     # Service Layer
    │           │   │       ├── _interface/              # Service contracts
    │           │   │       └── implementation/          # Service logic & transactions
    │           │   └── resources/
    │           │       └── application.properties       # Backend environment configuration
    │           └── test/                                # JUnit & Spring Boot test suite
    └── frontend/
        ├── package.json           # Dependencies and build scripts
        ├── vite.config.ts         # Vite configuration (base: '/exam-pro/')
        ├── tsconfig.json          # TypeScript project references
        ├── .env.development      # Dev environment variables (VITE_API_BASE_URL)
        └── src/
            ├── main.tsx           # React DOM root mounting
            ├── App.tsx            # Route definitions & layout structure
            ├── api/
            │   └── Axios.ts       # Configured Axios instances & JWT refresh interceptors
            ├── hooks/
            │   └── useAxiosPrivate.tsx # Custom hook providing authenticated Axios instance
            ├── service/
            │   ├── Service.ts     # Base service class with private axios instance
            │   ├── account/AccountService.ts # User creation & authentication requests
            │   └── email/EmailService.ts
            ├── data/account/      # Data types for auth, tokens, and users
            ├── types/common/      # ResponseData, CommonTypes
            └── pages/
                ├── ExamPage.tsx   # Examination view (OL, AL, Grade5)
                ├── TeachersHome.tsx
                ├── Home/          # Welcome, Stats, Categories components
                └── common-components/ # Headder, Footer, Search-bar
```

---

## 3. Authentication & Security Architecture

The platform relies on Keycloak for identity and access management, with Spring Security acting as an OAuth2 Resource Server.

```
[ Frontend Client ]
        |
        | 1. POST /api/auth/login { username, password }
        v
[ AuthenticationController ] -> [ KeycloakUserService ]
                                        |
                                        | 2. Keycloak Token Request (Direct Grant)
                                        v
                                 [ Keycloak IAM ]
                                        |
                                        | 3. Returns { accessToken, refreshToken, expiresIn }
        <-------------------------------+
        | 4. Stores tokens in localStorage
        |
        | 5. GET /account/* or /question/* (Header: Bearer <accessToken>)
        v
[ SecurityFilterChain ]
        |
        | 6. KeycloakJwtAuthenticationConverter validates JWT & extracts realm roles
        v
[ Role Authorization ] -> HasRole("STUDENT" | "TEACHER" | "ADMIN")
```

### Keycloak Realm & Client Details
- **Realm Name**: `exampro-realm`
- **Client ID**: `exampro-client`
- **Access Protocol**: OpenID Connect (OIDC) / OAuth 2.0
- **Roles Defined**:
  - `STUDENT`: Permitted access to student assessment routes and `/account/*` user profile endpoints.
  - `TEACHER`: Permitted access to `/api/teacher/**` and question authoring workflows.
  - `ADMIN`: Full access to `/api/admin/**` and user administration.

### Spring Security Endpoint Rules (`SecurityConfig.java`)
- **Public URLs (Permit All)**:
  - Swagger & API Docs: `/swagger-ui.html`, `/swagger-ui/**`, `/v3/api-docs/**`, `/api-docs/**`
  - Auth Endpoints: `/api/auth/**` (login, refresh, logout)
  - Public User Registration: `/account/createuser`
  - Health & Actuator: `/actuator/health`, `/health`
- **Protected URLs**:
  - `/account/*`: Requires `ROLE_STUDENT`
  - `/api/teacher/**`: Requires `ROLE_TEACHER`
  - `/api/admin/**`: Requires `ROLE_ADMIN`
  - All other routes: Require generic authentication (`authenticated()`)

### Token Handling & Interceptors (`Axios.ts`)
- The frontend Axios client automatically attaches `Bearer <accessToken>` via request interceptors.
- On HTTP `401 Unauthorized`, the response interceptor automatically invokes `/api/auth/refresh` using `refreshToken` and retries the original request.

---

## 4. Core Domain Entities & Database Contracts

### 1. `User` Entity (`com.logicx.exampro.entity.User`)
Mapped to database table: `user`
- `id` (Long, PK, Auto Increment)
- `keycloakId` (String, Unique) - Maps to Keycloak User UUID
- `username` (String, Unique, Not Null)
- `email` (String, Unique, Not Null)
- `firstName`, `lastName` (String)
- `phoneNumber` (String)
- `role` (String) - `STUDENT`, `TEACHER`, or `ADMIN`
- `status` (String) - Active, Inactive
- `createdAt`, `updatedAt` (Timestamp)

### 2. `Question` Entity (`com.logicx.exampro.entity.Question`)
Mapped to database table: `question`
- `id` (Long, PK, Auto Increment)
- `questionText` (String / Text, Not Null)
- `subjectId` (String, Not Null) - e.g. OL, AL, Grade 5 subjects
- `category` (String) - Exam category (e.g. `OL`, `AL`, `Grade5`)
- `optionA`, `optionB`, `optionC`, `optionD` (String)
- `correctOption` (String) - Correct answer identifier
- `marks` (Integer) - Allocated score
- `difficulty` (String) - EASY, MEDIUM, HARD

---

## 5. REST API Endpoint Index

### Authentication Endpoints (`/api/auth`)
- `POST /api/auth/login`
  - Request: `{ username: string, password: string }`
  - Response: `{ accessToken: string, refreshToken: string, tokenType: string, expiresIn: number }`
- `POST /api/auth/refresh`
  - Request: `{ refreshToken: string }`
  - Response: `{ accessToken: string, newRefreshToken?: string, tokenType: string, expiresIn: number }`
- `POST /api/auth/logout`
  - Request: `{ refreshToken: string }`
  - Response: `200 OK`

### User / Account Endpoints (`/account`)
- `POST /account/create-user`: Register new account (Public / Protected depending on invocation)
- `GET /account/get-user/{username}`: Retrieve profile by username (`ROLE_STUDENT`)
- `PUT /account/update-user/{username}`: Update user profile (`ROLE_STUDENT`)
- `DELETE /account/delete-user/{username}`: Delete user record (`ROLE_STUDENT`)

### Question Endpoints (`/question`)
- `POST /question/create-question`: Add new exam question
- `GET /question/get-question/{questionId}`: Fetch specific question by ID
- `GET /question/get-random-question/{subjectId}`: Fetch random question for testing

---

## 6. Development & Operational Commands

### Backend Commands (from `exam-pro/backend/exampro`)
```bash
# Run local Spring Boot server (Dev profile)
.\mvnw.cmd spring-boot:run           # Windows
./mvnw spring-boot:run               # Linux / macOS

# Build application package without running tests
.\mvnw.cmd clean package -DskipTests

# Run unit and integration tests
.\mvnw.cmd test

# Build Docker container image
docker build -t exampro-backend:latest .
```

### Frontend Commands (from `exam-pro/frontend`)
```bash
# Install dependencies
npm install

# Start Vite development server (Port 5173)
npm run dev

# Run TypeScript compilation and Vite production build
npm run build

# Run ESLint validation
npm run lint

# Preview built production artifacts locally
npm run preview
```

### Root Docker Orchestration Commands (from project root)
```bash
# Start infrastructure containers in background (MySQL, Keycloak, Postgres)
docker compose up -d

# Check status of running containers
docker compose ps

# Stop all containers
docker compose down
```

---

## 7. Known Architectural Conventions & Technical Debt

1. **Keycloak Port Mapping**:
   - `docker-compose.yml` maps port `8081:8080`.
   - `application.properties` default: `keycloak.auth-server-url=http://localhost:8086`.
   - *AI Guidance*: When writing or configuring endpoints, prefer externalized properties (`${KEYCLOAK_AUTH_SERVER_URL:http://localhost:8081}`).
2. **Frontend Base Path**:
   - `vite.config.ts` sets `base: '/exam-pro/'` for GitHub Pages hosting.
   - `App.tsx` routes are prefixed with `/exam-pro`.
   - *AI Guidance*: Ensure all new routes in `App.tsx` and navigation links use or respect this path prefix.
3. **Response DTO Standard**:
   - Controllers wrap responses in `StatusResponse`:
     ```java
     public class StatusResponse {
         private boolean success;
         private String message;
         private Object data;
     }
     ```
   - Always return `StatusResponse` for controller endpoints unless streaming binary assets.
