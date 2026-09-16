import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "ghost" | "danger";
  block?: boolean;
  size?: "md" | "lg";
}

export function Button({
  variant = "default",
  block,
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const classes = [
    "btn",
    variant !== "default" ? `btn--${variant}` : "",
    block ? "btn--block" : "",
    size === "lg" ? "btn--lg" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <button className={classes} {...props} />;
}
