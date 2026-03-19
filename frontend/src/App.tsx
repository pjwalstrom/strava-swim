import { useState, useEffect } from "react";
import { fetchActivities, addActivity, updateActivity, deleteActivity } from "./api";
import type { SwimActivity } from "./types";
import SwimChart from "./components/SwimChart";
import ActivityInput from "./components/ActivityInput";
import EditModal from "./components/EditModal";
import "./App.css";

function App() {
  const [activities, setActivities] = useState<SwimActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SwimActivity | null>(null);

  useEffect(() => {
    fetchActivities()
      .then((a) => a.sort((x, y) => x.date.localeCompare(y.date)))
      .then(setActivities)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (stravaId: number) => {
    const activity = await addActivity(stravaId);
    setActivities((prev) =>
      [...prev, activity].sort((a, b) => a.date.localeCompare(b.date))
    );
  };

  const handleUpdate = async (id: number, distance: number) => {
    const updated = await updateActivity(id, distance);
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? updated : a))
    );
  };

  const handleDelete = async (id: number) => {
    await deleteActivity(id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="app">
      <header>
        <h1>Swim Pace Tracker</h1>
      </header>
      <main>
        {loading ? (
          <p className="loading-text">Loading…</p>
        ) : (
          <SwimChart activities={activities} onDotClick={setEditing} />
        )}
        <ActivityInput onAdd={handleAdd} />
      </main>
      {editing && (
        <EditModal
          activity={editing}
          onSave={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

export default App;
