import type { SwimActivity } from "./types";

const API_BASE = "http://localhost:8080";

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
}

export async function fetchActivities(): Promise<SwimActivity[]> {
  const res = await fetch(`${API_BASE}/api/activities`);
  if (!res.ok) throw new Error(await parseError(res, "Failed to fetch activities"));
  return res.json();
}

export async function addActivity(stravaId: number): Promise<SwimActivity> {
  const res = await fetch(`${API_BASE}/api/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stravaId }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to add activity"));
  return res.json();
}

export async function updateActivity(id: number, distance: number): Promise<SwimActivity> {
  const res = await fetch(`${API_BASE}/api/activities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ distance }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to update activity"));
  return res.json();
}

export async function deleteActivity(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/activities/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to delete activity"));
}
