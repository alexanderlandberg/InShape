"use client";

import { useMemo, useReducer, useState } from "react";
import { useAppData } from "@/components/layout/AppDataProvider";
import {
  saveSession,
  saveBodyWeightLog,
  saveUserProfile,
  saveEarnedBadge,
} from "@/lib/firestore";
import {
  calculateCalories,
  calculateXp,
  levelFromTotalXp,
  FALLBACK_BODY_WEIGHT_KG,
} from "@/lib/calculations";
import { computePersonalBests } from "@/lib/stats";
import { evaluateBadges, newlyEarnedBadges } from "@/lib/badges";
import { dateKey } from "@/lib/date";
import { ExerciseStepCard } from "./ExerciseStepCard";
import { EffortRatingPicker } from "./EffortRatingPicker";
import { BodyWeightQuickInput } from "./BodyWeightQuickInput";
import { SessionSummary } from "./SessionSummary";
import type { Exercise, Effort, Session, SessionEntry, EarnedBadge } from "@/types";

interface SessionRunnerProps {
  workoutId: string | null;
  workoutName: string;
  exercisesInSession: { exercise: Exercise; plannedValue: number }[];
}

type Phase = "logging" | "effort" | "bodyweight" | "saving" | "summary";

interface DraftEntry {
  exerciseId: string;
  plannedValue: number;
  actualValue: number;
}

interface State {
  phase: Phase;
  stepIndex: number;
  entries: DraftEntry[];
  effort: Effort | null;
}

type Action =
  | { type: "SET_VALUE"; exerciseId: string; value: number }
  | { type: "GO_TO_STEP"; index: number }
  | { type: "NEXT_STEP" }
  | { type: "SET_EFFORT"; effort: Effort }
  | { type: "GO_TO_SAVING" }
  | { type: "GO_TO_SUMMARY" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.exerciseId === action.exerciseId ? { ...e, actualValue: action.value } : e,
        ),
      };
    case "GO_TO_STEP":
      return { ...state, stepIndex: action.index, phase: "logging" };
    case "NEXT_STEP": {
      const nextIndex = state.stepIndex + 1;
      if (nextIndex >= state.entries.length) return { ...state, phase: "effort" };
      return { ...state, stepIndex: nextIndex };
    }
    case "SET_EFFORT":
      return { ...state, effort: action.effort, phase: "bodyweight" };
    case "GO_TO_SAVING":
      return { ...state, phase: "saving" };
    case "GO_TO_SUMMARY":
      return { ...state, phase: "summary" };
    default:
      return state;
  }
}

interface SaveResult {
  totalCalories: number;
  totalXp: number;
  leveledUp: boolean;
  newLevel: number;
  newBadges: EarnedBadge[];
  newPBs: SessionEntry[];
}

export function SessionRunner({ workoutId, workoutName, exercisesInSession }: SessionRunnerProps) {
  const { sessions, bodyWeightLogs, userProfile, earnedBadges } = useAppData();
  const [state, dispatch] = useReducer(reducer, {
    phase: "logging",
    stepIndex: 0,
    effort: null,
    entries: exercisesInSession.map(({ exercise, plannedValue }) => ({
      exerciseId: exercise.id,
      plannedValue,
      actualValue: plannedValue,
    })),
  });
  const [result, setResult] = useState<SaveResult | null>(null);

  const exercisesById = useMemo(
    () => Object.fromEntries(exercisesInSession.map(({ exercise }) => [exercise.id, exercise])),
    [exercisesInSession],
  );
  const personalBests = useMemo(() => computePersonalBests(sessions), [sessions]);
  const lastWeightKg = bodyWeightLogs.length > 0 ? bodyWeightLogs[bodyWeightLogs.length - 1].weightKg : undefined;

  async function finishSession(enteredWeightKg: number | undefined) {
    dispatch({ type: "GO_TO_SAVING" });

    const bodyWeightKg = enteredWeightKg ?? lastWeightKg ?? FALLBACK_BODY_WEIGHT_KG;
    const previousBests = computePersonalBests(sessions);

    const sessionEntries: SessionEntry[] = state.entries.map((draft) => {
      const exercise = exercisesById[draft.exerciseId];
      return {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        type: exercise.type,
        plannedValue: draft.plannedValue,
        actualValue: draft.actualValue,
        metValue: exercise.metValue,
        weightKg: exercise.weightKg,
        estimatedCalories: calculateCalories(draft.actualValue, exercise, bodyWeightKg),
        xpEarned: calculateXp(draft.actualValue, exercise),
      };
    });

    const totalCalories = Math.round(sessionEntries.reduce((sum, e) => sum + e.estimatedCalories, 0));
    const totalXp = sessionEntries.reduce((sum, e) => sum + e.xpEarned, 0);
    const now = Date.now();
    const sessionId = `session-${now}`;

    const newSession: Session = {
      id: sessionId,
      date: dateKey(),
      startedAt: now,
      workoutId,
      workoutName,
      entries: sessionEntries,
      effort: state.effort ?? "medium",
      bodyWeightKg: enteredWeightKg,
      totalCalories,
      totalXp,
      createdAt: now,
      updatedAt: now,
    };

    await saveSession(newSession);

    if (enteredWeightKg) {
      await saveBodyWeightLog({
        id: `weight-${now}`,
        date: dateKey(),
        weightKg: enteredWeightKg,
        sessionId,
        createdAt: now,
      });
    }

    const newTotalXp = userProfile.totalXp + totalXp;
    const { level } = levelFromTotalXp(newTotalXp);
    const leveledUp = level > userProfile.level;
    await saveUserProfile({ totalXp: newTotalXp, level, updatedAt: now });

    const candidateBadges = evaluateBadges([...sessions, newSession]);
    const newBadges = newlyEarnedBadges(candidateBadges, earnedBadges);
    await Promise.all(newBadges.map(saveEarnedBadge));

    const newPBs = sessionEntries.filter(
      (e) => !previousBests[e.exerciseId] || e.actualValue > previousBests[e.exerciseId],
    );

    setResult({ totalCalories, totalXp, leveledUp, newLevel: level, newBadges, newPBs });
    dispatch({ type: "GO_TO_SUMMARY" });
  }

  if (state.phase === "logging") {
    const draft = state.entries[state.stepIndex];
    const exercise = exercisesById[draft.exerciseId];
    return (
      <ExerciseStepCard
        exercise={exercise}
        value={draft.actualValue}
        onChange={(value) => dispatch({ type: "SET_VALUE", exerciseId: draft.exerciseId, value })}
        personalBest={personalBests[draft.exerciseId]}
        onDone={() => dispatch({ type: "NEXT_STEP" })}
        currentIndex={state.stepIndex}
        totalSteps={state.entries.length}
      />
    );
  }

  if (state.phase === "effort") {
    return <EffortRatingPicker onSelect={(effort) => dispatch({ type: "SET_EFFORT", effort })} />;
  }

  if (state.phase === "bodyweight") {
    return <BodyWeightQuickInput lastWeightKg={lastWeightKg} onSubmit={finishSession} />;
  }

  if (state.phase === "saving" || !result) {
    return <p className="empty-state">Saving…</p>;
  }

  return (
    <SessionSummary
      totalCalories={result.totalCalories}
      totalXp={result.totalXp}
      leveledUp={result.leveledUp}
      newLevel={result.newLevel}
      newBadges={result.newBadges}
      newPBs={result.newPBs}
    />
  );
}
