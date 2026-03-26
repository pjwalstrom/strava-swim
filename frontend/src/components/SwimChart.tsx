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
import { BodyShort } from "@navikt/ds-react";

function formatPace(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  return dateStr;
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
      <BodyShort size="small" weight="semibold">{activity.name}</BodyShort>
      <BodyShort size="small">{formatDate(activity.date)}</BodyShort>
      <BodyShort size="small">Pace: {formatPace(activity.avgPace100m)}/100m</BodyShort>
      <BodyShort size="small">Distance: {activity.distance}m</BodyShort>
      <BodyShort size="small" className="tooltip-hint">Click to edit</BodyShort>
    </div>
  );
}

function ClickableDot(
  props: Record<string, unknown> & { onEdit: (activity: SwimActivity) => void }
) {
  const { cx, cy, payload, onEdit } = props as {
    cx: number;
    cy: number;
    payload: SwimActivity;
    onEdit: (activity: SwimActivity) => void;
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
        onEdit(payload);
      }}
    />
  );
}

export default function SwimChart({ activities, onDotClick }: Props) {
  if (activities.length === 0) {
    return (
      <div className="chart-container chart-empty">
        <BodyShort>No swim activities yet. Add one below.</BodyShort>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={420}>
        <LineChart
          data={activities}
          margin={{ top: 10, right: 20, bottom: 80, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 13, fill: "#888" }}
            angle={-90}
            textAnchor="end"
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
            activeDot={<ClickableDot onEdit={onDotClick} />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
