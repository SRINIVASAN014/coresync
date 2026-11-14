"use client";

import * as React from "react";

interface LiveWordsHeadlineProps {
  className?: string;
}

export function LiveWordsHeadline({ className = "" }: LiveWordsHeadlineProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  const containerRef = React.useRef<HTMLHeadingElement>(null);

  // Typewriter state
  const words = React.useMemo(
    () => [
      "build products",
      "ship software",
      "manage sprints",
      "orchestrate AI",
      "scale engineering",
    ],
    []
  );

  const [wordIndex, setWordIndex] = React.useState(0);
  const [typedText, setTypedText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  // 1. Initial entrance animation trigger on reload
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timeout);
  }, []);

  // 2. Slow, deliberate typewriter motion
  React.useEffect(() => {
    const currentFullWord = words[wordIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && typedText === currentFullWord) {
      // Word is fully typed out: Pause for 3.0s so it can be read in a calm pace
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 3000);
    } else if (isDeleting && typedText === "") {
      // Word is fully backspaced: Pause briefly then switch to next word
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      timer = setTimeout(() => {}, 500);
    } else {
      // Typing pace: Slow deliberate typing (115ms per letter); Deleting pace: 50ms
      const typingSpeed = isDeleting ? 50 : 115;
      timer = setTimeout(() => {
        setTypedText((prev) =>
          isDeleting
            ? currentFullWord.substring(0, prev.length - 1)
            : currentFullWord.substring(0, prev.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, wordIndex, words]);

  // 3. Smooth live scroll responsiveness on Scroll Down and Scroll Up
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

  const scrollOffset = Math.min(scrollY * 0.05, 20);
  const scrollOpacity = Math.max(1 - scrollY * 0.0015, 0.45);

  const firstLineWords = [
    { text: "is", delay: 200 },
    { text: "a", delay: 320 },
    { text: "better", delay: 440 },
    { text: "way", delay: 560 },
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
      {/* Brand Name: CoreSync */}
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

      {/* Static Words */}
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
          transitionDelay: "680ms",
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? "blur(0px)" : "blur(5px)",
        }}
        className="inline-block transition-all duration-1000 ease-out text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 mr-3"
      >
        to
      </span>

      {/* Dynamic Typewriter Words in Slow Typing Motion */}
      <span
        style={{
          transitionDelay: "800ms",
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible ? 1 : 0,
        }}
        className="inline-block transition-all duration-1000 ease-out min-w-[260px] sm:min-w-[420px] text-left align-baseline"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B9CFF] via-[#818CF8] to-[#C084FC] drop-shadow-[0_0_20px_rgba(99,102,241,0.35)] font-extrabold">
          {typedText}
        </span>
        {/* Blinking Electric Blue Typewriter Cursor */}
        <span className="inline-block w-[3px] sm:w-[4px] h-[0.75em] bg-[#3B82F6] ml-1 align-baseline animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
      </span>
    </h1>
  );
}
