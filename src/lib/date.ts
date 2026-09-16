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

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function ordinalSuffix(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/**
 * "YYYY-MM-DD" -> "Wednesday 16th Sep 2026". Parses components manually (not
 * `new Date(dateStr)`, which treats the string as UTC midnight and can shift the
 * displayed day/weekday depending on the viewer's timezone) — matches dateKey's
 * local-time convention.
 */
export function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const local = new Date(y, m - 1, d);
  return `${WEEKDAYS[local.getDay()]} ${d}${ordinalSuffix(d)} ${MONTHS[m - 1]} ${y}`;
}
