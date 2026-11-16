"use client";

import * as React from "react";

interface LiveWordsHeadlineProps {
  className?: string;
}

export function LiveWordsHeadline({ className = "" }: LiveWordsHeadlineProps) {
  return (
    <h1
      className={`max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.12] select-none ${className}`}
    >
      <span className="text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.15)]">
        The work platform engineered for
      </span>{" "}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B9CFF] via-[#818CF8] to-[#C084FC] drop-shadow-[0_0_35px_rgba(99,102,241,0.35)] font-extrabold">
        velocity.
      </span>
    </h1>
  );
}
