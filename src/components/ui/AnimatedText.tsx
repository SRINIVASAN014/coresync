"use client";

import * as React from "react";

interface AnimatedTextProps {
  words?: string[];
  interval?: number;
}

export function AnimatedText({
  words = ["build products", "ship software", "manage sprints", "orchestrate AI"],
  interval = 3000,
}: AnimatedTextProps) {
  const [index, setIndex] = React.useState(0);
  const [isFading, setIsFading] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsFading(false);
      }, 400); // Wait for fade-out before switching text
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span
      className={`inline-block transition-all duration-400 transform ${
        isFading
          ? "opacity-0 -translate-y-2 scale-95"
          : "opacity-100 translate-y-0 scale-100"
      } bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400`}
    >
      {words[index]}
    </span>
  );
}
