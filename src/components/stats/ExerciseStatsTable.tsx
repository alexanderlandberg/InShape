"use client";

import { useState } from "react";
import { aggregateByExercise, type StatsRange } from "@/lib/stats";
import type { Exercise, Session } from "@/types";

const RANGES: { value: StatsRange; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "all", label: "All time" },
];

export function ExerciseStatsTable({
  sessions,
  exercises,
}: {
  sessions: Session[];
  exercises: Exercise[];
}) {
  const [range, setRange] = useState<StatsRange>("week");
  const totals = aggregateByExercise(sessions, range);
  const activeExercises = exercises.filter((e) => !e.archived).sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="radio-group" style={{ marginBottom: "0.5rem" }}>
        {RANGES.map((r) => (
          <button
            key={r.value}
            type="button"
            className={`radio-group__option${range === r.value ? " radio-group__option--selected" : ""}`}
            onClick={() => setRange(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>
      {activeExercises.map((exercise) => {
        const total = totals[exercise.id];
        return (
          <div className="list-row" key={exercise.id}>
            <div className="list-row__main">
              <div className="list-row__name">{exercise.name}</div>
            </div>
            <span className="list-row__tag">
              {total?.totalActual ?? 0} {exercise.type === "duration" ? "min" : "reps"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
