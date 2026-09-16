"use client";

import { useMemo, useState } from "react";
import { useAppData } from "@/components/layout/AppDataProvider";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { DayDetailPanel } from "@/components/calendar/DayDetailPanel";

export default function CalendarPage() {
  const { sessions, loading } = useAppData();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const markedDates = useMemo(() => new Set(sessions.map((s) => s.date)), [sessions]);

  if (loading) return <p className="empty-state">Loading…</p>;

  const sessionsForSelected = selectedDate ? sessions.filter((s) => s.date === selectedDate) : [];

  return (
    <div>
      <h1 className="page-title">Calendar</h1>
      <MonthGrid markedDates={markedDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      {selectedDate && (
        <DayDetailPanel
          date={selectedDate}
          sessions={sessionsForSelected}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
