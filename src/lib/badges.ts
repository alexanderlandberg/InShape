import type { Session, EarnedBadge } from "@/types";
import { monthKey } from "./date";

type BadgeScope = "lifetime" | "monthly";
type BadgeMetric = "reps" | "kgLifted";

interface BadgeDefinition {
  id: string;
  label: string;
  scope: BadgeScope;
  metric: BadgeMetric;
  exerciseId?: string; // restrict to one exercise; omit for "any exercise" metrics like kgLifted
  threshold: number;
}

// Extend this list to add new milestone badges — no other code changes needed.
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: "pushups_100", label: "100 push-ups", scope: "lifetime", metric: "reps", exerciseId: "pushups", threshold: 100 },
  { id: "crunches_1000", label: "1,000 crunches", scope: "lifetime", metric: "reps", exerciseId: "crunches", threshold: 1000 },
  { id: "situps_1000", label: "1,000 sit-ups", scope: "lifetime", metric: "reps", exerciseId: "situps", threshold: 1000 },
  { id: "squats_500", label: "500 squats", scope: "lifetime", metric: "reps", exerciseId: "squats", threshold: 500 },
  { id: "kg_lifted_10000_lifetime", label: "10,000kg lifted", scope: "lifetime", metric: "kgLifted", threshold: 10000 },
  { id: "kg_lifted_1000_month", label: "1,000kg lifted this month", scope: "monthly", metric: "kgLifted", threshold: 1000 },
];

function sumMetric(
  sessions: Session[],
  def: BadgeDefinition,
  includeSession: (s: Session) => boolean,
): number {
  let total = 0;
  for (const session of sessions) {
    if (!includeSession(session)) continue;
    for (const entry of session.entries) {
      if (def.exerciseId && entry.exerciseId !== def.exerciseId) continue;
      if (def.metric === "reps") {
        if (entry.type === "reps") total += entry.actualValue;
      } else if (entry.weightKg) {
        total += entry.weightKg * entry.actualValue;
      }
    }
  }
  return total;
}

/** All badges that should currently be earned, given the full session history. */
export function evaluateBadges(sessions: Session[]): EarnedBadge[] {
  const now = Date.now();
  const currentMonth = monthKey();
  const earned: EarnedBadge[] = [];

  for (const def of BADGE_DEFINITIONS) {
    if (def.scope === "lifetime") {
      if (sumMetric(sessions, def, () => true) >= def.threshold) {
        earned.push({ id: def.id, badgeId: def.id, label: def.label, earnedAt: now });
      }
    } else {
      const monthTotal = sumMetric(sessions, def, (s) => s.date.startsWith(currentMonth));
      if (monthTotal >= def.threshold) {
        earned.push({
          id: `${def.id}_${currentMonth}`,
          badgeId: def.id,
          label: def.label,
          periodKey: currentMonth,
          earnedAt: now,
        });
      }
    }
  }
  return earned;
}

/** Badges from `evaluateBadges` that aren't already recorded in Firestore. */
export function newlyEarnedBadges(
  candidateBadges: EarnedBadge[],
  alreadyEarned: EarnedBadge[],
): EarnedBadge[] {
  const existingIds = new Set(alreadyEarned.map((b) => b.id));
  return candidateBadges.filter((b) => !existingIds.has(b.id));
}
