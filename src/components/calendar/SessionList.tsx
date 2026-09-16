"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { calculateAvgSpeedKmh } from "@/lib/calculations";
import { formatDisplayDate } from "@/lib/date";
import type { Session, SessionEntry } from "@/types";

function entryTag(entry: SessionEntry): string {
  let tag = `${entry.actualValue} ${entry.type === "duration" ? "min" : "reps"}`;
  if (entry.distanceKm !== undefined) {
    const avgSpeed = calculateAvgSpeedKmh(entry.distanceKm, entry.actualValue);
    tag += ` · ${entry.distanceKm}km${avgSpeed !== undefined ? ` · ${avgSpeed} km/h` : ""}`;
  }
  if (entry.weightKg !== undefined) {
    tag += ` · ${entry.weightKg}kg`;
  }
  return tag;
}

function SessionListItem({ session }: { session: Session }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="session-list-item">
      <button
        type="button"
        className="session-list-item__header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div>
          <div className="session-list-item__date">{formatDisplayDate(session.date)}</div>
          <div className="session-list-item__name">{session.workoutName}</div>
        </div>
        <div className="session-list-item__summary">
          <span>{session.totalXp} XP</span>
          <span className={`session-list-item__chevron${expanded ? " session-list-item__chevron--open" : ""}`}>
            ⌄
          </span>
        </div>
      </button>

      {expanded && (
        <div className="session-list-item__details">
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
          <Link href={`/session/${session.id}/edit`}>
            <Button variant="ghost" block style={{ marginTop: "0.75rem" }}>
              Edit
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export function SessionList({ sessions }: { sessions: Session[] }) {
  if (sessions.length === 0) {
    return <p className="empty-state">No sessions logged yet.</p>;
  }

  return (
    <div>
      {sessions.map((session) => (
        <SessionListItem key={session.id} session={session} />
      ))}
    </div>
  );
}
