"use client";

import { useMemo, useReducer, useState } from "react";
import { useAppData } from "@/components/layout/AppDataProvider";
import {
  saveSession,
  saveBodyWeightLog,
  saveUserProfile,
  saveEarnedBadge,
} from "@/lib/firestore";
import { FALLBACK_BODY_WEIGHT_KG } from "@/lib/calculations";
import { computePersonalBests } from "@/lib/stats";
import { evaluateBadges, newlyEarnedBadges } from "@/lib/badges";
import { dateKey } from "@/lib/date";
import { buildSessionEntries, adjustProfileXp, type DraftEntry } from "@/lib/sessionBuilder";
import { ExerciseStepCard } from "./ExerciseStepCard";
import { BodyWeightQuickInput } from "./BodyWeightQuickInput";
import { SessionSummary } from "./SessionSummary";
import type { Exercise, Session, SessionEntry, EarnedBadge } from "@/types";

interface SessionRunnerProps {
  workoutId: string | null;
  workoutName: string;
  exercisesInSession: { exercise: Exercise; plannedValue: number }[];
}

type Phase = "logging" | "bodyweight" | "saving" | "summary";

interface State {
  phase: Phase;
  stepIndex: number;
  entries: DraftEntry[];
}

type Action =
  | { type: "SET_VALUE"; exerciseId: string; value: number }
  | { type: "SET_DISTANCE"; exerciseId: string; distanceKm: number | undefined }
  | { type: "SET_WEIGHT"; exerciseId: string; weightKg: number | undefined }
  | { type: "GO_TO_STEP"; index: number }
  | { type: "NEXT_STEP" }
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
    case "SET_DISTANCE":
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.exerciseId === action.exerciseId ? { ...e, distanceKm: action.distanceKm } : e,
        ),
      };
    case "SET_WEIGHT":
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.exerciseId === action.exerciseId ? { ...e, weightKg: action.weightKg } : e,
        ),
      };
    case "GO_TO_STEP":
      return { ...state, stepIndex: action.index, phase: "logging" };
    case "NEXT_STEP": {
      const nextIndex = state.stepIndex + 1;
      if (nextIndex >= state.entries.length) return { ...state, phase: "bodyweight" };
      return { ...state, stepIndex: nextIndex };
    }
    case "GO_TO_SAVING":
      return { ...state, phase: "saving" };
    case "GO_TO_SUMMARY":
      return { ...state, phase: "summary" };
    default:
      return state;
  }
}

interface SaveResult {
  entries: SessionEntry[];
  totalCalories: number;
  totalXp: number;
  leveledUp: boolean;
  newLevel: number;
  newBadges: EarnedBadge[];
  newPBs: SessionEntry[];
}

export function SessionRunner({ workoutId, workoutName, exercisesInSession }: SessionRunnerProps) {
  const { sessions: allSessions, bodyWeightLogs, userProfile, earnedBadges } = useAppData();
  const sessions = useMemo(() => allSessions.filter((s) => !s.archived), [allSessions]);
  const [state, dispatch] = useReducer(reducer, {
    phase: "logging",
    stepIndex: 0,
    entries: exercisesInSession.map(({ exercise, plannedValue }) => ({
      exerciseId: exercise.id,
      plannedValue,
      actualValue: plannedValue,
      weightKg: exercise.weightKg,
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

    const { entries: sessionEntries, totalCalories, totalXp } = buildSessionEntries(
      state.entries,
      exercisesById,
      bodyWeightKg,
    );

    const now = Date.now();
    const sessionId = `session-${now}`;

    const newSession: Session = {
      id: sessionId,
      date: dateKey(),
      startedAt: now,
      workoutId,
      workoutName,
      entries: sessionEntries,
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

    const { totalXp: newTotalXp, level, leveledUp } = adjustProfileXp(userProfile, 0, totalXp);
    await saveUserProfile({ totalXp: newTotalXp, level, updatedAt: now });

    const candidateBadges = evaluateBadges([...sessions, newSession]);
    const newBadges = newlyEarnedBadges(candidateBadges, earnedBadges);
    await Promise.all(newBadges.map(saveEarnedBadge));

    const newPBs = sessionEntries.filter(
      (e) => !previousBests[e.exerciseId] || e.actualValue > previousBests[e.exerciseId],
    );

    setResult({ entries: sessionEntries, totalCalories, totalXp, leveledUp, newLevel: level, newBadges, newPBs });
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
        distanceKm={draft.distanceKm}
        onDistanceChange={(distanceKm) =>
          dispatch({ type: "SET_DISTANCE", exerciseId: draft.exerciseId, distanceKm })
        }
        weightKg={draft.weightKg}
        onWeightChange={(weightKg) =>
          dispatch({ type: "SET_WEIGHT", exerciseId: draft.exerciseId, weightKg })
        }
        personalBest={personalBests[draft.exerciseId]}
        onDone={() => dispatch({ type: "NEXT_STEP" })}
        currentIndex={state.stepIndex}
        totalSteps={state.entries.length}
      />
    );
  }

  if (state.phase === "bodyweight") {
    return <BodyWeightQuickInput lastWeightKg={lastWeightKg} onSubmit={finishSession} />;
  }

  if (state.phase === "saving" || !result) {
    return <p className="empty-state">Saving…</p>;
  }

  return (
    <SessionSummary
      entries={result.entries}
      totalCalories={result.totalCalories}
      totalXp={result.totalXp}
      leveledUp={result.leveledUp}
      newLevel={result.newLevel}
      newBadges={result.newBadges}
      newPBs={result.newPBs}
    />
  );
}
