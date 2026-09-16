import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { calculateAvgSpeedKmh } from "@/lib/calculations";
import { formatDisplayDate } from "@/lib/date";
import type { Session, SessionEntry } from "@/types";

interface DayDetailPanelProps {
  date: string;
  sessions: Session[];
  onClose: () => void;
}

function entryTag(entry: SessionEntry): string {
  const base = `${entry.actualValue} ${entry.type === "duration" ? "min" : "reps"}`;
  if (entry.distanceKm === undefined) return base;
  const avgSpeed = calculateAvgSpeedKmh(entry.distanceKm, entry.actualValue);
  return `${base} · ${entry.distanceKm}km${avgSpeed !== undefined ? ` · ${avgSpeed} km/h` : ""}`;
}

function SessionDetailBlock({ session }: { session: Session }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div className="list-row__name">
        <Link href={`/session/${session.id}/edit`} style={{ textDecoration: "underline" }}>
          {session.workoutName}
        </Link>
      </div>
      <div className="list-row__meta" style={{ marginBottom: "0.5rem" }}>
        {session.totalCalories} kcal · {session.totalXp} XP
        {session.bodyWeightKg ? ` · ${session.bodyWeightKg}kg` : ""}
      </div>
      {session.entries.map((entry) => (
        <div className="list-row" key={entry.exerciseId}>
          <div className="list-row__main">
            <div className="list-row__name">{entry.exerciseName}</div>
          </div>
          <span className="list-row__tag">{entryTag(entry)}</span>
        </div>
      ))}
    </div>
  );
}

export function DayDetailPanel({ date, sessions, onClose }: DayDetailPanelProps) {
  return (
    <Modal title={formatDisplayDate(date)} onClose={onClose}>
      {sessions.length === 0 ? (
        <p className="empty-state">No session logged this day.</p>
      ) : (
        sessions.map((session) => <SessionDetailBlock key={session.id} session={session} />)
      )}
    </Modal>
  );
}
