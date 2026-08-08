# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A QR code check-in system for an escape room venue ("Escape House"). Guests scan a QR code, select their slot, and submit a declaration of consent. Staff use an admin panel to view and manage registrations.

The app is a full-stack Kotlin/Ktor backend + React frontend. In production the Ktor server serves the compiled React bundle as static files. In development they run independently with Vite proxying `/api` to the backend.

## Commands

### Backend (Kotlin/Ktor)

```bash
./gradlew run          # Run backend (reads .env automatically)
./gradlew build        # Build backend + compile & bundle frontend
./gradlew test         # Run backend tests
```

The `build` task runs `npm ci` and `npm run build` inside `frontend/`, then copies the output into `build/generated-resources/main/frontend_build/` so it is served as static resources.

### Frontend (React/Vite)

Run these from the `frontend/` directory:

```bash
npm run dev     # Dev server at http://localhost:5173 (proxies /api → localhost:8080)
npm run build   # Production build
npm run lint    # ESLint
```

### Infrastructure

```bash
docker compose up -d   # Start MongoDB locally
```

## Environment Setup

Copy `.env.example` to `.env` and fill in credentials. Required variables:

- `QUINBOOK_CLIENT_ID` / `QUINBOOK_CLIENT_SECRET` — Quinbook booking system OAuth
- `MONGO_ROOT_PASSWORD` / `MONGO_APP_PASSWORD` — MongoDB credentials
- `MONGODB_CONNECTION_STRING` — full MongoDB URI
- `ADMIN_PASSWORD` — plain-text admin password
- `ADMIN_SESSION_SIGN_KEY` — base64-encoded HMAC key for cookie signing

The Gradle `run` task reads `.env` automatically. The backend crashes on startup if required config is missing.

## Architecture

### Backend (`src/main/kotlin/`)

Ktor 3 with its built-in DI system (dependency injection via `application.yaml`). All services are singletons wired in the YAML config — adding a new service requires registering it there.

- **`auth/AdminAuth.kt`** — cookie-based admin session (8-hour HMAC-signed cookie; `ADMIN_SECURE_COOKIE=false` disables Secure flag for local HTTP dev)
- **`config/`** — `QuinbookConfig` and `MongoConfig` read env vars and are injected into services
- **`service/QuinbookService`** — fetches today's slots from the Quinbook API with an in-memory cache (soft 5 min / hard 30 min); background refresh on soft expiry
- **`service/CheckInService`** — validates and persists a `DeclarationOfConsent` to MongoDB
- **`repository/CheckInRepositoryImpl`** — MongoDB collection `declarationsOfConsent`; paginated search with optional name/date/slotId filters
- **`routing/`** — routes are split by domain (`CheckInRoutes`, `AdminDashboardRoutes`, `AdminRegistrationRoutes`, `QuinbookRoutes`); admin routes require the `admin-session` auth provider

**API base path:** `/api`
- `POST /api/checkin/{roomName}` — anonymous check-in
- `POST /api/checkin/{roomName}/{slotId}` — check-in for a specific slot
- `POST /api/auth/login` / `POST /api/auth/logout` / `GET /api/auth/session`
- Admin routes (session-guarded): dashboard and registration management

### Frontend (`frontend/src/`)

React 19 with React Router v7. Currently being actively restructured — old pages/components have been removed and new routes are being built under `src/routes/`.

- **`src/app/main.tsx`** — app entry point
- **`src/Router.tsx`** — route definitions
- **`src/routes/CheckInPage.tsx`** — slot listing landing page (WIP)
- **`src/routes/CheckInDetailPage.tsx`** — per-slot check-in form

Admin routes (`/admin`, `/admin/dashboard`, `/admin/registrations`) are commented out in the router while the frontend is being rebuilt.

### Hardcoded development values

`QuinbookService` currently has a hardcoded date (`2026-07-25`) and time (`2026-07-25T16:00:00`) instead of `LocalDate.now()` / `LocalDateTime.now()`. These will need to be reverted to use the real current date/time.

## Tech Stack

- **Backend:** Kotlin, Ktor 3, kotlinx.serialization, MongoDB Kotlin coroutine driver
- **Frontend:** React 19, React Router v7, TypeScript, Vite 8, React Compiler (babel plugin)
- **Database:** MongoDB 8 (Docker)
- **External API:** Quinbook (booking system) at `https://api2.quinbook.com`
