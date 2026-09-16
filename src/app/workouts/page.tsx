"use client";

import Link from "next/link";
import { useAppData } from "@/components/layout/AppDataProvider";
import { WorkoutCard } from "@/components/workouts/WorkoutCard";
import { Button } from "@/components/ui/Button";

export default function WorkoutsPage() {
  const { workouts, loading } = useAppData();
  const active = workouts.filter((w) => !w.archived);

  return (
    <div>
      <h1 className="page-title">Workouts</h1>

      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : active.length === 0 ? (
        <p className="empty-state">
          No workouts yet. Run the seed data from /dev/seed, or build one below.
        </p>
      ) : (
        active.map((workout) => <WorkoutCard key={workout.id} workout={workout} />)
      )}

      <Link href="/workouts/new">
        <Button variant="primary" block style={{ marginTop: "0.5rem" }}>
          + New Workout
        </Button>
      </Link>
    </div>
  );
}
