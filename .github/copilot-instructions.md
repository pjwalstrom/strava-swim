# Copilot Instructions

## Project Overview

Personal dashboard that visualizes average 100m pace for pool swim sessions from Strava. Dual-stack monorepo with a React frontend and a Kotlin/Ktor backend. Persistence is file-based (JSON). The UI should feel calm, focused, and distraction-free.

## Tech Stack

### Frontend (`frontend/`)
- **React 19** with **TypeScript** (strict mode)
- **Vite** for bundling and dev server (`localhost:5173`)
- **Recharts** for chart visualization
- **ESLint** with TypeScript and React hooks plugins

### Backend (`backend/`)
- **Kotlin** with **Ktor** on Netty (`localhost:8080`)
- **kotlinx.serialization** for JSON
- **Ktor HTTP client** for Strava API calls (OAuth2 token refresh)
- **Logback** for logging
- **Gradle** with Kotlin DSL

### Persistence
- JSON file at `data/activities.json`
- Thread-safe reads/writes via synchronized blocks in `ActivityStore.kt`

## Code Conventions

### Frontend
- Components in PascalCase (`SwimChart.tsx`, `EditModal.tsx`)
- Functions and variables in camelCase
- CSS classes in kebab-case
- Imports ordered: React/libraries → local modules → CSS
- TypeScript strict mode is on — no unused locals/parameters, no fallthrough switch cases

### Backend
- Package: `strava.swim`
- Kotlin official code style (`kotlin.code.style=official` in `gradle.properties`)
- Use `@SerialName` for mapping snake_case Strava API fields to camelCase properties
- Use the application logger from Ktor (`application.log`), not standalone LoggerFactory calls
- Imports ordered: `io.ktor` → `kotlinx`/`kotlin` → `java`

## Environment & Configuration

- Strava credentials live in `backend/.env` (git-ignored): `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`
- Config is loaded via a custom `loadEnv()` function in `Application.kt`
- Frontend API base URL is hardcoded to `http://localhost:8080`

## Running the App

```bash
# Backend
cd backend && ./gradlew run

# Frontend
cd frontend && npm install && npm run dev
```

## Prompt History

All prompts are tracked in `PROMPTS.md` at the repo root. Append new prompts there.

## Guidelines

- Keep dependencies minimal — only add libraries when clearly needed
- No database — persistence stays file-based
- Keep the UI minimal and distraction-free
- There are currently no automated tests — when adding them, use Vitest for frontend and JUnit/Kotest for backend
