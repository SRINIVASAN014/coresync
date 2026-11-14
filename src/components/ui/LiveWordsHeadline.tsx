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

  // 1. Trigger live entrance gracefully on initial reload
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timeout);
  }, []);

  // 2. Calmer, slower rotating action words (cycles every 4.8s with a smooth 600ms fade)
  React.useEffect(() => {
    const wordTimer = setInterval(() => {
      setIsWordFading(true);
      setTimeout(() => {
        setRotatingIndex((prev) => (prev + 1) % dynamicWords.length);
        setIsWordFading(false);
      }, 600); // 600ms smooth cross-fade
    }, 4800); // Relaxed 4.8 second reading interval

    return () => clearInterval(wordTimer);
  }, [dynamicWords.length]);

  // 3. Smooth, relaxed responsiveness on Scroll Down and Scroll Up
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

    // Intersection Observer to smoothly re-bloom when scrolling back into viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
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

  // Smooth gentle parallax scroll factor
  const scrollOffset = Math.min(scrollY * 0.05, 20);
  const scrollOpacity = Math.max(1 - scrollY * 0.0015, 0.45);

  const firstLineWords = [
    { text: "is", delay: 220 },
    { text: "a", delay: 340 },
    { text: "better", delay: 460 },
    { text: "way", delay: 580 },
  ];

  return (
    <h1
      ref={containerRef}
      style={{
        transform: `translateY(-${scrollOffset}px)`,
        opacity: scrollOpacity,
      }}
      className={`max-w-5xl text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-[1.15] select-none transition-transform duration-300 ease-out ${className}`}
    >
      {/* Brand Name: CoreSync with Calibrated Glow */}
      <span
        style={{
          transitionDelay: "100ms",
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? "blur(0px)" : "blur(6px)",
        }}
        className="inline-block transition-all duration-1000 ease-out mr-3 group cursor-default"
      >
        <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
          Core
        </span>
        <span className="text-[#3B82F6] drop-shadow-[0_0_25px_rgba(59,130,246,0.5)] group-hover:text-blue-400 transition-colors">
          Sync
        </span>
      </span>

      {/* Static Line 1 Words (Smooth, slower staggered reveal on reload and scroll) */}
      {firstLineWords.map((item, idx) => (
        <span
          key={idx}
          style={{
            transitionDelay: `${item.delay}ms`,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? "blur(0px)" : "blur(5px)",
          }}
          className="inline-block transition-all duration-1000 ease-out text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 mr-3 hover:text-white hover:-translate-y-1 transition-transform cursor-default"
        >
          {item.text}
        </span>
      ))}

      <br className="hidden sm:block" />

      {/* Second Line: "to" */}
      <span
        style={{
          transitionDelay: "700ms",
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? "blur(0px)" : "blur(5px)",
        }}
        className="inline-block transition-all duration-1000 ease-out text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 mr-3"
      >
        to
      </span>

      {/* Dynamic Animated Word in Calmer, Slower Motion */}
      <span
        style={{
          transitionDelay: "820ms",
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible ? 1 : 0,
        }}
        className="inline-block transition-all duration-1000 ease-out"
      >
        <span
          className={`inline-block transition-all duration-600 ease-in-out transform ${
            isWordFading
              ? "opacity-0 -translate-y-2 scale-98 blur-sm"
              : "opacity-100 translate-y-0 scale-100 blur-0"
          } bg-clip-text text-transparent bg-gradient-to-r from-[#4B9CFF] via-[#818CF8] to-[#C084FC] drop-shadow-[0_0_20px_rgba(99,102,241,0.35)] font-extrabold`}
        >
          {dynamicWords[rotatingIndex]}
        </span>
      </span>
    </h1>
  );
}
