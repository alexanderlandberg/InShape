"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  subscribeExercises,
  subscribeWorkouts,
  subscribeSessions,
  subscribeBodyWeightLogs,
  subscribeEarnedBadges,
  subscribeUserProfile,
} from "@/lib/firestore";
import type {
  Exercise,
  Workout,
  Session,
  BodyWeightLog,
  EarnedBadge,
  UserProfile,
} from "@/types";

interface AppData {
  exercises: Exercise[];
  workouts: Workout[];
  sessions: Session[];
  bodyWeightLogs: BodyWeightLog[];
  earnedBadges: EarnedBadge[];
  userProfile: UserProfile;
  loading: boolean;
}

const DEFAULT_PROFILE: UserProfile = { totalXp: 0, level: 1, updatedAt: Date.now() };

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [bodyWeightLogs, setBodyWeightLogs] = useState<BodyWeightLog[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loadedFlags, setLoadedFlags] = useState({
    exercises: false,
    workouts: false,
    sessions: false,
    bodyWeightLogs: false,
    earnedBadges: false,
    userProfile: false,
  });

  useEffect(() => {
    const unsubscribers = [
      subscribeExercises((v) => {
        setExercises(v);
        setLoadedFlags((f) => ({ ...f, exercises: true }));
      }),
      subscribeWorkouts((v) => {
        setWorkouts(v);
        setLoadedFlags((f) => ({ ...f, workouts: true }));
      }),
      subscribeSessions((v) => {
        setSessions(v);
        setLoadedFlags((f) => ({ ...f, sessions: true }));
      }),
      subscribeBodyWeightLogs((v) => {
        setBodyWeightLogs(v);
        setLoadedFlags((f) => ({ ...f, bodyWeightLogs: true }));
      }),
      subscribeEarnedBadges((v) => {
        setEarnedBadges(v);
        setLoadedFlags((f) => ({ ...f, earnedBadges: true }));
      }),
      subscribeUserProfile((v) => {
        setUserProfile(v);
        setLoadedFlags((f) => ({ ...f, userProfile: true }));
      }),
    ];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  const loading = Object.values(loadedFlags).some((v) => !v);

  return (
    <AppDataContext.Provider
      value={{ exercises, workouts, sessions, bodyWeightLogs, earnedBadges, userProfile, loading }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
