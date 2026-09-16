"use client";

import Link from "next/link";
import { useAppData } from "@/components/layout/AppDataProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ExercisesPage() {
  const { exercises, loading } = useAppData();
  const active = exercises.filter((e) => !e.archived);

  return (
    <div>
      <h1 className="page-title">Exercise Library</h1>

      <Card style={{ marginBottom: "1.25rem" }}>
        {loading ? (
          <p className="empty-state">Loading…</p>
        ) : active.length === 0 ? (
          <p className="empty-state">
            No exercises yet. Run the seed data from /dev/seed, or add one below.
          </p>
        ) : (
          active.map((exercise) => (
            <div className="list-row" key={exercise.id}>
              <div className="list-row__main">
                <div className="list-row__name">{exercise.name}</div>
                <div className="list-row__meta">
                  {exercise.type === "reps" ? "Reps" : "Duration (min)"}
                  {exercise.weightKg ? ` · ${exercise.weightKg}kg` : ""}
                  {" · MET "}
                  {exercise.metValue}
                </div>
              </div>
              <span className="list-row__tag">{exercise.equipment ?? "none"}</span>
            </div>
          ))
        )}
      </Card>

      <Link href="/exercises/new">
        <Button variant="primary" block>
          + Add Exercise
        </Button>
      </Link>
    </div>
  );
}
