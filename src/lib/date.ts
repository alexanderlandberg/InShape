/** Local-time "YYYY-MM-DD" key, matching how Session.date/BodyWeightLog.date are stored. */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function monthKey(d: Date = new Date()): string {
  return dateKey(d).slice(0, 7); // "YYYY-MM"
}

/** Start of the ISO week (Monday) containing `d`, at local midnight. */
export function startOfWeek(d: Date = new Date()): Date {
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = start.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start;
}

export function startOfMonth(d: Date = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function isDateKeyInRange(key: string, from: Date): boolean {
  return key >= dateKey(from);
}
