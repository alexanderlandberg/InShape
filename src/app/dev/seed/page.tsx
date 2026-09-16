"use client";

import { useState } from "react";
import { saveExercise, saveWorkout } from "@/lib/firestore";
import { SEED_EXERCISES, SEED_WORKOUT_1 } from "@/lib/seed";
import { Button } from "@/components/ui/Button";

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");

  async function runSeed() {
    setStatus("working");
    try {
      await Promise.all(SEED_EXERCISES.map(saveExercise));
      await saveWorkout(SEED_WORKOUT_1);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div>
      <h1 className="page-title">Seed data</h1>
      <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>
        Pushes the 10 seed exercises and &quot;Workout 1&quot; into Firestore. Safe to
        run more than once — each doc has a fixed id, so re-running just overwrites
        with the same values.
      </p>
      <Button variant="primary" block onClick={runSeed} disabled={status === "working"}>
        {status === "working" ? "Seeding…" : "Run seed"}
      </Button>
      {status === "done" && <p style={{ marginTop: "1rem" }}>Done — check /exercises and /workouts.</p>}
      {status === "error" && (
        <p className="text-secondary" style={{ marginTop: "1rem" }}>
          Something went wrong — check the browser console.
        </p>
      )}
    </div>
  );
}
