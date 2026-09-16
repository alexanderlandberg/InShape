"use client";

import { WorkoutBuilderForm } from "@/components/workouts/WorkoutBuilderForm";

export default function NewWorkoutPage() {
  return (
    <div>
      <h1 className="page-title">New Workout</h1>
      <WorkoutBuilderForm />
    </div>
  );
}
