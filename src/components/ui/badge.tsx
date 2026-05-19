import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "outline"
  | "success"
  | "warning"
  | "destructive"
  | "soft";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--mb-pink)] text-white",
  outline:
    "border border-[var(--mb-border)] bg-white text-[var(--mb-brown)]",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  destructive: "bg-red-50 text-red-700 ring-1 ring-red-200",
  soft: "bg-[var(--mb-pink-soft)] text-[var(--mb-brown)]",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}