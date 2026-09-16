"use client";

import { use } from "react";
import { useAppData } from "@/components/layout/AppDataProvider";
import { SessionRunner } from "@/components/logging/SessionRunner";
import type { Exercise } from "@/types";

export default function LogWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = use(params);
  const { workouts, exercises, loading } = useAppData();
  const workout = workouts.find((w) => w.id === workoutId);

  if (loading) return <p className="empty-state">Loading…</p>;
  if (!workout) return <p className="empty-state">Workout not found.</p>;

  const exercisesById = Object.fromEntries(exercises.map((e) => [e.id, e]));
  const exercisesInSession = workout.exercises
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((item) => ({ exercise: exercisesById[item.exerciseId], plannedValue: item.plannedValue }))
    .filter(
      (item): item is { exercise: Exercise; plannedValue: number } => item.exercise !== undefined,
    );

  if (exercisesInSession.length === 0) {
    return <p className="empty-state">This workout has no exercises left in the library.</p>;
  }

  return (
    <SessionRunner
      workoutId={workout.id}
      workoutName={workout.name}
      exercisesInSession={exercisesInSession}
    />
  );
}
