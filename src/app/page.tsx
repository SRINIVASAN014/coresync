import Link from "next/link";
import { getServerSession } from "next-auth";
import {
  Sparkles,
  ShieldCheck,
  Building2,
  KanbanSquare,
  Bot,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function LandingPage() {
  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* 1. Header Navigation */}
      <header className="border-b border-white/10 bg-[#080808]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Core<span className="text-indigo-400">Sync</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400 font-medium">
            <a href="#features" className="hover:text-white transition">
              Capabilities
            </a>
            <a href="#architecture" className="hover:text-white transition">
              Architecture
            </a>
            <a href="#security" className="hover:text-white transition">
              AI Governance
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/dashboard">
                <Button variant="primary" size="sm">
                  Go to Workspace <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/api/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ai" size="sm">
                    Launch Workspace
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Ambient Lighting Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />

      {/* 3. Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Top Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium text-indigo-300 mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>CoreSync 1.0 — The AI-Native Jira Alternative</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-400">
          Where Engineering Teams & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Autonomous AI Agents
          </span>{" "}
          Collaborate
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-400 mb-10 leading-relaxed">
          Transform high-level company goals into structured roadmaps, milestones, and Kanban tasks in seconds. Governed by multi-tenant security and human-in-the-loop review.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button variant="ai" size="lg" className="w-full sm:w-auto text-base font-semibold">
              Enter Workspace <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
              Explore Capabilities
            </Button>
          </a>
        </div>

        {/* 4. Interactive Live Preview Mock */}
        <div className="mt-16 text-left rounded-2xl border border-white/10 bg-[#0E1015]/90 p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <div>
                <h2 className="text-lg font-semibold text-white">Project: Develop Secure Cloud Architecture</h2>
                <p className="text-xs text-neutral-400">Company: CyberDefense Labs • Lead: Alex Mercer</p>
              </div>
            </div>
            <Badge variant="ai">AI Project Manager: Active</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-400 uppercase">Backlog</span>
                <span className="text-xs font-mono text-neutral-500">2</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900/80 border border-white/5 space-y-1.5">
                <p className="text-xs font-medium text-white">Configure IAM Role Boundary Policies</p>
                <div className="flex items-center justify-between pt-1">
                  <Badge variant="warning">Urgent</Badge>
                  <span className="text-[10px] text-indigo-400 font-mono">AI Suggested</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase">In Progress</span>
                <span className="text-xs font-mono text-neutral-500">1</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900/80 border border-indigo-500/20 space-y-1.5">
                <p className="text-xs font-medium text-white">Deploy Multi-Tenant PostgreSQL Clusters</p>
                <div className="flex items-center justify-between pt-1">
                  <Badge variant="default">In Progress</Badge>
                  <span className="text-[10px] text-neutral-400 font-mono">Assigned: Dev</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase">Approval Center</span>
                <span className="text-xs font-mono text-emerald-400">Pending Review</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                <p className="text-xs font-medium text-emerald-300">AI Proposed 4 Subtasks for SOC2 Compliance</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-neutral-400">Needs Manager Sign-Off</span>
                  <span className="text-xs font-bold text-emerald-400">Review &rarr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Key Architecture Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
            Engineered as an Enterprise SaaS
          </h2>
          <p className="text-sm text-neutral-400">
            Every feature is architected for multi-company isolation, deterministic security, and AI agent execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Multi-Tenant Isolation</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every organization operates in strict cryptographic and logical boundaries. Company A can never access or query Company B&apos;s projects or tasks.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">AI Project Planner</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Input broad company objectives. The AI automatically decomposes them into milestones, dependencies, and actionable engineering tasks.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Human-in-the-Loop Governance</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              AI agents are never allowed to execute raw database writes without human approval. All autonomous plans are staged in the Approval Center.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} CoreSync Technologies, Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
