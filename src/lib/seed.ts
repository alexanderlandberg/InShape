import type { Exercise, Workout } from "@/types";

export const SEED_EXERCISES: Exercise[] = [
  { id: "crunches", name: "Back extensions", type: "reps", equipment: "none", metValue: 3.8, secondsPerRep: 3, order: 1 },
  { id: "situps", name: "Sit-ups", type: "reps", equipment: "none", metValue: 4.0, secondsPerRep: 3, order: 2 },
  { id: "pushups", name: "Push-ups", type: "reps", equipment: "none", metValue: 8.0, secondsPerRep: 3, order: 3 },
  { id: "squats", name: "Squats", type: "reps", equipment: "weights", metValue: 5.0, secondsPerRep: 3, weightKg: 10, order: 4 },
  { id: "bicep_curls", name: "Bicep curls (each arm)", type: "reps", equipment: "weights", metValue: 3.5, secondsPerRep: 3, weightKg: 10, order: 5 },
  { id: "overhead_press", name: "Standing overhead press (each arm)", type: "reps", equipment: "weights", metValue: 4.0, secondsPerRep: 3, weightKg: 10, order: 6 },
  { id: "rows", name: "Standing row (each arm)", type: "reps", equipment: "weights", metValue: 4.0, secondsPerRep: 3, weightKg: 10, order: 7 },
  { id: "bench_press", name: "Bench press (lying, each hand)", type: "reps", equipment: "weights", metValue: 5.0, secondsPerRep: 4, weightKg: 10, order: 8 },
  { id: "biking", name: "Biking", type: "duration", equipment: "none", metValue: 7.5, trackDistance: true, order: 9 },
];

export const SEED_WORKOUT_1: Workout = {
  id: "workout-1",
  name: "Workout 1",
  createdAt: Date.now(),
  exercises: [
    { exerciseId: "crunches", plannedValue: 30, order: 1 },
    { exerciseId: "situps", plannedValue: 30, order: 2 },
    { exerciseId: "pushups", plannedValue: 10, order: 3 },
    { exerciseId: "squats", plannedValue: 30, order: 4 },
    { exerciseId: "bicep_curls", plannedValue: 30, order: 5 },
    { exerciseId: "overhead_press", plannedValue: 30, order: 6 },
    { exerciseId: "rows", plannedValue: 30, order: 7 },
  ],
};
