import Link from "next/link";
import { getServerSession } from "next-auth";
import Navbar from "./components/Navbar";
import {
  Building2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Layers,
  KanbanSquare,
  Bot,
} from "lucide-react";

export default async function LandingPage() {
  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#3B82F6]/30 font-sans flex flex-col">
      {/* 1. Header with exact CoreSync logo colors */}
      <Navbar />

      {/* 2. Hero Section harmonized with brand colors */}
      <div className="flex-1 flex flex-col justify-center relative overflow-hidden py-24 sm:py-32">
        {/* Luminous Bright Violet Center Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[520px] bg-gradient-to-tr from-[#7C3AED]/40 via-[#8B5CF6]/45 to-[#6366F1]/30 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-violet-600/45 blur-[85px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[160px] bg-purple-500/35 blur-[50px] rounded-full pointer-events-none" />

        <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
          {/* Top Pill matching electric blue dot */}
          <div className="mb-8 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-[#3B82F6]/40 hover:bg-white/10 text-xs sm:text-sm text-[#8A8F98] transition cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <span className="flex h-2 w-2 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
            <span className="text-neutral-300">Introducing AI Task Assignment &rarr;</span>
          </div>

          {/* Main Heading with Brand White + Electric Blue */}
          <h1 className="max-w-5xl text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-[1.15]">
            <span className="text-white">Core</span>
            <span className="text-[#3B82F6]">Sync</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70">
              is a better way <br className="hidden sm:block" /> to build products
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg sm:text-xl text-[#8A8F98] mb-12 leading-relaxed">
            Meet the new standard for modern software development. Streamline issues, sprints, and product roadmaps with an autonomous AI workspace.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={session ? "/dashboard" : "/api/auth/signin"}
              className="bg-white text-black px-7 py-3 rounded-full font-semibold hover:bg-neutral-200 transition flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.15)] text-sm active:scale-95"
            >
              Get started
            </Link>
            <Link
              href="/dashboard"
              className="px-7 py-3 rounded-full font-medium border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#3B82F6]/40 transition flex items-center gap-2 text-white text-sm"
            >
              Go to Workspace
            </Link>
          </div>
        </main>
      </div>

      {/* 3. Value Propositions & Enterprise Capabilities */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/5 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Engineered for High-Velocity Engineering Teams
          </h2>
          <p className="text-sm text-[#8A8F98]">
            Multi-company data isolation, autonomous AI project decomposition, and human-governed execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] hover:border-[#3B82F6]/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Multi-Company Workspaces</h3>
            <p className="text-xs text-[#8A8F98] leading-relaxed">
              Strict multi-tenant security ensures Company A can never access Company B&apos;s projects, tasks, or internal documentation.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] hover:border-[#6366F1]/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">AI Project Planner</h3>
            <p className="text-xs text-[#8A8F98] leading-relaxed">
              Convert product briefs into milestones, epics, and Kanban tasks with dependencies and timeline estimates in seconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] hover:border-[#A855F7]/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center text-[#A855F7]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Human Approval Center</h3>
            <p className="text-xs text-[#8A8F98] leading-relaxed">
              AI agents cannot unilaterally execute changes. Every proposed assignment or sprint modification requires human sign-off.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-[#8A8F98]">
        <p>&copy; {new Date().getFullYear()} CoreSync Technologies, Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
