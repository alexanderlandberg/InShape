"use client";

import { useAppData } from "@/components/layout/AppDataProvider";
import { SessionList } from "@/components/calendar/SessionList";

export default function CalendarPage() {
  const { sessions: allSessions, loading } = useAppData();
  const sessions = allSessions.filter((s) => !s.archived);

  if (loading) return <p className="empty-state">Loading…</p>;

  return (
    <div>
      <h1 className="page-title">History</h1>
      <SessionList sessions={sessions} />
    </div>
  );
}
