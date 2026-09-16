import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type {
  Exercise,
  Workout,
  Session,
  BodyWeightLog,
  EarnedBadge,
  UserProfile,
} from "@/types";

// Firestore rejects `undefined` field values, including ones nested inside
// arrays (e.g. SessionEntry.weightKg for unweighted exercises) — strip recursively.
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)]),
    ) as T;
  }
  return value;
}

// ── Exercises ─────────────────────────────────────────────────────────────────
export const subscribeExercises = (cb: (exercises: Exercise[]) => void) =>
  onSnapshot(collection(db, "exercises"), (snap) =>
    cb(
      snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Exercise)
        .sort((a, b) => a.order - b.order),
    ),
  );

export const saveExercise = (exercise: Exercise) =>
  setDoc(doc(db, "exercises", exercise.id), stripUndefined(exercise));

export const deleteExercise = (id: string) => deleteDoc(doc(db, "exercises", id));

// ── Workouts ──────────────────────────────────────────────────────────────────
export const subscribeWorkouts = (cb: (workouts: Workout[]) => void) =>
  onSnapshot(collection(db, "workouts"), (snap) =>
    cb(
      snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Workout)
        .sort((a, b) => a.createdAt - b.createdAt),
    ),
  );

export const saveWorkout = (workout: Workout) =>
  setDoc(doc(db, "workouts", workout.id), stripUndefined(workout));

export const deleteWorkout = (id: string) => deleteDoc(doc(db, "workouts", id));

// ── Sessions ──────────────────────────────────────────────────────────────────
export const subscribeSessions = (cb: (sessions: Session[]) => void) =>
  onSnapshot(collection(db, "sessions"), (snap) =>
    cb(
      snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Session)
        .sort((a, b) => b.startedAt - a.startedAt),
    ),
  );

export const saveSession = (session: Session) =>
  setDoc(doc(db, "sessions", session.id), stripUndefined(session));

export const deleteSession = (id: string) => deleteDoc(doc(db, "sessions", id));

// ── Body weight logs ──────────────────────────────────────────────────────────
export const subscribeBodyWeightLogs = (cb: (logs: BodyWeightLog[]) => void) =>
  onSnapshot(collection(db, "bodyWeightLogs"), (snap) =>
    cb(
      snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as BodyWeightLog)
        .sort((a, b) => a.date.localeCompare(b.date)),
    ),
  );

export const saveBodyWeightLog = (log: BodyWeightLog) =>
  setDoc(doc(db, "bodyWeightLogs", log.id), stripUndefined(log));

export const deleteBodyWeightLog = (id: string) =>
  deleteDoc(doc(db, "bodyWeightLogs", id));

// ── Badges (earned) ───────────────────────────────────────────────────────────
export const subscribeEarnedBadges = (cb: (badges: EarnedBadge[]) => void) =>
  onSnapshot(collection(db, "badges"), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as EarnedBadge)),
  );

export const saveEarnedBadge = (badge: EarnedBadge) =>
  setDoc(doc(db, "badges", badge.id), stripUndefined(badge));

// ── User profile (singleton) ─────────────────────────────────────────────────
export const subscribeUserProfile = (cb: (profile: UserProfile) => void) =>
  onSnapshot(doc(db, "userProfile", "main"), (snap) =>
    cb(
      snap.exists()
        ? (snap.data() as UserProfile)
        : { totalXp: 0, level: 1, updatedAt: Date.now() },
    ),
  );

export const saveUserProfile = (profile: UserProfile) =>
  setDoc(doc(db, "userProfile", "main"), stripUndefined(profile));
