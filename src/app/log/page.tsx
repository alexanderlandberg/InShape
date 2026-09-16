"use client";

import Link from "next/link";
import { useAppData } from "@/components/layout/AppDataProvider";
import { Card } from "@/components/ui/Card";

export default function LogPickerPage() {
  const { workouts, exercises, loading } = useAppData();
  const activeWorkouts = workouts.filter((w) => !w.archived);
  const adHocActivities = exercises.filter((e) => e.type === "duration" && !e.archived);

  if (loading) return <p className="empty-state">Loading…</p>;

  return (
    <div>
      <h1 className="page-title">Start a Session</h1>

      <span className="section-label">Workout templates</span>
      {activeWorkouts.length === 0 ? (
        <p className="empty-state">No workouts yet — create one under Workouts.</p>
      ) : (
        activeWorkouts.map((workout) => (
          <Link href={`/log/${workout.id}`} key={workout.id}>
            <Card interactive style={{ marginBottom: "0.75rem" }}>
              <div className="list-row__name">{workout.name}</div>
              <div className="list-row__meta">{workout.exercises.length} exercises</div>
            </Card>
          </Link>
        ))
      )}

      <span className="section-label" style={{ marginTop: "1.5rem" }}>
        Ad-hoc activity
      </span>
      {adHocActivities.map((exercise) => (
        <Link href={`/log/activity/${exercise.id}`} key={exercise.id}>
          <Card interactive style={{ marginBottom: "0.75rem" }}>
            <div className="list-row__name">Log {exercise.name}</div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
