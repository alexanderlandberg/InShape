"use client";

import { use } from "react";
import { useAppData } from "@/components/layout/AppDataProvider";
import { SessionEditForm } from "@/components/logging/SessionEditForm";

export default function EditSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const { sessions, loading } = useAppData(); // unfiltered — archived sessions must still resolve here
  const session = sessions.find((s) => s.id === sessionId);

  if (loading) return <p className="empty-state">Loading…</p>;
  if (!session) return <p className="empty-state">Session not found.</p>;

  return (
    <div>
      <h1 className="page-title">Edit Session</h1>
      <SessionEditForm session={session} />
    </div>
  );
}
