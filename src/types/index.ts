export type ExerciseType = "reps" | "duration";
export type Equipment = "weights" | "none";
export type Effort = "low" | "medium" | "high";

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  equipment?: Equipment;
  metValue: number;
  secondsPerRep?: number; // reps-type only, default 3
  weightKg?: number; // load moved per rep, for "kilos lifted" stat
  order: number;
  archived?: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  plannedValue: number;
  order: number;
}

export interface Workout {
  id: string;
  name: string;
  createdAt: number;
  exercises: WorkoutExercise[];
  archived?: boolean;
}

export interface SessionEntry {
  exerciseId: string;
  exerciseName: string;
  type: ExerciseType;
  plannedValue: number;
  actualValue: number;
  metValue: number;
  weightKg?: number;
  estimatedCalories: number;
  xpEarned: number;
}

export interface Session {
  id: string;
  date: string; // "YYYY-MM-DD"
  startedAt: number;
  workoutId: string | null; // null = ad-hoc activity
  workoutName: string;
  entries: SessionEntry[];
  effort: Effort;
  bodyWeightKg?: number;
  totalCalories: number;
  totalXp: number;
  createdAt: number;
  updatedAt: number;
}

export interface BodyWeightLog {
  id: string;
  date: string; // "YYYY-MM-DD"
  weightKg: number;
  sessionId?: string | null;
  createdAt: number;
}

export interface EarnedBadge {
  id: string; // `${badgeId}` for lifetime, `${badgeId}_${YYYY-MM}` for monthly
  badgeId: string;
  label: string;
  periodKey?: string; // "2026-09" for monthly badges
  earnedAt: number;
}

export interface UserProfile {
  totalXp: number;
  level: number;
  updatedAt: number;
}
