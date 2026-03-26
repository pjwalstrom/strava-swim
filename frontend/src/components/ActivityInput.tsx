import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { TextField, Button, ErrorMessage } from "@navikt/ds-react";

interface Props {
  onAdd: (stravaId: number) => Promise<void>;
}

export default function ActivityInput({ onAdd }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const stravaId = Number(value.trim());
    if (!stravaId || isNaN(stravaId)) {
      setError("Please enter a valid activity ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onAdd(stravaId);
      setValue("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add activity";
      setError(msg);
      timerRef.current = setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="input-row" onSubmit={handleSubmit}>
      <div className="input-group">
        <TextField
          label="Strava activity ID"
          hideLabel
          size="small"
          placeholder="Strava activity ID"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          className="input-field"
        />
        <Button type="submit" size="small" loading={loading}>
          Add
        </Button>
      </div>
      {error && <ErrorMessage size="small" className="input-error">{error}</ErrorMessage>}
    </form>
  );
}
