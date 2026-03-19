import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { SwimActivity } from "../types";

function formatPace(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

interface Props {
  activities: SwimActivity[];
  onDotClick: (activity: SwimActivity) => void;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: SwimActivity }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const activity = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-name">{activity.name}</p>
      <p>{formatDate(activity.date)}</p>
      <p>Pace: {formatPace(activity.avgPace100m)}/100m</p>
      <p className="tooltip-hint">Click to edit</p>
    </div>
  );
}

function ClickableDot(
  props: Record<string, unknown> & { onClick: (activity: SwimActivity) => void }
) {
  const { cx, cy, payload, onClick } = props as {
    cx: number;
    cy: number;
    payload: SwimActivity;
    onClick: (activity: SwimActivity) => void;
  };
  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill="#3a7bc8"
      stroke="none"
      cursor="pointer"
      onClick={(e) => {
        e.stopPropagation();
        onClick(payload);
      }}
    />
  );
}

export default function SwimChart({ activities, onDotClick }: Props) {
  if (activities.length === 0) {
    return (
      <div className="chart-container chart-empty">
        <p>No swim activities yet. Add one below.</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={activities}
          margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 13, fill: "#888" }}
          />
          <YAxis
            dataKey="avgPace100m"
            tickFormatter={formatPace}
            tick={{ fontSize: 13, fill: "#888" }}
            domain={["dataMin - 5", "dataMax + 5"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="avgPace100m"
            stroke="#4a90d9"
            strokeWidth={2}
            dot={{ r: 5, fill: "#4a90d9", cursor: "pointer" }}
            activeDot={<ClickableDot onClick={onDotClick} />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
