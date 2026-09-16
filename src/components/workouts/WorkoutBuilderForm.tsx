"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/components/layout/AppDataProvider";
import { saveWorkout, deleteWorkout } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { ExercisePickerModal } from "./ExercisePickerList";
import type { Workout, WorkoutExercise } from "@/types";

interface WorkoutBuilderFormProps {
  initialWorkout?: Workout;
}

export function WorkoutBuilderForm({ initialWorkout }: WorkoutBuilderFormProps) {
  const router = useRouter();
  const { exercises } = useAppData();
  const [name, setName] = useState(initialWorkout?.name ?? "");
  const [items, setItems] = useState<WorkoutExercise[]>(initialWorkout?.exercises ?? []);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const exercisesById = Object.fromEntries(exercises.map((e) => [e.id, e]));
  const canSave = name.trim().length > 0 && items.length > 0 && !saving;

  // Array position is the source of truth for order — always renumber to match it,
  // so `order` can never drift or collide after add/remove/reorder combinations.
  function renumber(list: WorkoutExercise[]): WorkoutExercise[] {
    return list.map((it, i) => ({ ...it, order: i + 1 }));
  }

  function addExercise(exerciseId: string) {
    const exercise = exercisesById[exerciseId];
    const defaultValue = exercise?.type === "duration" ? 15 : 10;
    setItems((prev) => renumber([...prev, { exerciseId, plannedValue: defaultValue, order: 0 }]));
    setPickerOpen(false);
  }

  function updateValue(exerciseId: string, value: number) {
    setItems((prev) =>
      prev.map((it) => (it.exerciseId === exerciseId ? { ...it, plannedValue: value } : it)),
    );
  }

  function removeExercise(exerciseId: string) {
    setItems((prev) => renumber(prev.filter((it) => it.exerciseId !== exerciseId)));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return renumber(next);
    });
  }

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    const id = initialWorkout?.id ?? `workout-${Date.now()}`;
    await saveWorkout({
      id,
      name: name.trim(),
      createdAt: initialWorkout?.createdAt ?? Date.now(),
      exercises: items,
    });
    router.push("/workouts");
  }

  async function handleDelete() {
    if (!initialWorkout) return;
    if (!confirm(`Delete "${initialWorkout.name}"?`)) return;
    await deleteWorkout(initialWorkout.id);
    router.push("/workouts");
  }

  return (
    <div>
      <div className="field">
        <label className="field__label" htmlFor="workout-name">
          Name
        </label>
        <input
          id="workout-name"
          className="field__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Weights only"
        />
      </div>

      <span className="section-label">Exercises</span>
      <div style={{ marginBottom: "1rem" }}>
        {items.length === 0 ? (
          <p className="empty-state">No exercises added yet.</p>
        ) : (
          items.map((item, index) => {
            const exercise = exercisesById[item.exerciseId];
            if (!exercise) return null;
            return (
              <div className="workout-item" key={item.exerciseId}>
                <div className="workout-item__header">
                  <span className="workout-item__name">{exercise.name}</span>
                  <div className="workout-item__actions">
                    <button
                      type="button"
                      className="workout-item__move"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="workout-item__move"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label="Move down"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      className="workout-item__remove"
                      onClick={() => removeExercise(item.exerciseId)}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <NumberStepper
                  value={item.plannedValue}
                  onChange={(v) => updateValue(item.exerciseId, v)}
                  min={exercise.type === "duration" ? 1 : 0}
                />
              </div>
            );
          })
        )}
      </div>

      <Button variant="ghost" block onClick={() => setPickerOpen(true)}>
        + Add exercise
      </Button>

      <Button
        variant="primary"
        block
        onClick={handleSave}
        disabled={!canSave}
        style={{ marginTop: "1.5rem" }}
      >
        {saving ? "Saving…" : "Save Workout"}
      </Button>

      {initialWorkout && (
        <Button variant="danger" block onClick={handleDelete} style={{ marginTop: "0.75rem" }}>
          Delete Workout
        </Button>
      )}

      {pickerOpen && (
        <ExercisePickerModal
          exercises={exercises.filter(
            (e) => !e.archived && !items.some((it) => it.exerciseId === e.id),
          )}
          onSelect={addExercise}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
