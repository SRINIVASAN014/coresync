import * as React from "react";
import { cn } from "@/lib/utils";

interface CoreSyncLogoProps {
  className?: string;
  size?: number;
  variant?: "tile" | "transparent" | "dark-tile";
}

/**
 * Official CoreSync Brand Emblem
 * Features mathematically precise interlocking dual-rhombus geometry
 * exactly matching the brand icon, rendering with crystal clarity on any background.
 */
export function CoreSyncLogo({
  className = "",
  size = 28,
  variant = "tile",
}: CoreSyncLogoProps) {
  // Pure vector SVG interlocking rhombuses
  const svgContent = (fillColor1 = "#FFFFFF", fillColor2 = "#BAE6FD") => (
    <svg
      width={size * 0.75}
      height={size * 0.75}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="cs-left-loop" x1="4" y1="4" x2="20" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="cs-right-loop" x1="12" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0C66E4" />
        </linearGradient>
      </defs>

      {/* When in tile mode (colored background), use clean crisp white/cyan strokes */}
      {variant === "tile" ? (
        <>
          {/* Left Rhombus / Diamond */}
          <path
            d="M10 5L19 14L10 23L1 14Z"
            stroke={fillColor1}
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Right Rhombus / Diamond (Interlocking) */}
          <path
            d="M22 9L31 18L22 27L13 18Z"
            stroke={fillColor2}
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Overlap weave segment to create 3D interlocking ribbon */}
          <path
            d="M10 5L19 14"
            stroke={fillColor1}
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Left Loop in Vibrant Violet */}
          <path
            d="M10 5L19 14L10 23L1 14Z"
            stroke="url(#cs-left-loop)"
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Right Loop in Electric Cyan */}
          <path
            d="M22 9L31 18L22 27L13 18Z"
            stroke="url(#cs-right-loop)"
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Overlap weave segment */}
          <path
            d="M10 5L19 14"
            stroke="url(#cs-left-loop)"
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );

  if (variant === "tile") {
    // Jira-style royal blue rounded square tile (#0C66E4)
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "rounded-lg bg-[#0C66E4] hover:bg-[#0052CC] transition-colors flex items-center justify-center shadow-xs flex-shrink-0 select-none",
          className
        )}
      >
        {svgContent("#FFFFFF", "#BAE6FD")}
      </div>
    );
  }

  if (variant === "dark-tile") {
    // Executive Obsidian tile with glowing neon cyan/purple
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "rounded-lg bg-[#0B0C10] border border-slate-200/80 shadow-xs flex items-center justify-center flex-shrink-0 select-none",
          className
        )}
      >
        {svgContent()}
      </div>
    );
  }

  // Pure transparent vector logo directly on page
  return (
    <div
      style={{ width: size, height: size }}
      className={cn("flex items-center justify-center flex-shrink-0 select-none", className)}
    >
      {svgContent()}
    </div>
  );
}
