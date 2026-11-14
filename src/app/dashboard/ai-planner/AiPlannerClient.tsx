"use client";

import * as React from "react";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Key,
  ExternalLink,
  X,
  Bot,
} from "lucide-react";
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
  const [planSource, setPlanSource] = React.useState<"gemini" | "synthesized">("synthesized");
  const [error, setError] = React.useState<string | null>(null);

  // Gemini API Key Connection State
  const [isGeminiConnected, setIsGeminiConnected] = React.useState<boolean>(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = React.useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = React.useState<string>("");
  const [isSavingKey, setIsSavingKey] = React.useState<boolean>(false);
  const [keySaveMessage, setKeySaveMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const sampleGoals = [
    "to develop the website",
    "Architect an ISO27001 & SOC2 Compliant Cloud Infrastructure",
    "Develop a High-Throughput Real-Time Payments Gateway",
    "Implement Zero-Trust Identity, SSO, and MFA with WebAuthn",
  ];

  // Fetch Gemini connection status on mount
  React.useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/settings/ai");
        if (res.ok) {
          const data = await res.json();
          setIsGeminiConnected(Boolean(data.isConfigured));
        }
      } catch {
        // Ignore network errors on init
      }
    }
    checkStatus();
  }, []);

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    setIsSavingKey(true);
    setKeySaveMessage(null);

    try {
      const res = await fetch("/api/settings/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to validate key");
      }

      setIsGeminiConnected(true);
      setKeySaveMessage({ type: "success", text: "Connected to Google Gemini 1.5 Flash!" });
      setTimeout(() => {
        setIsKeyModalOpen(false);
        setKeySaveMessage(null);
        setApiKeyInput("");
      }, 1200);
    } catch (err: any) {
      setKeySaveMessage({
        type: "error",
        text: err.message || "Failed to connect to Google Gemini API.",
      });
    } finally {
      setIsSavingKey(false);
    }
  };

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
      setPlanSource(data.source || (data.geminiConfigured ? "gemini" : "synthesized"));
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
      {/* 1. Header with Live Gemini Connection Badge */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              AI Project Planner & Decomposer
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Transform high-level product objectives into structured roadmaps, milestones, and Linear issues with human-in-the-loop governance.
          </p>
        </div>

        {/* Gemini Status Pill */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isGeminiConnected ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Gemini 1.5 Flash Connected</span>
            </div>
          ) : (
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold cursor-pointer transition shadow-2xs"
            >
              <Key className="w-3.5 h-3.5 text-blue-600" />
              <span>Connect Gemini API Key</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Goal Input Card */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleGenerate} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-900 block">
                What do you want to build or achieve?
              </label>
              {!isGeminiConnected && (
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Connect Gemini AI for live cloud reasoning</span>
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                rows={3}
                placeholder="e.g. to develop the website, build single sign-on architecture, or real-time payments..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 leading-relaxed resize-none transition shadow-2xs"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Quick ideas:</span>
                {sampleGoals.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGoal(sample)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 transition text-[11px] font-medium whitespace-nowrap cursor-pointer shadow-2xs"
                  >
                    {sample.slice(0, 32)}...
                  </button>
                ))}
              </div>

              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={!goal.trim() || isGenerating}
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 font-medium px-4"
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
          <Card className="border-blue-200 bg-white shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    Proposed Project Staged for Review
                  </span>

                  {planSource === "gemini" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Google Gemini 1.5 Flash
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      <Bot className="w-3 h-3 text-blue-600" />
                      CoreSync Architectural Engine
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-2">
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
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  Sprint Milestones ({plan.milestones?.length || 0})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(plan.milestones || []).map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs hover:border-blue-300 transition"
                    >
                      <span className="text-[10px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        Milestone {idx + 1}
                      </span>
                      <p className="text-xs font-semibold text-slate-900">{m.title}</p>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {m.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated Issues List */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  Generated Engineering Issues ({plan.tasks?.length || 0})
                </h3>
                <div className="space-y-2">
                  {(plan.tasks || []).map((t: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-blue-300 hover:shadow-2xs transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{t.title}</p>
                          <p className="text-[11px] text-slate-600">{t.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <PriorityIcon priority={t.priority || "MEDIUM"} className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700">
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

      {/* 4. Connect Google Gemini API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsKeyModalOpen(false)}
          />

          <div className="relative z-50 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <Key className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Connect Google Gemini AI
                </h3>
              </div>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Connect your Google Gemini API key to enable live AI sprint planning, automated backlog decomposition, and intelligent issue estimation.
            </p>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-800 space-y-1">
              <p className="font-semibold flex items-center gap-1">
                <span>Free Gemini API Key:</span>
              </p>
              <p className="text-[11px] text-blue-700">
                You can generate a free Gemini API key in seconds from Google AI Studio.
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline mt-1"
              >
                <span>Get API Key at Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  required
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>

              {keySaveMessage && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    keySaveMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {keySaveMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                  <span>{keySaveMessage.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsKeyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!apiKeyInput.trim() || isSavingKey}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSavingKey ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Validating Key...</span>
                    </>
                  ) : (
                    <span>Save & Connect</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
