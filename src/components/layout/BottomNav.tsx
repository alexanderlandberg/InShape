"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/log", icon: "💪", label: "Log" },
  { href: "/workouts", icon: "📋", label: "Workouts" },
  { href: "/stats", icon: "📊", label: "Stats" },
  { href: "/calendar", icon: "📅", label: "Calendar" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav__item${active ? " bottom-nav__item--active" : ""}`}
          >
            <span className="bottom-nav__icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
