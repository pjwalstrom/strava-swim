import { useState } from "react";
import type { StravaActivitySummary } from "../types";

interface Props {
  swims: StravaActivitySummary[];
  existingIds: Set<number>;
  onAdd: (stravaId: number) => Promise<void>;
}

function formatDistance(meters: number): string {
  return `${Math.round(meters)}m`;
}

export default function StravaSwimList({ swims, existingIds, onAdd }: Props) {
  const [addingId, setAddingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (id: number) => {
    setAddingId(id);
    setError(null);
    try {
      await onAdd(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="strava-list">
      {swims.map((swim) => {
        const exists = existingIds.has(swim.id);
        return (
          <div
            key={swim.id}
            className={`strava-item ${exists ? "strava-item-exists" : ""}`}
          >
            <div className="strava-item-info">
              <span className="strava-item-name">{swim.name}</span>
              <span className="strava-item-meta">
                {swim.date} · {formatDistance(swim.distance)}
              </span>
            </div>
            {exists ? (
              <span className="strava-item-added">✓ Added</span>
            ) : (
              <button
                className="strava-item-btn"
                disabled={addingId !== null}
                onClick={() => handleAdd(swim.id)}
              >
                {addingId === swim.id ? "Adding…" : "Add"}
              </button>
            )}
          </div>
        );
      })}
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}
