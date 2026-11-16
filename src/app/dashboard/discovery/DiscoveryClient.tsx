"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Rocket,
  Plane,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Sparkles,
  Zap,
  Calendar,
  Layers,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Custom SVG Icons matching Jira Product Discovery styling
function IdeaListIcon({ className = "w-4 h-4 text-slate-500" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="8" r="1.5" fill="currentColor" />
      <circle cx="5" cy="16" r="1.5" fill="currentColor" />
      <line x1="10" y1="8" x2="20" y2="8" />
      <line x1="10" y1="16" x2="20" y2="16" />
    </svg>
  );
}

function MatrixIcon({ className = "w-4 h-4 text-slate-500" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4v16h16" />
      <circle cx="9" cy="9" r="1.8" fill="currentColor" />
      <circle cx="16" cy="7" r="1.8" fill="currentColor" />
      <circle cx="13" cy="14" r="1.8" fill="currentColor" />
    </svg>
  );
}

function TimelineBarsIcon({ className = "w-4 h-4 text-slate-500" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="5" y1="18" x2="14" y2="18" />
    </svg>
  );
}

export type DiscoveryViewType =
  | "initiatives"
  | "all-ideas"
  | "priority-scoring"
  | "impact-assessment"
  | "strategic-matrix"
  | "impact-vs-effort"
  | "horizon-roadmap"
  | "roadmap"
  | "milestone-schedule"
  | "timeline"
  | "active-delivery"
  | "in-flight";

interface DiscoveryIdea {
  id: string;
  key: string;
  title: string;
  description: string;
  status: "Exploration" | "Validating" | "Committed" | "In Flight" | "Shipped";
  impact: 1 | 2 | 3 | 4 | 5; // 1 (Low) to 5 (Very High)
  effort: 1 | 2 | 3 | 4 | 5; // 1 (Low) to 5 (High)
  reach: string;
  confidence: number; // percentage, e.g. 80
  votes: number;
  stage: "NOW" | "NEXT" | "LATER";
  flightStage: "KICKOFF" | "DEV" | "REVIEW" | "SHIPPED";
  assignee: { name: string; avatar: string };
  quarter: "Q4 2026" | "Q1 2027" | "Q2 2027";
}

const INITIAL_IDEAS: DiscoveryIdea[] = [
  {
    id: "idea-1",
    key: "DISC-101",
    title: "Self-Serve Enterprise SSO & Okta SCIM Directory Sync",
    description: "Automated SAML 2.0 provisioning for multinational corporate IT administrators.",
    status: "Committed",
    impact: 5,
    effort: 2,
    reach: "45 Enterprise Accounts",
    confidence: 95,
    votes: 48,
    stage: "NOW",
    flightStage: "DEV",
    assignee: { name: "Alex Mercer", avatar: "A" },
    quarter: "Q4 2026",
  },
  {
    id: "idea-2",
    key: "DISC-102",
    title: "CoreSync Autonomous AI Sprint Estimator & Subtask Auto-Planner",
    description: "In-house deterministic neural engine decomposing tasks into 12ms sprint roadmaps.",
    status: "In Flight",
    impact: 5,
    effort: 3,
    reach: "100% of Active Teams",
    confidence: 90,
    votes: 62,
    stage: "NOW",
    flightStage: "DEV",
    assignee: { name: "Sarah Lin", avatar: "S" },
    quarter: "Q4 2026",
  },
  {
    id: "idea-3",
    key: "DISC-103",
    title: "Real-Time WebSocket Collaborative Whiteboard & Flowcharts",
    description: "Interactive visual system architecture canvas embedded directly into Linear issues.",
    status: "Validating",
    impact: 4,
    effort: 4,
    reach: "12,000 Developers",
    confidence: 80,
    votes: 35,
    stage: "NEXT",
    flightStage: "KICKOFF",
    assignee: { name: "David Kim", avatar: "D" },
    quarter: "Q1 2027",
  },
  {
    id: "idea-4",
    key: "DISC-104",
    title: "PostgreSQL Logical Tenant Separation with Neon AWS Auto-Scaling",
    description: "Mathematical zero-trust database partitioning per enterprise workspace slug.",
    status: "Shipped",
    impact: 5,
    effort: 1,
    reach: "Security & SOC2 Audits",
    confidence: 100,
    votes: 54,
    stage: "NOW",
    flightStage: "SHIPPED",
    assignee: { name: "Elena Rostova", avatar: "E" },
    quarter: "Q4 2026",
  },
  {
    id: "idea-5",
    key: "DISC-105",
    title: "Bidirectional Jira & Linear One-Click Migration Tool",
    description: "Full historical issue, attachment, and epic schema importer with zero data loss.",
    status: "Exploration",
    impact: 3,
    effort: 2,
    reach: "Prospective Migrating Teams",
    confidence: 75,
    votes: 29,
    stage: "LATER",
    flightStage: "KICKOFF",
    assignee: { name: "Michael Chang", avatar: "M" },
    quarter: "Q2 2027",
  },
  {
    id: "idea-6",
    key: "DISC-106",
    title: "Human-in-the-Loop AI Rebalancing Approval Drawer",
    description: "Cryptographic manager confirmation gate prior to agent mutations on live boards.",
    status: "In Flight",
    impact: 4,
    effort: 2,
    reach: "Team Leads & PMs",
    confidence: 85,
    votes: 41,
    stage: "NOW",
    flightStage: "REVIEW",
    assignee: { name: "Alex Mercer", avatar: "A" },
    quarter: "Q4 2026",
  },
];

export function DiscoveryClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawView = (searchParams.get("view") as DiscoveryViewType) || "horizon-roadmap";
  const activeView: "initiatives" | "priority-scoring" | "strategic-matrix" | "horizon-roadmap" | "milestone-schedule" | "active-delivery" =
    rawView === "all-ideas" || rawView === "initiatives" ? "initiatives" :
    rawView === "impact-assessment" || rawView === "priority-scoring" ? "priority-scoring" :
    rawView === "impact-vs-effort" || rawView === "strategic-matrix" ? "strategic-matrix" :
    rawView === "timeline" || rawView === "milestone-schedule" ? "milestone-schedule" :
    rawView === "in-flight" || rawView === "active-delivery" ? "active-delivery" :
    "horizon-roadmap";

  const [ideas, setIdeas] = React.useState<DiscoveryIdea[]>(INITIAL_IDEAS);
  const [searchFilter, setSearchFilter] = React.useState("");
  const [isNewIdeaModalOpen, setIsNewIdeaModalOpen] = React.useState(false);

  // New Idea Form
  const [newTitle, setNewTitle] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");
  const [newImpact, setNewImpact] = React.useState<1 | 2 | 3 | 4 | 5>(4);
  const [newEffort, setNewEffort] = React.useState<1 | 2 | 3 | 4 | 5>(2);
  const [newStage, setNewStage] = React.useState<"NOW" | "NEXT" | "LATER">("NEXT");

  const handleSelectView = (view: "initiatives" | "priority-scoring" | "strategic-matrix" | "horizon-roadmap" | "milestone-schedule" | "active-delivery") => {
    router.push(`/dashboard/discovery?view=${view}`);
  };

  const handleUpvote = (id: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
      )
    );
  };

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const nextId = `idea-${Date.now()}`;
    const nextKey = `DISC-${ideas.length + 101}`;

    const created: DiscoveryIdea = {
      id: nextId,
      key: nextKey,
      title: newTitle.trim(),
      description: newDesc.trim() || "Discovery feature requirement.",
      status: "Exploration",
      impact: newImpact,
      effort: newEffort,
      reach: "All Team Members",
      confidence: 80,
      votes: 1,
      stage: newStage,
      flightStage: "KICKOFF",
      assignee: { name: "Current User", avatar: "U" },
      quarter: newStage === "NOW" ? "Q4 2026" : newStage === "NEXT" ? "Q1 2027" : "Q2 2027",
    };

    setIdeas([created, ...ideas]);
    setNewTitle("");
    setNewDesc("");
    setIsNewIdeaModalOpen(false);
  };

  const filteredIdeas = ideas.filter(
    (i) =>
      i.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      i.key.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      
      {/* 1. Project Breadcrumb & Strategy Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Projects</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">Product Strategy Hub</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* CoreSync Strategy 3-Color Badge */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 flex items-center justify-center shadow-sm flex-shrink-0">
              <div className="w-4 h-4 rounded-xs bg-slate-900/30 flex items-center justify-center text-white text-xs font-bold">
                ✦
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Product Strategy Hub
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0C66E4] border border-blue-200">
                  STRATEGY
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Capture feature opportunities, score value vs. engineering effort, and drive delivery roadmaps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsNewIdeaModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0C66E4] hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Initiative</span>
            </button>
          </div>
        </div>

        {/* 2. Strategy Tabbed View Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto mt-6 border-b border-slate-200 pb-0">
          
          {/* View 1: Initiative Catalog */}
          <button
            onClick={() => handleSelectView("initiatives")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition cursor-pointer whitespace-nowrap",
              activeView === "initiatives"
                ? "border-[#0C66E4] text-[#0C66E4] font-semibold bg-blue-50/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            )}
          >
            <IdeaListIcon />
            <span>Initiative Catalog</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
              {ideas.length}
            </span>
          </button>

          {/* View 2: Priority Scoring */}
          <button
            onClick={() => handleSelectView("priority-scoring")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition cursor-pointer whitespace-nowrap",
              activeView === "priority-scoring"
                ? "border-[#0C66E4] text-[#0C66E4] font-semibold bg-blue-50/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            )}
          >
            <IdeaListIcon />
            <span>Priority Scoring</span>
          </button>

          {/* View 3: Strategic Matrix */}
          <button
            onClick={() => handleSelectView("strategic-matrix")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition cursor-pointer whitespace-nowrap",
              activeView === "strategic-matrix"
                ? "border-[#0C66E4] text-[#0C66E4] font-semibold bg-blue-50/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            )}
          >
            <MatrixIcon />
            <span>Strategic Matrix</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
              Matrix
            </span>
          </button>

          {/* View 4: Horizon Roadmap (🚀) */}
          <button
            onClick={() => handleSelectView("horizon-roadmap")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition cursor-pointer whitespace-nowrap",
              activeView === "horizon-roadmap"
                ? "border-[#0C66E4] text-[#0C66E4] font-semibold bg-blue-50/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            )}
          >
            <span className="text-base leading-none">🚀</span>
            <span>Horizon Roadmap</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold font-mono">
              Now / Next
            </span>
          </button>

          {/* View 5: Milestone Schedule */}
          <button
            onClick={() => handleSelectView("milestone-schedule")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition cursor-pointer whitespace-nowrap",
              activeView === "milestone-schedule"
                ? "border-[#0C66E4] text-[#0C66E4] font-semibold bg-blue-50/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            )}
          >
            <TimelineBarsIcon />
            <span>Milestone Schedule</span>
          </button>

          {/* View 6: Active Delivery */}
          <button
            onClick={() => handleSelectView("active-delivery")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition cursor-pointer whitespace-nowrap",
              activeView === "active-delivery"
                ? "border-[#0C66E4] text-[#0C66E4] font-semibold bg-blue-50/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            )}
          >
            <span className="text-base leading-none">✈️</span>
            <span>Active Delivery</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-semibold">
              Sprint
            </span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 ml-1" />
          <input
            type="text"
            placeholder="Search ideas, keys, or architectural drivers..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full text-xs bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Showing {filteredIdeas.length} of {ideas.length} ideas</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: INITIATIVE CATALOG */}
      {/* ========================================================================= */}
      {activeView === "initiatives" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Idea & Key</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Impact</th>
                <th className="py-3 px-4">Effort</th>
                <th className="py-3 px-4">Quarter</th>
                <th className="py-3 px-4">Votes</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIdeas.map((idea) => (
                <tr key={idea.id} className="hover:bg-slate-50/80 transition group">
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono font-bold text-[#0C66E4] text-[11px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 flex-shrink-0">
                        {idea.key}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 leading-snug group-hover:text-[#0C66E4] transition-colors">
                          {idea.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {idea.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        idea.status === "Committed" && "bg-blue-50 text-blue-700 border-blue-200",
                        idea.status === "In Flight" && "bg-purple-50 text-purple-700 border-purple-200",
                        idea.status === "Validating" && "bg-amber-50 text-amber-700 border-amber-200",
                        idea.status === "Exploration" && "bg-slate-100 text-slate-700 border-slate-200",
                        idea.status === "Shipped" && "bg-emerald-50 text-emerald-700 border-emerald-200"
                      )}
                    >
                      {idea.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-2.5 h-2.5 rounded-xs",
                            i <= idea.impact ? "bg-[#0C66E4]" : "bg-slate-200"
                          )}
                        />
                      ))}
                      <span className="text-[10px] font-mono text-slate-500 ml-1">
                        {idea.impact}/5
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {idea.effort === 1 ? "XS (1w)" : idea.effort === 2 ? "S (2w)" : idea.effort === 3 ? "M (4w)" : idea.effort === 4 ? "L (8w)" : "XL (12w)"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {idea.quarter}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleUpvote(idea.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#0C66E4] border border-slate-200 text-slate-700 font-mono text-xs transition cursor-pointer shadow-2xs"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{idea.votes}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleSelectView("horizon-roadmap")}
                      className="text-xs text-[#0C66E4] hover:underline font-medium cursor-pointer"
                    >
                      View on Roadmap →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: PRIORITY SCORING (Value Scoring & Weights) */}
      {/* ========================================================================= */}
      {activeView === "priority-scoring" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-blue-900">
                Formula: Value Score = (Reach × Impact × Confidence) / Effort
              </h3>
              <p className="text-[11px] text-blue-700">
                Sort features scientifically before committing engineering sprint bandwidth.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-800 bg-white px-2.5 py-1 rounded border border-blue-200">
              RICE Active
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Feature Idea</th>
                  <th className="py-3 px-4">Reach</th>
                  <th className="py-3 px-4">Impact Rating</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Effort</th>
                  <th className="py-3 px-4">Priority Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIdeas.map((idea) => {
                  const score = Math.round(
                    ((idea.impact * 20) * (idea.confidence / 100)) / (idea.effort * 0.8)
                  );

                  return (
                    <tr key={idea.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{idea.title}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{idea.key}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {idea.reach}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[10px]">
                          {idea.impact === 5 ? "Very High (5)" : idea.impact === 4 ? "High (4)" : "Medium (3)"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {idea.confidence}%
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {idea.effort * 2} Sprints
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0C66E4]"
                              style={{ width: `${Math.min(score, 100)}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {score}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: STRATEGIC MATRIX (2x2 Quadrant Prioritization) */}
      {/* ========================================================================= */}
      {activeView === "strategic-matrix" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>2x2 Prioritization Matrix: Compare High-Value Quick Wins against Strategic Major Bets</span>
            <span className="font-mono text-slate-500">Interactive Visual Layout</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[460px]">
            {/* Quadrant 1: Quick Wins (Top-Left: High Impact, Low Effort) */}
            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <h3 className="text-sm font-bold text-emerald-950">
                      ⚡ Quick Wins (High Impact, Low Effort)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Highest Priority
                  </span>
                </div>

                <div className="space-y-2.5">
                  {filteredIdeas
                    .filter((i) => i.impact >= 4 && i.effort <= 2)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white rounded-xl border border-emerald-200/80 shadow-2xs hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {item.key}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">▲ {item.votes}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 mt-1">{item.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.reach}</p>
                      </div>
                    ))}
                </div>
              </div>
              <p className="text-[10px] text-emerald-700 font-mono pt-3">
                Action: Fast-track immediately into the current active sprint.
              </p>
            </div>

            {/* Quadrant 2: Strategic Bets (Top-Right: High Impact, High Effort) */}
            <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#0C66E4]" />
                    <h3 className="text-sm font-bold text-blue-950">
                      🎯 Strategic Projects (High Impact, High Effort)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Major Roadmap
                  </span>
                </div>

                <div className="space-y-2.5">
                  {filteredIdeas
                    .filter((i) => i.impact >= 4 && i.effort > 2)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white rounded-xl border border-blue-200/80 shadow-2xs hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-[#0C66E4] bg-blue-50 px-1.5 py-0.2 rounded">
                            {item.key}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">▲ {item.votes}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 mt-1">{item.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.reach}</p>
                      </div>
                    ))}
                </div>
              </div>
              <p className="text-[10px] text-blue-700 font-mono pt-3">
                Action: Break into multi-phase architectural milestones.
              </p>
            </div>

            {/* Quadrant 3: Fill-Ins (Bottom-Left: Low Impact, Low Effort) */}
            <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-bold text-amber-950">
                      🔨 Fill-Ins (Low Impact, Low Effort)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Secondary
                  </span>
                </div>

                <div className="space-y-2.5">
                  {filteredIdeas
                    .filter((i) => i.impact < 4 && i.effort <= 2)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs hover:shadow-md transition cursor-pointer"
                      >
                        <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                          {item.key}
                        </span>
                        <p className="text-xs font-semibold text-slate-900 mt-1">{item.title}</p>
                      </div>
                    ))}
                </div>
              </div>
              <p className="text-[10px] text-amber-700 font-mono pt-3">
                Action: Execute during developer cool-down weeks.
              </p>
            </div>

            {/* Quadrant 4: Deprioritize (Bottom-Right: Low Impact, High Effort) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-400" />
                    <h3 className="text-sm font-bold text-slate-800">
                      ⏳ Reconsider (Low Impact, High Effort)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Hold
                  </span>
                </div>

                <p className="text-xs text-slate-500 italic">
                  No items currently categorized in this low-ROI quadrant.
                </p>
              </div>
              <p className="text-[10px] text-slate-500 font-mono pt-3">
                Action: Reject or scope down aggressively.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: HORIZON ROADMAP (Now / Next / Later - Rocket 🚀 Highlighted View) */}
      {/* ========================================================================= */}
      {activeView === "horizon-roadmap" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🚀</span>
              <div>
                <h3 className="text-xs font-bold text-blue-900">
                  Horizon Delivery Roadmap
                </h3>
                <p className="text-[11px] text-blue-700">
                  Organized by commitment horizon: Now (Current Sprint), Next (Upcoming Q1), and Later (H2 Horizon).
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#0C66E4] bg-white px-3 py-1 rounded-lg border border-blue-200 shadow-2xs">
              Live Delivery Board
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1: NOW */}
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/20 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0C66E4]" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Now · Committed
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {ideas.filter((i) => i.stage === "NOW").length}
                </span>
              </div>

              <div className="space-y-3">
                {ideas
                  .filter((i) => i.stage === "NOW")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition space-y-2 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[#0C66E4] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {item.key}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-slate-500">
                          {item.quarter}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1.5 font-medium text-slate-600">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0C66E4] flex items-center justify-center font-bold text-[9px]">
                            {item.assignee.avatar}
                          </span>
                          <span>{item.assignee.name}</span>
                        </div>
                        <span className="font-mono text-[#0C66E4] font-semibold">▲ {item.votes}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: NEXT */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Next · Planned
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  {ideas.filter((i) => i.stage === "NEXT").length}
                </span>
              </div>

              <div className="space-y-3">
                {ideas
                  .filter((i) => i.stage === "NEXT")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-purple-300 transition space-y-2 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                          {item.key}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-slate-500">
                          {item.quarter}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1.5 font-medium text-slate-600">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[9px]">
                            {item.assignee.avatar}
                          </span>
                          <span>{item.assignee.name}</span>
                        </div>
                        <span className="font-mono text-slate-600 font-semibold">▲ {item.votes}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 3: LATER */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Later · Future Horizon
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {ideas.filter((i) => i.stage === "LATER").length}
                </span>
              </div>

              <div className="space-y-3">
                {ideas
                  .filter((i) => i.stage === "LATER")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-2 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {item.key}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-slate-500">
                          {item.quarter}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1.5 font-medium text-slate-600">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[9px]">
                            {item.assignee.avatar}
                          </span>
                          <span>{item.assignee.name}</span>
                        </div>
                        <span className="font-mono text-slate-500">▲ {item.votes}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 5: MILESTONE SCHEDULE (Gantt Schedule) */}
      {/* ========================================================================= */}
      {activeView === "milestone-schedule" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Milestone Execution Timeline (2026 - 2027)
              </h3>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <span>Nov 2026</span>
                <span>Dec 2026</span>
                <span>Jan 2027</span>
                <span>Feb 2027</span>
                <span>Mar 2027</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {filteredIdeas.map((idea, idx) => (
                <div key={idea.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{idea.title}</span>
                    <span className="font-mono text-slate-500 text-[11px]">{idea.quarter}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-6 rounded-lg relative overflow-hidden flex items-center p-1">
                    <div
                      className={cn(
                        "h-4 rounded-md text-[10px] text-white font-mono font-bold flex items-center px-2",
                        idx % 3 === 0 && "bg-[#0C66E4]",
                        idx % 3 === 1 && "bg-purple-600",
                        idx % 3 === 2 && "bg-emerald-600"
                      )}
                      style={{
                        marginLeft: `${(idx * 15) % 45}%`,
                        width: `${Math.max(idea.effort * 12, 35)}%`,
                      }}
                    >
                      {idea.key} · {idea.effort * 2}w
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 6: ACTIVE DELIVERY (Sprint Delivery Pipeline ✈️) */}
      {/* ========================================================================= */}
      {activeView === "active-delivery" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">✈️</span>
              <div>
                <h3 className="text-xs font-bold text-purple-900">
                  Active Delivery Pipeline Tracker
                </h3>
                <p className="text-[11px] text-purple-700">
                  Tracking features actively under implementation in Sprint 24.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-purple-800 bg-white px-3 py-1 rounded-lg border border-purple-200">
              Active Velocity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stage 1: Kickoff */}
            <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-3 space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-700">Kickoff</span>
                <span className="text-[10px] font-mono text-slate-500">
                  {ideas.filter((i) => i.flightStage === "KICKOFF").length}
                </span>
              </div>
              {ideas
                .filter((i) => i.flightStage === "KICKOFF")
                .map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-700">{item.key}</span>
                    <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                  </div>
                ))}
            </div>

            {/* Stage 2: In Dev */}
            <div className="bg-blue-50/30 rounded-xl border border-blue-200 p-3 space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-blue-200">
                <span className="text-xs font-semibold text-[#0C66E4]">In Development</span>
                <span className="text-[10px] font-mono text-blue-700 font-bold">
                  {ideas.filter((i) => i.flightStage === "DEV").length}
                </span>
              </div>
              {ideas
                .filter((i) => i.flightStage === "DEV")
                .map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded-lg border border-blue-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#0C66E4]">{item.key}</span>
                    <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                  </div>
                ))}
            </div>

            {/* Stage 3: Review */}
            <div className="bg-purple-50/30 rounded-xl border border-purple-200 p-3 space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-purple-200">
                <span className="text-xs font-semibold text-purple-700">Review & QA</span>
                <span className="text-[10px] font-mono text-purple-700 font-bold">
                  {ideas.filter((i) => i.flightStage === "REVIEW").length}
                </span>
              </div>
              {ideas
                .filter((i) => i.flightStage === "REVIEW")
                .map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded-lg border border-purple-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-mono font-bold text-purple-700">{item.key}</span>
                    <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                  </div>
                ))}
            </div>

            {/* Stage 4: Shipped */}
            <div className="bg-emerald-50/30 rounded-xl border border-emerald-200 p-3 space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-emerald-200">
                <span className="text-xs font-semibold text-emerald-700">Shipped</span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  {ideas.filter((i) => i.flightStage === "SHIPPED").length}
                </span>
              </div>
              {ideas
                .filter((i) => i.flightStage === "SHIPPED")
                .map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded-lg border border-emerald-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-700">{item.key}</span>
                    <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Create New Idea Modal */}
      {isNewIdeaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                <h3 className="text-base font-bold text-slate-900">Create New Feature Idea</h3>
              </div>
              <button
                onClick={() => setIsNewIdeaModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Idea Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automated Multi-Region Database Failover"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description / Customer Need</label>
                <textarea
                  rows={2}
                  placeholder="What customer problem does this feature solve?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Impact (1-5)</label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(Number(e.target.value) as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value={5}>5 - Very High</option>
                    <option value={4}>4 - High</option>
                    <option value={3}>3 - Medium</option>
                    <option value={2}>2 - Low</option>
                    <option value={1}>1 - Very Low</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Effort (1-5)</label>
                  <select
                    value={newEffort}
                    onChange={(e) => setNewEffort(Number(e.target.value) as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value={1}>1 - XS (1 week)</option>
                    <option value={2}>2 - S (2 weeks)</option>
                    <option value={3}>3 - M (4 weeks)</option>
                    <option value={4}>4 - L (8 weeks)</option>
                    <option value={5}>5 - XL (12 weeks)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Roadmap Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="NOW">Now (Current Sprint)</option>
                    <option value="NEXT">Next (Upcoming Q1)</option>
                    <option value="LATER">Later (Backlog)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewIdeaModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0C66E4] hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  Add Idea to Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
