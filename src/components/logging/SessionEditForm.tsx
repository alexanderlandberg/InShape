"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/components/layout/AppDataProvider";
import { saveSession, saveUserProfile, saveEarnedBadge } from "@/lib/firestore";
import { buildSessionEntries, adjustProfileXp, type DraftEntry } from "@/lib/sessionBuilder";
import { evaluateBadges, newlyEarnedBadges } from "@/lib/badges";
import { calculateAvgSpeedKmh, FALLBACK_BODY_WEIGHT_KG } from "@/lib/calculations";
import { formatDisplayDate } from "@/lib/date";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { Button } from "@/components/ui/Button";
import { ExercisePickerModal } from "@/components/workouts/ExercisePickerList";
import type { Session } from "@/types";

export function SessionEditForm({ session }: { session: Session }) {
  const router = useRouter();
  const { sessions, exercises, userProfile, earnedBadges } = useAppData();
  const exercisesById = Object.fromEntries(exercises.map((e) => [e.id, e]));

  const [drafts, setDrafts] = useState<DraftEntry[]>(
    session.entries.map((e) => ({
      exerciseId: e.exerciseId,
      plannedValue: e.plannedValue,
      actualValue: e.actualValue,
      distanceKm: e.distanceKm,
      weightKg: e.weightKg,
    })),
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const canSave = drafts.length > 0 && !saving;

  function updateValue(exerciseId: string, actualValue: number) {
    setDrafts((prev) => prev.map((d) => (d.exerciseId === exerciseId ? { ...d, actualValue } : d)));
  }

  function updateDistance(exerciseId: string, distanceKm: number | undefined) {
    setDrafts((prev) => prev.map((d) => (d.exerciseId === exerciseId ? { ...d, distanceKm } : d)));
  }

  function updateWeight(exerciseId: string, weightKg: number | undefined) {
    setDrafts((prev) => prev.map((d) => (d.exerciseId === exerciseId ? { ...d, weightKg } : d)));
  }

  function addExercise(exerciseId: string) {
    const exercise = exercisesById[exerciseId];
    const defaultValue = exercise?.type === "duration" ? 15 : 10;
    setDrafts((prev) => [
      ...prev,
      { exerciseId, plannedValue: defaultValue, actualValue: defaultValue, weightKg: exercise?.weightKg },
    ]);
    setPickerOpen(false);
  }

  function removeExercise(exerciseId: string) {
    setDrafts((prev) => prev.filter((d) => d.exerciseId !== exerciseId));
  }

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    const bodyWeightKg = session.bodyWeightKg ?? FALLBACK_BODY_WEIGHT_KG;
    const { entries, totalCalories, totalXp } = buildSessionEntries(drafts, exercisesById, bodyWeightKg);
    const updatedSession: Session = {
      ...session,
      entries,
      totalCalories,
      totalXp,
      updatedAt: Date.now(),
    };
    await saveSession(updatedSession);

    const { totalXp: newProfileXp, level } = adjustProfileXp(userProfile, session.totalXp, totalXp);
    await saveUserProfile({ totalXp: newProfileXp, level, updatedAt: Date.now() });

    const otherSessions = sessions.filter((s) => s.id !== session.id && !s.archived);
    const candidateBadges = evaluateBadges([...otherSessions, updatedSession]);
    const newBadges = newlyEarnedBadges(candidateBadges, earnedBadges);
    await Promise.all(newBadges.map(saveEarnedBadge));

    router.push("/calendar");
  }

  async function handleArchive() {
    if (!confirm(`Archive this session from ${formatDisplayDate(session.date)}?`)) return;
    setSaving(true);
    const archivedSession: Session = { ...session, archived: true, updatedAt: Date.now() };
    await saveSession(archivedSession);

    const { totalXp: newProfileXp, level } = adjustProfileXp(userProfile, session.totalXp, 0);
    await saveUserProfile({ totalXp: newProfileXp, level, updatedAt: Date.now() });

    router.push("/calendar");
  }

  return (
    <div>
      <p className="text-secondary" style={{ marginBottom: "1rem" }}>
        {formatDisplayDate(session.date)}
      </p>

      {drafts.map((draft) => {
        const exercise = exercisesById[draft.exerciseId];
        if (!exercise) return null;
        const avgSpeed = calculateAvgSpeedKmh(draft.distanceKm, draft.actualValue);
        return (
          <div className="workout-item" key={draft.exerciseId}>
            <div className="workout-item__header">
              <span className="workout-item__name">{exercise.name}</span>
              <button
                type="button"
                className="workout-item__remove"
                onClick={() => removeExercise(draft.exerciseId)}
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
            <NumberStepper
              value={draft.actualValue}
              onChange={(v) => updateValue(draft.exerciseId, v)}
              step={exercise.type === "duration" ? 5 : 1}
            />
            {exercise.trackDistance && (
              <div className="field" style={{ marginTop: "0.75rem" }}>
                <label className="field__label">Distance (km)</label>
                <input
                  className="field__input"
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={draft.distanceKm ?? ""}
                  onChange={(e) =>
                    updateDistance(draft.exerciseId, e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                />
                {avgSpeed !== undefined && (
                  <span className="field__hint">{avgSpeed} km/h avg</span>
                )}
              </div>
            )}
            {exercise.weightKg !== undefined && (
              <div className="field" style={{ marginTop: "0.75rem" }}>
                <label className="field__label">Weight (kg)</label>
                <input
                  className="field__input"
                  type="number"
                  step="0.5"
                  inputMode="decimal"
                  value={draft.weightKg ?? ""}
                  onChange={(e) =>
                    updateWeight(draft.exerciseId, e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                />
              </div>
            )}
          </div>
        );
      })}

      <Button variant="ghost" block onClick={() => setPickerOpen(true)} style={{ marginTop: "0.75rem" }}>
        + Add exercise
      </Button>

      <Button variant="primary" block onClick={handleSave} disabled={!canSave} style={{ marginTop: "1.5rem" }}>
        {saving ? "Saving…" : "Save Changes"}
      </Button>
      <Button variant="danger" block onClick={handleArchive} disabled={saving} style={{ marginTop: "0.75rem" }}>
        Archive Session
      </Button>

      {pickerOpen && (
        <ExercisePickerModal
          exercises={exercises.filter(
            (e) => !e.archived && !drafts.some((d) => d.exerciseId === e.id),
          )}
          onSelect={addExercise}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
