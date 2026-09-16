import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { calculateAvgSpeedKmh } from "@/lib/calculations";
import type { SessionEntry, EarnedBadge } from "@/types";

interface SessionSummaryProps {
  entries: SessionEntry[];
  totalCalories: number;
  totalXp: number;
  leveledUp: boolean;
  newLevel: number;
  newBadges: EarnedBadge[];
  newPBs: SessionEntry[];
}

export function SessionSummary({
  entries,
  totalCalories,
  totalXp,
  leveledUp,
  newLevel,
  newBadges,
  newPBs,
}: SessionSummaryProps) {
  const distanceEntries = entries.filter((e) => e.distanceKm !== undefined);
  return (
    <div className="text-center" style={{ padding: "2rem 0" }}>
      <h2 className="page-title text-center">Session Complete 🎉</h2>
      <p className="text-accent" style={{ fontSize: "2.5rem", fontWeight: 800 }}>
        +{totalXp} XP
      </p>
      <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>
        ~{totalCalories} kcal estimated
      </p>

      {leveledUp && (
        <p className="text-gold" style={{ fontWeight: 700, marginBottom: "1.5rem" }}>
          Level up! You&apos;re now level {newLevel} 🎊
        </p>
      )}

      {distanceEntries.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="section-label">Distance</span>
          {distanceEntries.map((e) => {
            const avgSpeed = calculateAvgSpeedKmh(e.distanceKm, e.actualValue);
            return (
              <p key={e.exerciseId}>
                {e.exerciseName}: {e.distanceKm}km{avgSpeed !== undefined ? ` · ${avgSpeed} km/h avg` : ""}
              </p>
            );
          })}
        </div>
      )}

      {newPBs.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="section-label">New personal bests</span>
          {newPBs.map((pb) => (
            <p key={pb.exerciseId}>
              {pb.exerciseName}: {pb.actualValue}
            </p>
          ))}
        </div>
      )}

      {newBadges.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="section-label">Badges unlocked</span>
          {newBadges.map((b) => (
            <p key={b.id}>🏅 {b.label}</p>
          ))}
        </div>
      )}

      <Link href="/">
        <Button variant="primary" block size="lg">
          Done
        </Button>
      </Link>
    </div>
  );
}
