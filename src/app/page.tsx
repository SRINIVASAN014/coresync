import Link from "next/link";
import { getServerSession } from "next-auth";
import Navbar from "./components/Navbar";
import { LiveWordsHeadline } from "@/components/ui/LiveWordsHeadline";
import { ProductMockup } from "@/components/landing/ProductMockup";
import { ContactForm } from "@/components/landing/ContactForm";
import {
  Building2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Layers,
  KanbanSquare,
  Bot,
  Check,
  Zap,
  FolderKanban,
  FileCode,
  Shield,
  HelpCircle,
  Mail,
  Clock,
  ExternalLink,
  Cpu,
  Lock,
} from "lucide-react";

export default async function LandingPage() {
  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#3B82F6]/30 font-sans flex flex-col relative overflow-x-hidden">
      {/* 1. Global Persistent Ambient Violet Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-gradient-to-tr from-violet-600/18 via-[#8B5CF6]/15 to-[#3B82F6]/12 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* 2. Top Navigation Bar */}
      <Navbar />

      {/* 3. Hero Section with Real Product Mockup */}
      <div className="flex-1 flex flex-col justify-center relative pt-20 pb-16 sm:pt-28 sm:pb-24 z-10">
        <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-6xl mx-auto">
          
          {/* Top Announcement Badge */}
          <Link
            href={session ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 text-xs text-slate-300 font-medium mb-8 backdrop-blur-md transition group"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="font-semibold text-white">CoreSync 2.0</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Issue tracking built for speed</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Main Headline */}
          <LiveWordsHeadline />

          {/* Subtitle - Professional, Direct Engineering Copy */}
          <p className="max-w-2xl text-base sm:text-lg text-slate-400 mb-10 leading-relaxed font-normal">
            Linear-speed issue tracking, sprint milestones, and deterministic multi-tenant governance. Engineered for high-velocity teams who value craft, keyboard navigation, and sub-50ms execution.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <Link
              href={session ? "/dashboard" : "/login"}
              className="bg-white text-black px-7 py-3 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.15)] text-sm active:scale-95"
            >
              <span>Get started for free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="px-7 py-3 rounded-xl font-medium border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition flex items-center gap-2 text-slate-200 text-sm active:scale-95"
            >
              <span>Explore Workspace</span>
            </Link>
          </div>

          {/* Trust Marks & Key Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Sub-50ms query response</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>100% PostgreSQL tenant isolation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Independent in-house AI engine</span>
            </div>
          </div>

          {/* Real Interactive Product Viewport Mockup */}
          <ProductMockup />

        </main>
      </div>

      {/* 4. Core Engineering Architecture Bento Grid */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-24 border-t border-white/[0.06] w-full">
        {/* Scrolled Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-gradient-to-tr from-violet-600/18 via-[#8B5CF6]/15 to-[#3B82F6]/12 blur-[130px] rounded-full pointer-events-none -z-10" />
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> Engineered for Velocity
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Built for speed. Designed for precision.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every interaction is engineered for zero-latency execution, keyboard-first navigation, and strict multi-tenant boundary enforcement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Multi-Tenant Partitioning */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0C10] hover:border-blue-500/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#3B82F6]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Mathematical Tenant Isolation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                PostgreSQL schema boundaries guarantee Company A can never access Company B&apos;s project data, issues, or audit logs. Built on Neon AWS with SSL enforcement.
              </p>
            </div>
          </div>

          {/* Card 2: Independent CoreSync AI */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0C10] hover:border-indigo-500/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Independent CoreSync AI Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Native in-house roadmap planner that decomposes high-level technical objectives into milestones and issues in under 25ms. Zero external third-party API dependencies.
              </p>
            </div>
          </div>

          {/* Card 3: Human-in-the-Loop Governance */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0C10] hover:border-emerald-500/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Human-Governed Execution Gates
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous agent task rebalancing and high-impact assignments require cryptographic manager authorization before mutating the production database.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Production Workspace Templates Section */}
      <section id="templates" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.06] w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#3B82F6] text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" /> Workspace Blueprints
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Engineered Workspace Blueprints
          </h2>
          <p className="text-sm text-slate-400">
            Pre-configured schemas, issue hierarchies, and sprint cycles built for modern engineering organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template 1: Linear Sprints */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0C10] hover:border-[#3B82F6]/40 transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#3B82F6]">
                <KanbanSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
                Agile Sprints
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
              High-Velocity Linear Delivery
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Optimized for fast 2-week iterations. Features automated issue keys, signal-bar priority scoring, rapid-keyboard drawer editing, and zero-clutter Kanban flows.
            </p>
            <div className="space-y-2 text-xs text-slate-300 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Linear-style status cycle (Backlog → Done)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Keyboard-first issue modal (<kbd className="font-mono text-[10px] bg-white/10 px-1 rounded">C</kbd> to create)</span>
              </div>
            </div>
            <Link
              href={session ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B82F6] hover:text-blue-300"
            >
              Deploy Sprint Template <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Template 2: AI Autonomous Swarm */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0C10] hover:border-purple-500/40 transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold">
                Independent AI
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
              Autonomous AI Agent Swarm
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Built for teams integrating autonomous workers into production roadmaps. Includes human approval gates, audit trails, and recursive task decomposition.
            </p>
            <div className="space-y-2 text-xs text-slate-300 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-400" />
                <span>CoreSync Independent AI Planner (&lt; 25ms)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-400" />
                <span>Mandatory human manager sign-off on mutations</span>
              </div>
            </div>
            <Link
              href={session ? "/dashboard/ai-planner" : "/register"}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              Deploy AI Agent Template <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Template 3: DevSecOps */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0C10] hover:border-emerald-500/40 transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                Security & DevSecOps
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
              Multi-Company DevSecOps Triage
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Vulnerability prioritization and patch lifecycle management with strict tenant isolation, immutable audit logs, and CVE tracking.
            </p>
            <div className="space-y-2 text-xs text-slate-300 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cryptographic audit logs for compliance audits</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-tenant data isolation per company boundary</span>
              </div>
            </div>
            <Link
              href={session ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Deploy DevSecOps Template <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Template 4: Product Epics & Portfolio */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0C10] hover:border-amber-500/40 transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <FolderKanban className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
                Portfolio Roadmaps
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
              Multi-Project Portfolio & Epics
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Organize multiple engineering initiatives across teams. Connect overarching strategic milestones down to individual contributor subtasks.
            </p>
            <div className="space-y-2 text-xs text-slate-300 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Projects portfolio directory with live telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Automated sprint workload velocity metrics</span>
              </div>
            </div>
            <Link
              href={session ? "/dashboard/projects" : "/register"}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              Deploy Portfolio Template <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Transparent Enterprise Pricing Section */}
      <section id="pricing" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.06] w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> Transparent Pricing
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Predictable Pricing for High-Scale Engineering
          </h2>
          <p className="text-sm text-slate-400">
            Start free for individuals and fast-moving teams. Scale to full multi-tenant mathematical isolation and custom enterprise SLAs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Tier 1: Starter */}
          <div className="p-7 rounded-2xl border border-white/[0.08] bg-[#0A0C10] flex flex-col justify-between hover:border-white/20 transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Starter</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                  Free Forever
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Ideal for individual engineers and boutique technical teams shipping initial MVPs.
              </p>

              <div className="space-y-3 text-xs text-slate-300 border-t border-white/[0.06] pt-6 mb-8">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span>Up to 5 team members</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span>3 active project backlogs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span>Linear 5-column Kanban board</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span>Subtask checklist with progress</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Check className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <span>Community Discord support</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-center text-xs font-semibold text-white transition active:scale-95"
            >
              Get Started Free
            </Link>
          </div>

          {/* Tier 2: Pro (Featured) */}
          <div className="p-7 rounded-2xl border-2 border-[#3B82F6] bg-[#0E1017] flex flex-col justify-between shadow-[0_0_35px_rgba(59,130,246,0.25)] relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#3B82F6] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Pro</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 uppercase font-semibold">
                  Scale Fast
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-white">$19</span>
                <span className="text-xs text-slate-400">/ member / month</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                For fast-paced product teams scaling features with integrated AI agents.
              </p>

              <div className="space-y-3 text-xs text-slate-200 border-t border-white/[0.08] pt-6 mb-8">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span className="font-semibold text-white">Unlimited team members & projects</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span>CoreSync Independent AI Planner</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span>Human-in-the-Loop Approval Queue</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span>Workspace switcher & multi-tenancy</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span>24/7 Priority engineering SLA</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full py-2.5 px-4 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-center text-xs font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition active:scale-95"
            >
              Start Free 14-Day Trial
            </Link>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="p-7 rounded-2xl border border-white/[0.08] bg-[#0A0C10] flex flex-col justify-between hover:border-white/20 transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Enterprise</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 uppercase font-semibold">
                  Custom SLA
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-white">$49</span>
                <span className="text-xs text-slate-400">/ member / month</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                For multinational corporations requiring strict isolation, custom models, and SOC2 compliance.
              </p>

              <div className="space-y-3 text-xs text-slate-300 border-t border-white/[0.06] pt-6 mb-8">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="font-semibold text-white">Unbreakable logical tenant isolation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Self-contained local AI reasoning</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>SAML / SSO & SCIM Directory sync</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Immutable audit logs & SOC2 compliance</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Dedicated Solutions Architect & 99.99% SLA</span>
                </div>
              </div>
            </div>

            <a
              href="#contact"
              className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-400/40 text-center text-xs font-semibold text-white transition active:scale-95"
            >
              Contact Enterprise Sales
            </a>
          </div>
        </div>
      </section>

      {/* 7. Enterprise Contact Section */}
      <section id="contact" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.06] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#3B82F6] text-xs font-semibold uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" /> Enterprise Advisory
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Connect Directly with our Systems Architecture Team
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Have questions about multi-tenant database partitioning, integrating autonomous agent workers, or migrating legacy Jira instances into CoreSync? Let&apos;s build together.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/[0.06] text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Sales & Architecture Inquiries</p>
                  <p className="text-slate-400 font-mono">sales@coresync.dev</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Security & Audit Compliance</p>
                  <p className="text-slate-400 font-mono">security@coresync.dev</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <Clock className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="font-semibold text-white">Guaranteed Response Window</p>
                  <p className="text-slate-400">Under 2 hours for enterprise evaluation inquiries</p>
                </div>
              </div>
            </div>

            {/* Live Infrastructure Status */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0A0C10] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                <span className="text-white font-medium">CoreSync Systems Operational</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                99.99% Uptime
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-[#0A0C10] border border-white/[0.08] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">
                Schedule a Private Architecture Walkthrough
              </h3>
              <p className="text-xs text-slate-400">
                Fill out the form below and an engineer will prepare a tailored demonstration for your organization.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-white/[0.06] py-12 text-xs text-slate-500 max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/coresync-mark.png"
              alt="CoreSync Logo"
              className="w-5 h-5 rounded-md object-contain"
            />
            <span className="text-base font-bold text-white">Core<span className="text-[#3B82F6]">Sync</span></span>
            <span className="text-slate-700">•</span>
            <span>Enterprise Work & AI Governance Platform</span>
          </div>
          <p>&copy; {new Date().getFullYear()} CoreSync Technologies, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
