import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive, className = "", ...props }: CardProps) {
  const classes = ["card", interactive ? "card--interactive" : "", className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes} {...props} />;
}
