"use client";

import * as React from "react";
import {
  KanbanSquare,
  Sparkles,
  Zap,
  TrendingUp,
  Search,
  Command,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  User,
  SlidersHorizontal,
  Circle,
  Layers,
} from "lucide-react";

export function ProductMockup() {
  const [activeTab, setActiveTab] = React.useState<"board" | "roadmap" | "ai" | "telemetry">("board");

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 sm:mt-16 text-left select-none group">
      {/* Outer Glow Border Effect */}
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-white/20 via-white/[0.08] to-transparent shadow-[0_20px_70px_rgba(0,0,0,0.85)]">
        
        {/* Main App Container */}
        <div className="rounded-[15px] bg-[#0A0C10] border border-white/[0.08] overflow-hidden backdrop-blur-2xl">
          
          {/* Top Window Chrome */}
          <div className="h-11 border-b border-white/[0.08] bg-[#0E1017] px-4 flex items-center justify-between">
            {/* Left: Window Controls & Workspace Name */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]/80 border border-[#E0443E]/50" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 border border-[#DEA123]/50" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]/80 border border-[#1AAB29]/50" />
              </div>
              <div className="h-3.5 w-[1px] bg-white/10 mx-1 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                <span className="text-[#3B82F6] font-bold">coresync</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400">cybertech-global</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-200 font-medium">Sprint 24</span>
              </div>
            </div>

            {/* Center: Search & Shortcut Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-slate-400 w-72">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 text-[11px]">Type a command or search...</span>
              <div className="ml-auto flex items-center gap-0.5 text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </div>

            {/* Right: Telemetry Ping & Active Users */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Live Sync (18ms)</span>
              </div>
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 border border-[#0A0C10] flex items-center justify-center text-[9px] font-bold text-white">S</div>
                <div className="w-5 h-5 rounded-full bg-indigo-600 border border-[#0A0C10] flex items-center justify-center text-[9px] font-bold text-white">A</div>
                <div className="w-5 h-5 rounded-full bg-emerald-600 border border-[#0A0C10] flex items-center justify-center text-[9px] font-bold text-white">K</div>
              </div>
            </div>
          </div>

          {/* Subheader Toolbar & Interactive Tabs */}
          <div className="px-4 sm:px-6 py-2.5 border-b border-white/[0.06] bg-[#0A0C10] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setActiveTab("board")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === "board"
                    ? "bg-[#3B82F6] text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <KanbanSquare className="w-3.5 h-3.5" />
                <span>Sprint Board</span>
              </button>

              <button
                onClick={() => setActiveTab("ai")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === "ai"
                    ? "bg-[#3B82F6] text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>CoreSync AI Planner</span>
              </button>

              <button
                onClick={() => setActiveTab("roadmap")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer hidden sm:flex ${
                  activeTab === "roadmap"
                    ? "bg-[#3B82F6] text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Milestone Roadmap</span>
              </button>

              <button
                onClick={() => setActiveTab("telemetry")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer hidden md:flex ${
                  activeTab === "telemetry"
                    ? "bg-[#3B82F6] text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Telemetry</span>
              </button>
            </div>

            {/* Quick Keyboard Cue & Action */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-mono">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">C</kbd> to create issue
              </span>
              <div className="h-3 w-[1px] bg-white/10" />
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Filter: Active (14)</span>
              </div>
            </div>
          </div>

          {/* Interactive Tab Viewport */}
          <div className="p-4 sm:p-6 min-h-[380px] bg-[#0A0C10]">
            
            {/* TAB 1: KANBAN BOARD */}
            {activeTab === "board" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
                
                {/* Column 1: TODO */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                      <span className="text-xs font-semibold text-slate-300">To Do</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">3</span>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-500 hover:text-white cursor-pointer" />
                  </div>

                  {/* Card 1 */}
                  <div className="p-3 rounded-lg border border-white/[0.08] bg-[#11131A] hover:border-[#3B82F6]/50 hover:bg-[#131622] transition shadow-xs space-y-2 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-blue-400">CORE-104</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">URGENT</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 leading-snug">
                      Implement Zero-Trust OAuth2 PKCE & WebAuthn MFA
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] text-slate-500">
                      <span className="flex items-center gap-1 text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 3/4
                      </span>
                      <span className="text-slate-400 font-mono">12h</span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-3 rounded-lg border border-white/[0.08] bg-[#11131A] hover:border-[#3B82F6]/50 hover:bg-[#131622] transition shadow-xs space-y-2 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-blue-400">CORE-118</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">HIGH</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 leading-snug">
                      PostgreSQL pgvector hybrid indexing & semantic search
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] text-slate-500">
                      <span className="text-slate-400">Database</span>
                      <span className="text-slate-400 font-mono">8h</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: IN PROGRESS */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-semibold text-slate-300">In Progress</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">2</span>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-500 hover:text-white cursor-pointer" />
                  </div>

                  {/* Card 3 */}
                  <div className="p-3 rounded-lg border border-amber-500/20 bg-[#14120E] hover:border-amber-400/50 transition shadow-xs space-y-2 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-amber-400">CORE-92</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">ACTIVE</span>
                    </div>
                    <p className="text-xs font-medium text-slate-100 leading-snug">
                      Multi-tenant logical database isolation on Neon AWS
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] text-slate-500">
                      <span className="flex items-center gap-1 text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 4/4
                      </span>
                      <span className="text-slate-400 font-mono">16h</span>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="p-3 rounded-lg border border-white/[0.08] bg-[#11131A] hover:border-[#3B82F6]/50 hover:bg-[#131622] transition shadow-xs space-y-2 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-blue-400">CORE-87</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">NORMAL</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 leading-snug">
                      Design System token alignment with Tailwind CSS v4
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] text-slate-500">
                      <span className="text-slate-400">Frontend</span>
                      <span className="text-slate-400 font-mono">6h</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: IN REVIEW */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span className="text-xs font-semibold text-slate-300">In Review</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">2</span>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-500 hover:text-white cursor-pointer" />
                  </div>

                  {/* Card 5 */}
                  <div className="p-3 rounded-lg border border-indigo-500/20 bg-[#11121C] hover:border-indigo-400/50 transition shadow-xs space-y-2 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-indigo-400">CORE-76</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">PR #84</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 leading-snug">
                      Autonomous agent human-in-the-loop approval gate
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] text-slate-500">
                      <span className="text-indigo-300 font-semibold">1 Approval Needed</span>
                      <span className="text-slate-400 font-mono">8h</span>
                    </div>
                  </div>
                </div>

                {/* Column 4: DONE */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold text-slate-300">Done</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">6</span>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>

                  {/* Card 6 */}
                  <div className="p-3 rounded-lg border border-white/[0.06] bg-[#0E1015] opacity-80 hover:opacity-100 transition space-y-2 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-emerald-400">CORE-63</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">MERGED</span>
                    </div>
                    <p className="text-xs font-medium text-slate-300 leading-snug line-through decoration-slate-600">
                      NextAuth Credentials & OAuth integration
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] text-slate-500">
                      <span className="text-emerald-400">Verified</span>
                      <span className="text-slate-400 font-mono">10h</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AI PLANNER PREVIEW */}
            {activeTab === "ai" && (
              <div className="p-4 sm:p-6 rounded-xl border border-blue-500/20 bg-[#0E111A] space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Zap className="w-4 h-4 text-blue-400" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">CoreSync Independent AI Engine</h4>
                      <p className="text-xs text-slate-400">Native in-house roadmap decomposition · Zero external cloud API dependency</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Generated in 12ms
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Phase 1</span>
                    <p className="text-xs font-semibold text-white">Design System & Frontend Architecture</p>
                    <p className="text-[11px] text-slate-400">Tailwind CSS v4 tokens, responsive layouts, atomic UI primitives.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Phase 2</span>
                    <p className="text-xs font-semibold text-white">Backend API & Database Persistence</p>
                    <p className="text-[11px] text-slate-400">PostgreSQL relational models, Server Actions, Zod validation schemas.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Phase 3</span>
                    <p className="text-xs font-semibold text-white">Production CI/CD & Security Hardening</p>
                    <p className="text-[11px] text-slate-400">Automated GitHub Actions, SSL edge monitoring, SOC2 compliance.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ROADMAP VIEW */}
            {activeTab === "roadmap" && (
              <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0E1015] space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-xs text-slate-400">
                  <span>Sprint Epic Milestones</span>
                  <span className="font-mono">Q4 2026 Roadmap</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Sprint 24 · CoreSync 2.0 Launch</p>
                      <p className="text-[11px] text-slate-400">14 issues · 88% velocity · 18 days remaining</p>
                    </div>
                    <div className="w-36 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[88%]" />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Sprint 25 · Autonomous Agent Workflows</p>
                      <p className="text-[11px] text-slate-400">9 issues · Scheduled for Dec 1, 2026</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">Upcoming</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: TELEMETRY VIEW */}
            {activeTab === "telemetry" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0E1015] space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Database Query Latency</span>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">18ms</p>
                  <p className="text-[11px] text-slate-400">PostgreSQL on AWS US-East-1</p>
                </div>
                <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0E1015] space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Tenant Partitioning</span>
                  <p className="text-2xl font-bold text-blue-400 font-mono">100%</p>
                  <p className="text-[11px] text-slate-400">Multi-tenant boundary enforced</p>
                </div>
                <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0E1015] space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Data Isolation Guarantee</span>
                  <p className="text-2xl font-bold text-indigo-400 font-mono">0 Leaks</p>
                  <p className="text-[11px] text-slate-400">Zero third-party cloud AI leakage</p>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Status Bar */}
          <div className="h-8 border-t border-white/[0.06] bg-[#08090C] px-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <div className="flex items-center gap-3">
              <span>PostgreSQL 16.4</span>
              <span>•</span>
              <span>Prisma ORM</span>
              <span>•</span>
              <span className="text-slate-400">Next.js 16 App Router</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-blue-400">⚡ CoreSync Independent AI Engine Active</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
