import type { Exercise, SessionEntry, UserProfile } from "@/types";
import { calculateCalories, calculateXp, levelFromTotalXp } from "./calculations";

export interface DraftEntry {
  exerciseId: string;
  plannedValue: number;
  actualValue: number;
  distanceKm?: number;
}

export interface BuiltEntries {
  entries: SessionEntry[];
  totalCalories: number;
  totalXp: number;
}

/**
 * Turns draft entries into saved SessionEntry[] + totals. Shared by the create
 * (SessionRunner) and edit (SessionEditForm) flows so the calorie/XP math can't
 * drift between them.
 */
export function buildSessionEntries(
  drafts: DraftEntry[],
  exercisesById: Record<string, Exercise>,
  bodyWeightKg: number,
): BuiltEntries {
  const entries: SessionEntry[] = drafts.map((draft) => {
    const exercise = exercisesById[draft.exerciseId];
    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      type: exercise.type,
      plannedValue: draft.plannedValue,
      actualValue: draft.actualValue,
      metValue: exercise.metValue,
      weightKg: exercise.weightKg,
      distanceKm: draft.distanceKm,
      estimatedCalories: calculateCalories(draft.actualValue, exercise, bodyWeightKg),
      xpEarned: calculateXp(draft.actualValue, exercise),
    };
  });
  const totalCalories = Math.round(entries.reduce((sum, e) => sum + e.estimatedCalories, 0));
  const totalXp = entries.reduce((sum, e) => sum + e.xpEarned, 0);
  return { entries, totalCalories, totalXp };
}

export interface XpAdjustResult {
  totalXp: number;
  level: number;
  leveledUp: boolean;
}

/**
 * Adjusts the stored cumulative profile XP by (newXp - oldXp) and recomputes level.
 * oldXp=0 for a brand-new session; newXp=0 when archiving (fully backing out).
 */
export function adjustProfileXp(
  profile: UserProfile,
  oldXp: number,
  newXp: number,
): XpAdjustResult {
  const totalXp = profile.totalXp - oldXp + newXp;
  const { level } = levelFromTotalXp(totalXp);
  return { totalXp, level, leveledUp: level > profile.level };
}
