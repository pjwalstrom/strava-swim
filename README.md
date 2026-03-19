# Swim Pace Tracker

A calm, focused dashboard for tracking average 100m pool swim times from Strava.

## Prerequisites

- **Java 21+** (for the Kotlin/Ktor backend)
- **Node.js 18+** (for the React frontend)
- **Strava API access token** ([how to get one](#getting-a-strava-access-token))

## Getting Started

### 1. Backend

Create a `backend/.env` file with your Strava credentials:

```
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REFRESH_TOKEN=your_refresh_token
```

Then start the server:

```bash
cd backend
./gradlew run
```

The API server starts on `http://localhost:8080`. Access tokens are refreshed automatically.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Getting a Strava Access Token

1. Go to [Strava API Settings](https://www.strava.com/settings/api) and create an application
2. Use the OAuth2 flow to get a refresh token with `activity:read_all` scope:
   - Authorize: `https://www.strava.com/oauth/authorize?client_id=YOUR_ID&response_type=code&redirect_uri=http://localhost&scope=activity:read_all&approval_prompt=force`
   - Copy the `code` from the redirect URL
   - Exchange: `curl -X POST https://www.strava.com/oauth/token -d client_id=ID -d client_secret=SECRET -d code=CODE -d grant_type=authorization_code`
3. Save `client_id`, `client_secret`, and `refresh_token` in `backend/.env`

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
