"use client";

import * as React from "react";
import { Search, Bell, Sparkles, Plus, Command } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TopNavProps {
  title?: string;
  onNewProject?: () => void;
  onOpenAIPlanner?: () => void;
}

export function TopNav({
  title = "Overview",
  onNewProject,
  onOpenAIPlanner,
}: TopNavProps) {
  return (
    <header className="h-16 border-b border-white/10 bg-[#080808]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-white tracking-tight">
          {title}
        </h1>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center w-96 relative">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search projects, tasks, or ask AI..."
          className="w-full h-9 pl-9 pr-14 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        <div className="absolute right-2.5 flex items-center gap-0.5 text-[10px] text-neutral-500 border border-white/10 px-1.5 py-0.5 rounded bg-black/40">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Run AI Planner Button */}
        <Button
          variant="ai"
          size="sm"
          onClick={onOpenAIPlanner}
          className="shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Planner</span>
        </Button>

        {/* Create Project Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onNewProject}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Button>

        {/* Notifications */}
        <button
          className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        </button>
      </div>
    </header>
  );
}
