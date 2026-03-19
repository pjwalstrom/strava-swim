# Swim Pace Tracker

A calm, focused dashboard for tracking average 100m pool swim times from Strava.

## Prerequisites

- **Java 21+** (for the Kotlin/Ktor backend)
- **Node.js 18+** (for the React frontend)
- **Strava API access token** ([how to get one](#getting-a-strava-access-token))

## Getting Started

### 1. Backend

```bash
cd backend
STRAVA_CLIENT_ID=<id> STRAVA_CLIENT_SECRET=<secret> STRAVA_REFRESH_TOKEN=<token> ./gradlew run
```

The API server starts on `http://localhost:8080`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Getting a Strava Access Token

1. Go to [Strava API Settings](https://www.strava.com/settings/api) and create an application
2. Use the [Strava OAuth Playground](https://developers.strava.com/playground/) or the OAuth2 flow to get a refresh token with `activity:read_all` scope
3. Pass `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, and `STRAVA_REFRESH_TOKEN` as environment variables — the backend auto-refreshes access tokens

> **Note:** The backend automatically refreshes the access token using your refresh token. No manual token management needed.

## Usage

1. Start both the backend and frontend
2. Enter a Strava activity ID (e.g. `17775830712`) in the input field and click **Add**
3. The system fetches the activity from Strava, calculates the average 100m pace from lap data, and adds it to the chart
4. Activities are persisted to `data/activities.json` and will appear on future visits

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/activities` | List all persisted swim activities |
| `POST` | `/api/activities` | Add a swim activity by Strava ID (`{ "stravaId": 123 }`) |

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Recharts
- **Backend:** Kotlin, Ktor, kotlinx.serialization
- **Persistence:** JSON file
