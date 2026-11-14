import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "danger"
    | "ai";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    secondary: "bg-neutral-800 text-neutral-300 border-neutral-700",
    outline: "border-white/15 text-neutral-300 bg-transparent",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    ai: "bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-indigo-300 border-indigo-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide select-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
