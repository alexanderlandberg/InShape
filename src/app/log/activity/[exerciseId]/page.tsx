"use client";

import { use } from "react";
import { useAppData } from "@/components/layout/AppDataProvider";
import { SessionRunner } from "@/components/logging/SessionRunner";

export default function LogActivityPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = use(params);
  const { exercises, loading } = useAppData();
  const exercise = exercises.find((e) => e.id === exerciseId);

  if (loading) return <p className="empty-state">Loading…</p>;
  if (!exercise) return <p className="empty-state">Exercise not found.</p>;

  return (
    <SessionRunner
      workoutId={null}
      workoutName={exercise.name}
      exercisesInSession={[{ exercise, plannedValue: 15 }]}
    />
  );
}
