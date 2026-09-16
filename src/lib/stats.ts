import type { Session } from "@/types";
import { startOfWeek, startOfMonth, isDateKeyInRange } from "./date";

export type StatsRange = "week" | "month" | "all";

export interface ExerciseTotals {
  exerciseId: string;
  totalActual: number; // sum of reps, or minutes for duration-based exercises
  sessionCount: number;
}

function rangeStart(range: StatsRange): Date | null {
  if (range === "week") return startOfWeek();
  if (range === "month") return startOfMonth();
  return null;
}

export function aggregateByExercise(
  sessions: Session[],
  range: StatsRange,
): Record<string, ExerciseTotals> {
  const start = rangeStart(range);
  const totals: Record<string, ExerciseTotals> = {};
  for (const session of sessions) {
    if (start && !isDateKeyInRange(session.date, start)) continue;
    for (const entry of session.entries) {
      const existing = totals[entry.exerciseId] ?? {
        exerciseId: entry.exerciseId,
        totalActual: 0,
        sessionCount: 0,
      };
      existing.totalActual += entry.actualValue;
      existing.sessionCount += 1;
      totals[entry.exerciseId] = existing;
    }
  }
  return totals;
}

function entryKgLifted(entry: Session["entries"][number]): number {
  if (entry.type !== "reps" || !entry.weightKg) return 0;
  return entry.weightKg * entry.actualValue;
}

export interface OverallTotals {
  workoutCount: number;
  totalCalories: number;
  totalKgLifted: number;
  bikingMinutes: number;
  totalBikingKm: number;
}

export function overallTotals(sessions: Session[]): OverallTotals {
  let totalCalories = 0;
  let totalKgLifted = 0;
  let bikingMinutes = 0;
  let totalBikingKm = 0;
  for (const session of sessions) {
    totalCalories += session.totalCalories;
    for (const entry of session.entries) {
      totalKgLifted += entryKgLifted(entry);
      if (entry.exerciseId === "biking") {
        bikingMinutes += entry.actualValue;
        totalBikingKm += entry.distanceKm ?? 0;
      }
    }
  }
  return {
    workoutCount: sessions.length,
    totalCalories: Math.round(totalCalories),
    totalKgLifted: Math.round(totalKgLifted),
    bikingMinutes,
    totalBikingKm: Math.round(totalBikingKm * 10) / 10,
  };
}

/** Highest actualValue ever logged for each exercise, across all sessions. */
export function computePersonalBests(sessions: Session[]): Record<string, number> {
  const bests: Record<string, number> = {};
  for (const session of sessions) {
    for (const entry of session.entries) {
      if (!bests[entry.exerciseId] || entry.actualValue > bests[entry.exerciseId]) {
        bests[entry.exerciseId] = entry.actualValue;
      }
    }
  }
  return bests;
}
