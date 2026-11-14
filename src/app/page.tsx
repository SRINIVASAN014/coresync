import Link from "next/link";
import { getServerSession } from "next-auth";
import Navbar from "./components/Navbar";
import { LiveWordsHeadline } from "@/components/ui/LiveWordsHeadline";
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
} from "lucide-react";

export default async function LandingPage() {
  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#3B82F6]/30 font-sans flex flex-col relative">
      {/* 1. Global Persistent Violet Glow — Follows and stays visible on scroll */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-gradient-to-tr from-violet-600/22 via-[#8B5CF6]/20 to-[#3B82F6]/15 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* 2. Header with Top Left Navigation: Pricing, Templates, Contact, Capabilities */}
      <Navbar />

      {/* 3. Hero Section */}
      <div className="flex-1 flex flex-col justify-center relative py-24 sm:py-32 z-10">
        {/* Soft, Balanced Violet Center Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[380px] bg-gradient-to-tr from-violet-600/25 via-[#8B5CF6]/22 to-[#3B82F6]/18 blur-[120px] rounded-full pointer-events-none" />

        <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
          {/* Main Heading with Live Words in Motion on Reload and Scroll */}
          <LiveWordsHeadline />

          {/* Subtitle */}
          <p className="max-w-2xl text-lg sm:text-xl text-[#8A8F98] mb-12 leading-relaxed">
            Empower your engineering teams and autonomous AI agents to collaborate with effortless speed, absolute security, and crystal-clear visibility. Turn ambitious goals into completed sprints.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={session ? "/dashboard" : "/login"}
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

      {/* 4. Value Propositions & Enterprise Capabilities with Scrolled Violet Glow */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/5 w-full">
        {/* Scrolled Down Center Violet Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-gradient-to-tr from-violet-600/22 via-[#8B5CF6]/20 to-[#6366F1]/15 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Engineered for Visionary Engineering Organizations
          </h2>
          <p className="text-sm text-[#8A8F98]">
            Built with multi-tenant mathematical isolation, autonomous AI project decomposition, and trusted human-governed execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] hover:border-[#3B82F6]/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Unbreakable Multi-Company Isolation</h3>
            <p className="text-xs text-[#8A8F98] leading-relaxed">
              Enterprise-grade tenant boundaries guarantee Company A can never access Company B&apos;s projects, code artifacts, or proprietary workflows.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] hover:border-[#6366F1]/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Visionary AI Project Planner</h3>
            <p className="text-xs text-[#8A8F98] leading-relaxed">
              Convert high-level company missions into milestones, linked epics, and actionable Kanban tasks with dependency maps in seconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] hover:border-[#A855F7]/30 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center text-[#A855F7]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Human-Empowered AI Governance</h3>
            <p className="text-xs text-[#8A8F98] leading-relaxed">
              Empower autonomous AI agents with total peace of mind. Every AI-proposed sprint rebalance or task assignment requires manager authorization.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Pre-built Workspace Templates Section */}
      <section id="templates" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/5 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> Ready-to-Deploy Blueprints
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Engineered Workspace Templates
          </h2>
          <p className="text-sm text-[#8A8F98]">
            Jumpstart your engineering workflow in seconds with pre-configured schemas, issue hierarchies, and autonomous agent governance pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template 1: Linear Sprints */}
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] hover:border-[#3B82F6]/40 transition group">
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
            <p className="text-xs text-[#8A8F98] mb-4 leading-relaxed">
              Optimized for fast 2-week iterations. Features automated issue keys, signal-bar priority scoring, rapid-keyboard drawer editing, and zero-clutter Kanban flows.
            </p>
            <div className="space-y-1.5 text-xs text-neutral-300 mb-6">
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

          {/* Template 2: AI Agent Swarm */}
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] hover:border-[#8B5CF6]/40 transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold">
                AI Native
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
              Autonomous AI Agent Swarm
            </h3>
            <p className="text-xs text-[#8A8F98] mb-4 leading-relaxed">
              Built for teams integrating autonomous LLM agents into production roadmaps. Includes human approval gates, audit trails, and recursive task decomposition.
            </p>
            <div className="space-y-1.5 text-xs text-neutral-300 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Project Planner with Gemini 1.5 Flash</span>
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
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] hover:border-[#10B981]/40 transition group">
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
            <p className="text-xs text-[#8A8F98] mb-4 leading-relaxed">
              Vulnerability prioritization and patch lifecycle management with strict tenant isolation, immutable audit logs, and CVE tracking.
            </p>
            <div className="space-y-1.5 text-xs text-neutral-300 mb-6">
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
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0C0D11] hover:border-[#F59E0B]/40 transition group">
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
            <p className="text-xs text-[#8A8F98] mb-4 leading-relaxed">
              Organize multiple engineering initiatives across teams. Connect overarching strategic milestones down to individual contributor subtasks.
            </p>
            <div className="space-y-1.5 text-xs text-neutral-300 mb-6">
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
      <section id="pricing" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/5 w-full">
        {/* Ambient violet glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-violet-600/20 via-[#8B5CF6]/18 to-[#3B82F6]/14 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Transparent Enterprise Tiers
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Predictable Pricing for High-Scale Engineering
          </h2>
          <p className="text-sm text-[#8A8F98]">
            Start free for individuals and fast-moving teams. Scale to full multi-tenant mathematical isolation and custom enterprise SLAs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Tier 1: Starter */}
          <div className="p-7 rounded-2xl border border-white/10 bg-[#0C0D11] flex flex-col justify-between hover:border-white/20 transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Starter</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 uppercase">
                  Free Forever
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-neutral-400">/ forever</span>
              </div>
              <p className="text-xs text-[#8A8F98] mb-6 leading-relaxed">
                Ideal for individual engineers and boutique technical teams shipping initial MVPs.
              </p>

              <div className="space-y-3 text-xs text-neutral-300 border-t border-white/5 pt-6 mb-8">
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
                <div className="flex items-center gap-2.5 text-neutral-500">
                  <Check className="w-4 h-4 text-neutral-600 flex-shrink-0" />
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
                <span className="text-xs text-neutral-400">/ member / month</span>
              </div>
              <p className="text-xs text-[#8A8F98] mb-6 leading-relaxed">
                For fast-paced product teams scaling features with integrated AI agents.
              </p>

              <div className="space-y-3 text-xs text-neutral-200 border-t border-white/10 pt-6 mb-8">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span className="font-semibold text-white">Unlimited team members & projects</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                  <span>AI Project Planner with Gemini 1.5</span>
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
          <div className="p-7 rounded-2xl border border-white/10 bg-[#0C0D11] flex flex-col justify-between hover:border-white/20 transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Enterprise</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 uppercase font-semibold">
                  Custom SLA
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-white">$49</span>
                <span className="text-xs text-neutral-400">/ member / month</span>
              </div>
              <p className="text-xs text-[#8A8F98] mb-6 leading-relaxed">
                For multinational corporations requiring strict isolation, custom models, and SOC2 compliance.
              </p>

              <div className="space-y-3 text-xs text-neutral-300 border-t border-white/5 pt-6 mb-8">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="font-semibold text-white">Unbreakable logical tenant isolation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Custom fine-tuned AI model routing</span>
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
      <section id="contact" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/5 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Inquiries and Architecture */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-semibold uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" /> Enterprise Advisory
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Connect Directly with our Systems Architecture Team
            </h2>
            <p className="text-sm text-[#8A8F98] leading-relaxed">
              Have questions about multi-tenant database partitioning, integrating autonomous agent workers, or migrating legacy Jira instances into CoreSync? Let&apos;s build together.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/5 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Sales & Architecture Inquiries</p>
                  <p className="text-neutral-400 font-mono">sales@coresync.dev</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Security & Audit Compliance</p>
                  <p className="text-neutral-400 font-mono">security@coresync.dev</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 flex-shrink-0">
                  <Clock className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="font-semibold text-white">Guaranteed Response Window</p>
                  <p className="text-neutral-400">Under 2 hours for enterprise evaluation inquiries</p>
                </div>
              </div>
            </div>

            {/* Live Infrastructure Status */}
            <div className="p-4 rounded-xl border border-white/10 bg-[#0C0D11] flex items-center justify-between text-xs">
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
          <div className="lg:col-span-7 bg-[#0C0D11] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">
                Schedule a Private Architecture Walkthrough
              </h3>
              <p className="text-xs text-[#8A8F98]">
                Fill out the form below and an engineer will prepare a tailored demonstration for your organization.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-white/5 py-12 text-xs text-[#8A8F98] max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">Core<span className="text-[#3B82F6]">Sync</span></span>
            <span className="text-neutral-500">•</span>
            <span>Enterprise Work & AI Governance Platform</span>
          </div>
          <p>&copy; {new Date().getFullYear()} CoreSync Technologies, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
