import { useState } from "react";
import type { FormEvent } from "react";
import type { SwimActivity } from "../types";

function formatPace(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface Props {
  activity: SwimActivity;
  onSave: (id: number, distance: number) => Promise<void>;
  onClose: () => void;
}

export default function EditModal({ activity, onSave, onClose }: Props) {
  const [distance, setDistance] = useState(activity.distance.toString());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewPace =
    activity.elapsedTime > 0 && Number(distance) > 0
      ? (activity.elapsedTime / Number(distance)) * 100
      : activity.avgPace100m;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const dist = Number(distance);
    if (!dist || dist <= 0) {
      setError("Enter a valid distance");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(activity.id, dist);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{activity.name}</h2>
        <p className="modal-date">{activity.date}</p>
        <form onSubmit={handleSubmit}>
          <label>
            Distance (m)
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              autoFocus
              min="1"
              step="any"
            />
          </label>
          <p className="modal-preview">
            Pace: {formatPace(previewPace)}/100m
          </p>
          {error && <p className="input-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
