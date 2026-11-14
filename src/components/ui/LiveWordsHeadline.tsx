"use client";

import * as React from "react";

interface LiveWordsHeadlineProps {
  className?: string;
}

export function LiveWordsHeadline({ className = "" }: LiveWordsHeadlineProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  const [rotatingIndex, setRotatingIndex] = React.useState(0);
  const [isWordFading, setIsWordFading] = React.useState(false);
  const containerRef = React.useRef<HTMLHeadingElement>(null);

  const dynamicWords = [
    "build products",
    "ship software",
    "manage sprints",
    "orchestrate AI",
    "scale engineering",
  ];

  // 1. Trigger live entrance on initial reload
  React.useEffect(() => {
    // Trigger entrance animation immediately on reload/mount
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  // 2. Continuous rotating action words (every 2.8s)
  React.useEffect(() => {
    const wordTimer = setInterval(() => {
      setIsWordFading(true);
      setTimeout(() => {
        setRotatingIndex((prev) => (prev + 1) % dynamicWords.length);
        setIsWordFading(false);
      }, 350);
    }, 2800);

    return () => clearInterval(wordTimer);
  }, [dynamicWords.length]);

  // 3. Live responsiveness on Scroll Down and Scroll Up
  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Intersection Observer to re-trigger live wave when scrolling back up/down into viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset slightly so it re-blooms when scrolled back into view
          setIsVisible(false);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // Calculate subtle live scroll parallax & expansion (smooth depth effect as you scroll down and up)
  const scrollOffset = Math.min(scrollY * 0.08, 25);
  const scrollOpacity = Math.max(1 - scrollY * 0.0018, 0.4);

  const firstLineWords = [
    { text: "is", delay: 120 },
    { text: "a", delay: 180 },
    { text: "better", delay: 240 },
    { text: "way", delay: 300 },
  ];

  return (
    <h1
      ref={containerRef}
      style={{
        transform: `translateY(-${scrollOffset}px)`,
        opacity: scrollOpacity,
      }}
      className={`max-w-5xl text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-[1.15] select-none transition-transform duration-150 ease-out ${className}`}
    >
      {/* Brand Name: CoreSync with Live Glow */}
      <span
        style={{
          transitionDelay: "60ms",
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? "blur(0px)" : "blur(8px)",
        }}
        className="inline-block transition-all duration-700 ease-out mr-3 group cursor-default"
      >
        <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
          Core
        </span>
        <span className="text-[#3B82F6] drop-shadow-[0_0_25px_rgba(59,130,246,0.5)] group-hover:text-blue-400 transition-colors">
          Sync
        </span>
      </span>

      {/* Static Line 1 Words (Staggered live reveal on reload and scroll) */}
      {firstLineWords.map((item, idx) => (
        <span
          key={idx}
          style={{
            transitionDelay: `${item.delay}ms`,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? "blur(0px)" : "blur(6px)",
          }}
          className="inline-block transition-all duration-700 ease-out text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 mr-3 hover:text-white hover:-translate-y-1 transition-transform cursor-default"
        >
          {item.text}
        </span>
      ))}

      <br className="hidden sm:block" />

      {/* Second Line: "to" + Dynamic Action Words in Motion */}
      <span
        style={{
          transitionDelay: "360ms",
          transform: isVisible ? "translateY(0)" : "translateY(24px)",
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? "blur(0px)" : "blur(6px)",
        }}
        className="inline-block transition-all duration-700 ease-out text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 mr-3"
      >
        to
      </span>

      {/* Dynamic Animated Word in Continuous Motion */}
      <span
        style={{
          transitionDelay: "420ms",
          transform: isVisible ? "translateY(0)" : "translateY(24px)",
          opacity: isVisible ? 1 : 0,
        }}
        className="inline-block transition-all duration-700 ease-out"
      >
        <span
          className={`inline-block transition-all duration-350 transform ${
            isWordFading
              ? "opacity-0 -translate-y-3 scale-95 blur-sm"
              : "opacity-100 translate-y-0 scale-100 blur-0"
          } bg-clip-text text-transparent bg-gradient-to-r from-[#4B9CFF] via-[#818CF8] to-[#C084FC] drop-shadow-[0_0_20px_rgba(99,102,241,0.35)] font-extrabold`}
        >
          {dynamicWords[rotatingIndex]}
        </span>
      </span>
    </h1>
  );
}
