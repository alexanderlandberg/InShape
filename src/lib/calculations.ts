import type { Exercise } from "@/types";

const DEFAULT_SECONDS_PER_REP = 3;
export const FALLBACK_BODY_WEIGHT_KG = 75;
export const XP_PER_SECOND = 0.5;

export function estimateDurationHours(actualValue: number, exercise: Exercise): number {
  if (exercise.type === "duration") return actualValue / 60;
  const secondsPerRep = exercise.secondsPerRep ?? DEFAULT_SECONDS_PER_REP;
  return (actualValue * secondsPerRep) / 3600;
}

export function calculateCalories(
  actualValue: number,
  exercise: Exercise,
  bodyWeightKg: number,
): number {
  const hours = estimateDurationHours(actualValue, exercise);
  return Math.round(exercise.metValue * bodyWeightKg * hours * 10) / 10;
}

export function calculateXp(actualValue: number, exercise: Exercise): number {
  return Math.round(estimateDurationHours(actualValue, exercise) * 3600 * XP_PER_SECOND);
}

/** XP required to clear the given level (RPG-style scaling: costlier each level). */
export function xpForLevel(level: number): number {
  return Math.round(50 * Math.pow(level, 1.5));
}

export interface LevelState {
  level: number;
  xpIntoLevel: number;
  xpToNext: number;
}

export function levelFromTotalXp(totalXp: number): LevelState {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return { level, xpIntoLevel: remaining, xpToNext: xpForLevel(level) };
}

/** Kilos lifted for a single entry (weight × reps), or 0 for unweighted/duration exercises. */
export function kgLifted(actualValue: number, exercise: Exercise): number {
  if (exercise.type !== "reps" || !exercise.weightKg) return 0;
  return exercise.weightKg * actualValue;
}
