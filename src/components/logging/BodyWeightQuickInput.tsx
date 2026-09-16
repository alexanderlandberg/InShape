"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface BodyWeightQuickInputProps {
  lastWeightKg?: number;
  onSubmit: (weightKg: number | undefined) => void;
}

export function BodyWeightQuickInput({ lastWeightKg, onSubmit }: BodyWeightQuickInputProps) {
  const [weight, setWeight] = useState(lastWeightKg ? String(lastWeightKg) : "");

  return (
    <div className="text-center" style={{ padding: "2rem 0" }}>
      <h2 className="page-title text-center">Log your weight?</h2>
      <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>
        Optional — just here so you can eyeball trends over time.
      </p>
      <div className="field">
        <input
          className="field__input"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 82.5"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={{ textAlign: "center", fontSize: "1.5rem" }}
        />
      </div>
      <Button
        variant="primary"
        block
        onClick={() => onSubmit(weight ? parseFloat(weight) : undefined)}
        style={{ marginBottom: "0.75rem" }}
      >
        Save
      </Button>
      <Button variant="ghost" block onClick={() => onSubmit(undefined)}>
        Skip
      </Button>
    </div>
  );
}
