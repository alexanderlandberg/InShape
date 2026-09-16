import { Modal } from "@/components/ui/Modal";
import type { Session } from "@/types";

interface DayDetailPanelProps {
  date: string;
  sessions: Session[];
  onClose: () => void;
}

export function DayDetailPanel({ date, sessions, onClose }: DayDetailPanelProps) {
  return (
    <Modal title={date} onClose={onClose}>
      {sessions.length === 0 ? (
        <p className="empty-state">No session logged this day.</p>
      ) : (
        sessions.map((session) => (
          <div key={session.id} style={{ marginBottom: "1.25rem" }}>
            <div className="list-row__name">{session.workoutName}</div>
            <div className="list-row__meta" style={{ marginBottom: "0.5rem" }}>
              Effort: {session.effort} · {session.totalCalories} kcal · {session.totalXp} XP
              {session.bodyWeightKg ? ` · ${session.bodyWeightKg}kg` : ""}
            </div>
            {session.entries.map((entry) => (
              <div className="list-row" key={entry.exerciseId}>
                <div className="list-row__main">
                  <div className="list-row__name">{entry.exerciseName}</div>
                </div>
                <span className="list-row__tag">
                  {entry.actualValue} {entry.type === "duration" ? "min" : "reps"}
                </span>
              </div>
            ))}
          </div>
        ))
      )}
    </Modal>
  );
}
