"use client";

import { useAppData } from "@/components/layout/AppDataProvider";
import { LevelRing } from "@/components/stats/LevelRing";
import { ExerciseStatsTable } from "@/components/stats/ExerciseStatsTable";
import { BadgeGrid } from "@/components/stats/BadgeGrid";
import { BodyWeightChart } from "@/components/stats/BodyWeightChart";
import { overallTotals } from "@/lib/stats";
import { levelFromTotalXp } from "@/lib/calculations";

export default function StatsPage() {
  const { sessions, exercises, earnedBadges, bodyWeightLogs, userProfile, loading } = useAppData();

  if (loading) return <p className="empty-state">Loading…</p>;

  const totals = overallTotals(sessions);
  const { xpIntoLevel, xpToNext } = levelFromTotalXp(userProfile.totalXp);

  return (
    <div>
      <h1 className="page-title">Stats</h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <LevelRing level={userProfile.level} xpIntoLevel={xpIntoLevel} xpToNext={xpToNext} size={120} />
      </div>

      <div className="stat-summary">
        <div className="stat-summary__tile">
          <div className="stat-summary__value">{totals.workoutCount}</div>
          <div className="stat-summary__label">Sessions</div>
        </div>
        <div className="stat-summary__tile">
          <div className="stat-summary__value">{totals.totalCalories}</div>
          <div className="stat-summary__label">Kcal</div>
        </div>
        <div className="stat-summary__tile">
          <div className="stat-summary__value">{totals.totalKgLifted}</div>
          <div className="stat-summary__label">Kg Lifted</div>
        </div>
        <div className="stat-summary__tile">
          <div className="stat-summary__value">{totals.bikingMinutes + totals.vrMinutes}</div>
          <div className="stat-summary__label">Bike + VR min</div>
        </div>
      </div>

      <span className="section-label">Per-exercise totals</span>
      <ExerciseStatsTable sessions={sessions} exercises={exercises} />

      <span className="section-label" style={{ marginTop: "1.5rem" }}>
        Badges
      </span>
      <BadgeGrid earnedBadges={earnedBadges} />

      <span className="section-label" style={{ marginTop: "1.5rem" }}>
        Body weight
      </span>
      <BodyWeightChart logs={bodyWeightLogs} />
    </div>
  );
}
