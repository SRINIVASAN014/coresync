import * as React from "react";
import { cn } from "@/lib/utils";

interface CoreSyncLogoProps {
  className?: string;
  size?: number;
}

/**
 * Official CoreSync Brand Logo Emblem
 * Preserves the exact original colors from the official brand artwork:
 * Glowing Neon Cyan & Electric Violet interlocking geometric loops on deep obsidian.
 */
export function CoreSyncLogo({
  className = "",
  size = 28,
}: CoreSyncLogoProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "rounded-lg bg-[#0B0C10] border border-slate-200/80 shadow-xs flex items-center justify-center overflow-hidden flex-shrink-0 select-none",
        className
      )}
    >
      <img
        src="/coresync-mark.png"
        alt="CoreSync Logo"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
