"use client";

import { useState } from "react";
import { dateKey } from "@/lib/date";

interface MonthGridProps {
  markedDates: Set<string>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function MonthGrid({ markedDates, selectedDate, onSelectDate }: MonthGridProps) {
  const [cursor, setCursor] = useState(() => new Date());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const today = dateKey();

  return (
    <div className="month-grid">
      <div className="month-grid__header">
        <button
          type="button"
          className="month-grid__nav"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="month-grid__label">{monthLabel}</span>
        <button
          type="button"
          className="month-grid__nav"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="month-grid__weekdays">
        {WEEKDAY_LABELS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="month-grid__days">
        {cells.map((date, i) => {
          if (!date) return <span key={i} />;
          const key = dateKey(date);
          const marked = markedDates.has(key);
          const classes = [
            "month-grid__day",
            marked ? "month-grid__day--marked" : "",
            key === selectedDate ? "month-grid__day--selected" : "",
            key === today ? "month-grid__day--today" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button type="button" key={i} className={classes} onClick={() => onSelectDate(key)}>
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
