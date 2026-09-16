"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppData } from "@/components/layout/AppDataProvider";
import { LevelRing } from "@/components/stats/LevelRing";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { BodyWeightQuickInput } from "@/components/logging/BodyWeightQuickInput";
import { saveBodyWeightLog } from "@/lib/firestore";
import { levelFromTotalXp } from "@/lib/calculations";
import { overallTotals } from "@/lib/stats";
import { startOfWeek, isDateKeyInRange, dateKey } from "@/lib/date";

export default function HomePage() {
  const { sessions, bodyWeightLogs, userProfile, loading } = useAppData();
  const [weightModalOpen, setWeightModalOpen] = useState(false);

  if (loading) return <p className="empty-state">Loading…</p>;

  const { xpIntoLevel, xpToNext } = levelFromTotalXp(userProfile.totalXp);
  const weekStart = startOfWeek();
  const weekSessions = sessions.filter((s) => !s.archived && isDateKeyInRange(s.date, weekStart));
  const weekTotals = overallTotals(weekSessions);
  const lastWeightKg =
    bodyWeightLogs.length > 0 ? bodyWeightLogs[bodyWeightLogs.length - 1].weightKg : undefined;

  async function handleWeightSubmit(weightKg: number | undefined) {
    if (weightKg) {
      await saveBodyWeightLog({
        id: `weight-${Date.now()}`,
        date: dateKey(),
        weightKg,
        sessionId: null,
        createdAt: Date.now(),
      });
    }
    setWeightModalOpen(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0 1.5rem" }}>
        <LevelRing level={userProfile.level} xpIntoLevel={xpIntoLevel} xpToNext={xpToNext} size={140} />
      </div>

      <div className="stat-summary">
        <div className="stat-summary__tile">
          <div className="stat-summary__value">{weekTotals.workoutCount}</div>
          <div className="stat-summary__label">Sessions this week</div>
        </div>
        <div className="stat-summary__tile">
          <div className="stat-summary__value">{weekTotals.totalCalories}</div>
          <div className="stat-summary__label">Kcal this week</div>
        </div>
      </div>

      <Link href="/log">
        <Button variant="primary" size="lg" block style={{ marginBottom: "0.75rem" }}>
          Start Workout
        </Button>
      </Link>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <Link href="/log/activity/biking" style={{ flex: 1 }}>
          <Button variant="ghost" block>
            🚴 Biking
          </Button>
        </Link>
        <Link href="/log/activity/vr_gaming" style={{ flex: 1 }}>
          <Button variant="ghost" block>
            🎮 VR
          </Button>
        </Link>
      </div>

      <Button variant="ghost" block onClick={() => setWeightModalOpen(true)}>
        + Log weight
      </Button>

      {weightModalOpen && (
        <Modal title="Log weight" onClose={() => setWeightModalOpen(false)}>
          <BodyWeightQuickInput lastWeightKg={lastWeightKg} onSubmit={handleWeightSubmit} />
        </Modal>
      )}
    </div>
  );
}
