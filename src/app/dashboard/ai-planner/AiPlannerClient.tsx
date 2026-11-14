"use client";

import * as React from "react";
import { Sparkles, Loader2, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatusIcon, PriorityIcon } from "@/components/kanban/LinearIcons";
import { Priority, TaskStatus } from "@prisma/client";

export function AiPlannerClient() {
  const [goal, setGoal] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isApproving, setIsApproving] = React.useState(false);
  const [plan, setPlan] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const sampleGoals = [
    "Architect an ISO27001 & SOC2 Compliant Cloud Infrastructure",
    "Develop a High-Throughput Real-Time Payments Gateway",
    "Implement Zero-Trust Identity, SSO, and MFA with WebAuthn",
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goal.trim()) return;

    setIsGenerating(true);
    setError(null);
    setPlan(null);

    try {
      const res = await fetch("/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate plan");
      setPlan(data.plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAndDeploy = async () => {
    if (!plan) return;
    setIsApproving(true);

    try {
      const res = await fetch("/api/ai/planner/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to deploy plan");

      // Redirect to the newly created project board
      window.location.href = `/dashboard/project/${data.projectId}`;
    } catch (err: any) {
      setError(err.message);
      setIsApproving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* 1. Header */}
      <div className="pb-4 border-b border-slate-200 space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Project Planner & Decomposer
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Transform high-level product objectives into structured roadmaps, milestones, and Linear issues with human-in-the-loop governance.
        </p>
      </div>

      {/* 2. Goal Input Card */}
      <Card className="border-blue-200 bg-blue-50/20 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleGenerate} className="space-y-3">
            <label className="text-xs font-semibold text-slate-800 block">
              What do you want to build or achieve?
            </label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="e.g. Build an enterprise single sign-on (SSO) architecture supporting SAML 2.0, OAuth2 PKCE, and role-based access control with SOC2 compliance..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed resize-none transition"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">Quick ideas:</span>
                {sampleGoals.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGoal(sample)}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition text-[11px] whitespace-nowrap cursor-pointer shadow-2xs"
                  >
                    {sample.slice(0, 32)}...
                  </button>
                ))}
              </div>

              <Button
                variant="ai"
                size="sm"
                type="submit"
                disabled={!goal.trim() || isGenerating}
                className="flex-shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    <span>Analyzing & Decomposing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    <span>Generate Sprint Plan</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Generated Plan Preview & Human Approval */}
      {plan && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  Proposed Project Staged for Review
                </span>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {plan.projectKey}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">{plan.projectName}</h2>
                </div>
              </div>

              {/* Human Approval Button */}
              <Button
                variant="primary"
                size="sm"
                onClick={handleApproveAndDeploy}
                disabled={isApproving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    <span>Writing to Database...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    <span>Approve & Create in Database</span>
                  </>
                )}
              </Button>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {plan.description}
              </p>

              {/* Milestones / Epics */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Sprint Milestones ({plan.milestones?.length || 0})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(plan.milestones || []).map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 shadow-2xs"
                    >
                      <span className="text-[10px] font-mono text-blue-600 font-bold">
                        Milestone {idx + 1}
                      </span>
                      <p className="text-xs font-semibold text-slate-900">{m.title}</p>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {m.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated Issues List */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Generated Engineering Issues ({plan.tasks?.length || 0})
                </h3>
                <div className="space-y-2">
                  {(plan.tasks || []).map((t: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-blue-300 transition shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-400">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{t.title}</p>
                          <p className="text-[11px] text-slate-500">{t.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <PriorityIcon priority={t.priority || "MEDIUM"} className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                          {t.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
