"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Bell, Sparkles, Plus, Command, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TopNavProps {
  title?: string;
  onNewIssue?: () => void;
}

export function TopNav({
  title = "Overview",
  onNewIssue,
}: TopNavProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center w-96 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search issues, projects, or command (Ctrl+K)..."
          className="w-full h-9 pl-9 pr-14 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        />
        <div className="absolute right-2.5 flex items-center gap-0.5 text-[10px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-white font-mono shadow-2xs">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* Run AI Planner Button */}
        <Link href="/dashboard/ai-planner">
          <Button variant="ai" size="sm" className="shadow-sm h-8 text-xs">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>AI Planner</span>
          </Button>
        </Link>

        {/* Create Project Button */}
        <Link href="/dashboard/projects">
          <Button variant="secondary" size="sm" className="h-8 text-xs border border-slate-200">
            <FolderPlus className="w-3.5 h-3.5 mr-1 text-slate-600" />
            <span>Projects</span>
          </Button>
        </Link>

        {/* Notifications */}
        <Link href="/dashboard/approvals">
          <button
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition relative ml-1 cursor-pointer"
            aria-label="Approvals & Notifications"
            title="Approvals & Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          </button>
        </Link>
      </div>
    </header>
  );
}
