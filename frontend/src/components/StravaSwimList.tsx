import { useState } from "react";
import type { StravaActivitySummary } from "../types";
import { Button, BodyShort, Tag } from "@navikt/ds-react";

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
              <BodyShort size="small" className="strava-item-name">{swim.name}</BodyShort>
              <BodyShort size="small" className="strava-item-meta">
                {swim.date} · {formatDistance(swim.distance)}
              </BodyShort>
            </div>
            {exists ? (
              <Tag variant="success" size="small">Added</Tag>
            ) : (
              <Button
                variant="secondary"
                size="xsmall"
                disabled={addingId !== null}
                loading={addingId === swim.id}
                onClick={() => handleAdd(swim.id)}
              >
                Add
              </Button>
            )}
          </div>
        );
      })}
      {error && <BodyShort size="small" className="input-error">{error}</BodyShort>}
    </div>
  );
}
