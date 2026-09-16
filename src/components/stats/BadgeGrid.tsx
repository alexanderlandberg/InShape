import { BADGE_DEFINITIONS } from "@/lib/badges";
import { monthKey } from "@/lib/date";
import type { EarnedBadge } from "@/types";

export function BadgeGrid({ earnedBadges }: { earnedBadges: EarnedBadge[] }) {
  const currentMonth = monthKey();

  return (
    <div className="badge-grid">
      {BADGE_DEFINITIONS.map((def) => {
        const earned =
          def.scope === "monthly"
            ? earnedBadges.some((b) => b.badgeId === def.id && b.periodKey === currentMonth)
            : earnedBadges.some((b) => b.badgeId === def.id);
        return (
          <div key={def.id} className={`badge-tile${earned ? " badge-tile--earned" : ""}`}>
            <span className="badge-tile__icon">{earned ? "🏅" : "🔒"}</span>
            <span className="badge-tile__label">{def.label}</span>
          </div>
        );
      })}
    </div>
  );
}
