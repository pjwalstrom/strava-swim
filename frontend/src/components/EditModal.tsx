import { useState, forwardRef } from "react";
import type { FormEvent } from "react";
import type { SwimActivity } from "../types";
import { Modal, Button, TextField, Heading, BodyShort, Link, ErrorMessage } from "@navikt/ds-react";

function formatPace(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface Props {
  activity: SwimActivity | null;
  onSave: (id: number, distance: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onClose: () => void;
}

export default forwardRef<HTMLDialogElement, Props>(function EditModal({ activity, onSave, onDelete, onClose }, ref) {
  const [distance, setDistance] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentDistance = distance || (activity?.distance.toString() ?? "");
  const previewPace =
    activity && activity.elapsedTime > 0 && Number(currentDistance) > 0
      ? (activity.elapsedTime / Number(currentDistance)) * 100
      : activity?.avgPace100m ?? 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!activity) return;
    const dist = Number(currentDistance);
    if (!dist || dist <= 0) {
      setError("Enter a valid distance");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(activity.id, dist);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setDistance("");
    setError(null);
    onClose();
  };

  if (!activity) {
    return <Modal ref={ref} onClose={handleClose} aria-label="Edit activity"><Modal.Body>{null}</Modal.Body></Modal>;
  }

  return (
    <Modal ref={ref} onClose={handleClose} aria-label="Edit activity">
      <Modal.Header>
        <Heading size="small">{activity.name}</Heading>
      </Modal.Header>
      <Modal.Body>
        <BodyShort size="small" className="modal-date">{activity.date}</BodyShort>
        <BodyShort size="small" className="modal-link">
          <Link href={`https://www.strava.com/activities/${activity.id}`} target="_blank">
            strava.com/activities/{activity.id}
          </Link>
        </BodyShort>
        <form id="edit-form" onSubmit={handleSubmit}>
          <TextField
            label="Distance (m)"
            type="number"
            size="small"
            value={currentDistance}
            onChange={(e) => setDistance(e.target.value)}
            autoFocus
            min={1}
            step="any"
          />
          <BodyShort size="small" className="modal-preview">
            Pace: {formatPace(previewPace)}/100m
          </BodyShort>
          {error && <ErrorMessage size="small">{error}</ErrorMessage>}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          size="small"
          loading={deleting}
          disabled={saving}
          onClick={async () => {
            setDeleting(true);
            try {
              await onDelete(activity.id);
              handleClose();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Failed to delete");
            } finally {
              setDeleting(false);
            }
          }}
        >
          Delete
        </Button>
        <div style={{ flex: 1 }} />
        <Button variant="secondary" size="small" onClick={handleClose} disabled={saving || deleting}>
          Cancel
        </Button>
        <Button type="submit" form="edit-form" size="small" loading={saving} disabled={deleting}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
});
