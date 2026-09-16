"use client";

import { use } from "react";
import { useAppData } from "@/components/layout/AppDataProvider";
import { WorkoutBuilderForm } from "@/components/workouts/WorkoutBuilderForm";

export default function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = use(params);
  const { workouts, loading } = useAppData();
  const workout = workouts.find((w) => w.id === workoutId);

  if (loading) return <p className="empty-state">Loading…</p>;
  if (!workout) return <p className="empty-state">Workout not found.</p>;

  return (
    <div>
      <h1 className="page-title">Edit Workout</h1>
      <WorkoutBuilderForm initialWorkout={workout} />
    </div>
  );
}
