import type { BodyWeightLog } from "@/types";

export function BodyWeightChart({ logs }: { logs: BodyWeightLog[] }) {
  if (logs.length === 0) {
    return <p className="empty-state">No weight logged yet.</p>;
  }

  const recent = logs.slice(-20);
  const values = recent.map((l) => l.weightKg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 300;
  const height = 80;
  const points = recent
    .map((log, i) => {
      const x = (i / Math.max(recent.length - 1, 1)) * width;
      const y = height - ((log.weightKg - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke="#39e07a" strokeWidth="2" />
      </svg>
      <div className="list-row" style={{ border: "none" }}>
        <span className="text-muted">{recent[0].date}</span>
        <span className="text-accent" style={{ fontWeight: 700 }}>
          {recent[recent.length - 1].weightKg} kg
        </span>
        <span className="text-muted">{recent[recent.length - 1].date}</span>
      </div>
    </div>
  );
}
