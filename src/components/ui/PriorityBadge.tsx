import * as React from "react";
import { cn } from "@/lib/utils";

export type PriorityLevel = "URGENT" | "HIGH" | "MEDIUM" | "LOW" | string;

export interface PriorityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  priority: PriorityLevel;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function PrioritySignalIcon({
  priority,
  className,
}: {
  priority: PriorityLevel;
  className?: string;
}) {
  const norm = String(priority).toUpperCase();

  if (norm === "URGENT") {
    return (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className={cn("w-3.5 h-3.5 text-rose-600 shrink-0", className)}
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.865 1.52c-.382-.663-1.348-.663-1.73 0L.686 12.72c-.384.666.097 1.53.865 1.53h12.898c.768 0 1.25-.864.865-1.53L8.865 1.52zM8 5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z"
        />
      </svg>
    );
  }

  // 3-bar signal meter (stepped bars: 4px, 7px, 11px)
  const isHigh = norm === "HIGH";
  const isMed = norm === "MEDIUM";
  const isLow = norm === "LOW";

  const bar1Color = "currentColor";
  const bar2Color = isHigh || isMed ? "currentColor" : "currentColor opacity-20";
  const bar3Color = isHigh ? "currentColor" : "currentColor opacity-20";

  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("w-3.5 h-3.5 shrink-0", className)}
      aria-hidden="true"
    >
      {/* Bar 1 (Low) */}
      <rect x="2" y="9.5" width="2.75" height="4.5" rx="0.75" fill={bar1Color} />
      {/* Bar 2 (Medium) */}
      <rect
        x="6.625"
        y="6.5"
        width="2.75"
        height="7.5"
        rx="0.75"
        fill="currentColor"
        className={!isHigh && !isMed ? "opacity-25" : ""}
      />
      {/* Bar 3 (High) */}
      <rect
        x="11.25"
        y="3"
        width="2.75"
        height="11"
        rx="0.75"
        fill="currentColor"
        className={!isHigh ? "opacity-25" : ""}
      />
    </svg>
  );
}

export function PriorityBadge({
  priority,
  size = "sm",
  showLabel = true,
  className,
  ...props
}: PriorityBadgeProps) {
  const norm = String(priority).toUpperCase();

  const configs: Record<
    string,
    { label: string; container: string; iconColor: string }
  > = {
    URGENT: {
      label: "Urgent",
      container:
        "bg-rose-50 text-rose-700 border-rose-200/90 hover:bg-rose-100/70",
      iconColor: "text-rose-600",
    },
    HIGH: {
      label: "High",
      container:
        "bg-amber-50/90 text-amber-900 border-amber-200/90 hover:bg-amber-100/70",
      iconColor: "text-amber-600",
    },
    MEDIUM: {
      label: "Medium",
      container:
        "bg-slate-100/90 text-slate-800 border-slate-200/90 hover:bg-slate-200/60",
      iconColor: "text-blue-600",
    },
    LOW: {
      label: "Low",
      container:
        "bg-slate-50 text-slate-600 border-slate-200/70 hover:bg-slate-100/60",
      iconColor: "text-slate-400",
    },
  };

  const config = configs[norm] || configs.MEDIUM;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border rounded-md select-none transition-colors",
        size === "sm"
          ? "px-2 py-0.5 text-xs"
          : "px-2.5 py-1 text-xs",
        config.container,
        className
      )}
      {...props}
    >
      <PrioritySignalIcon priority={norm} className={config.iconColor} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
