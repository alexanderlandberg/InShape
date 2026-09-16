import type { Effort } from "@/types";

const OPTIONS: { value: Effort; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function EffortRatingPicker({ onSelect }: { onSelect: (effort: Effort) => void }) {
  return (
    <div className="text-center" style={{ padding: "2rem 0" }}>
      <h2 className="page-title text-center">How was that?</h2>
      <div className="radio-group" style={{ flexDirection: "column", gap: "0.75rem" }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className="radio-group__option"
            onClick={() => onSelect(opt.value)}
            style={{ padding: "1rem" }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
