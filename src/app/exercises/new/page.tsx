"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/components/layout/AppDataProvider";
import { saveExercise } from "@/lib/firestore";
import { slugify } from "@/lib/slug";
import { Button } from "@/components/ui/Button";
import type { Equipment, ExerciseType } from "@/types";

export default function NewExercisePage() {
  const router = useRouter();
  const { exercises } = useAppData();
  const [name, setName] = useState("");
  const [type, setType] = useState<ExerciseType>("reps");
  const [equipment, setEquipment] = useState<Equipment>("none");
  const [metValue, setMetValue] = useState("4.0");
  const [weightKg, setWeightKg] = useState("");
  const [saving, setSaving] = useState(false);

  const canSave = name.trim().length > 0 && !saving;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    const id = slugify(name);
    const order = exercises.length > 0 ? Math.max(...exercises.map((e) => e.order)) + 1 : 1;
    await saveExercise({
      id,
      name: name.trim(),
      type,
      equipment,
      metValue: parseFloat(metValue) || 4,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      order,
    });
    router.push("/exercises");
  }

  return (
    <div>
      <h1 className="page-title">Add Exercise</h1>

      <div className="field">
        <label className="field__label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          className="field__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Lunges"
        />
      </div>

      <div className="field">
        <span className="field__label">Type</span>
        <div className="radio-group">
          <button
            type="button"
            className={`radio-group__option${type === "reps" ? " radio-group__option--selected" : ""}`}
            onClick={() => setType("reps")}
          >
            Reps
          </button>
          <button
            type="button"
            className={`radio-group__option${type === "duration" ? " radio-group__option--selected" : ""}`}
            onClick={() => setType("duration")}
          >
            Duration
          </button>
        </div>
      </div>

      <div className="field">
        <span className="field__label">Equipment</span>
        <div className="radio-group">
          <button
            type="button"
            className={`radio-group__option${equipment === "none" ? " radio-group__option--selected" : ""}`}
            onClick={() => setEquipment("none")}
          >
            None
          </button>
          <button
            type="button"
            className={`radio-group__option${equipment === "weights" ? " radio-group__option--selected" : ""}`}
            onClick={() => setEquipment("weights")}
          >
            Weights
          </button>
        </div>
      </div>

      {equipment === "weights" && (
        <div className="field">
          <label className="field__label" htmlFor="weightKg">
            Weight per rep (kg)
          </label>
          <input
            id="weightKg"
            className="field__input"
            type="number"
            inputMode="decimal"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="10"
          />
        </div>
      )}

      <div className="field">
        <label className="field__label" htmlFor="metValue">
          MET value
        </label>
        <input
          id="metValue"
          className="field__input"
          type="number"
          inputMode="decimal"
          step="0.1"
          value={metValue}
          onChange={(e) => setMetValue(e.target.value)}
        />
        <span className="field__hint">
          Rough intensity factor used for calorie estimates — bodyweight moves are
          usually 3.5–8, weighted moves 3.5–5, cardio 6–9.
        </span>
      </div>

      <Button variant="primary" block onClick={handleSave} disabled={!canSave}>
        {saving ? "Saving…" : "Save Exercise"}
      </Button>
    </div>
  );
}
