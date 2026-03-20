export interface SwimActivity {
  id: number;
  name: string;
  date: string; // "2026-03-15"
  avgPace100m: number; // seconds per 100m
  distance: number; // meters
  laps: number;
  elapsedTime: number; // total seconds
}

export interface StravaActivitySummary {
  id: number;
  name: string;
  date: string;
  distance: number;
}
