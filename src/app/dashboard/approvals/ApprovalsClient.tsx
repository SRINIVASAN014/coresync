"use client";

import * as React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Bot,
  Sparkles,
  Loader2,
  History,
  Clock,
  ArrowRight,
  FileCode,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ApprovalsClientProps {
  initialPending?: any[];
  initialHistory?: any[];
  approvals?: any[]; // For backwards-compatibility
}

export function ApprovalsClient({
  initialPending = [],
  initialHistory = [],
  approvals = [],
}: ApprovalsClientProps) {
  const [pendingItems, setPendingItems] = React.useState<any[]>(
    initialPending.length > 0 ? initialPending : approvals
  );
  const [historyItems, setHistoryItems] = React.useState<any[]>(initialHistory);
  const [activeTab, setActiveTab] = React.useState<"PENDING" | "HISTORY">("PENDING");
  const [reviewedId, setReviewedId] = React.useState<string | null>(null);
  const [isSimulating, setIsSimulating] = React.useState(false);

  // Handle human manager decision
  const handleDecision = async (id: string, decision: "APPROVED" | "REJECTED") => {
    setReviewedId(id);
    try {
      const res = await fetch("/api/ai/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, decision }),
      });
      if (res.ok) {
        const data = await res.json();
        const decidedItem = pendingItems.find((i) => i.id === id);
        // Remove from pending
        setPendingItems((prev) => prev.filter((i) => i.id !== id));
        // Add to history
        if (decidedItem) {
          setHistoryItems((prev) => [
            {
              ...decidedItem,
              status: decision,
              updatedAt: new Date().toISOString(),
              reviewedBy: data.updated?.reviewedBy || { name: "You (Active Session)" },
            },
            ...prev,
          ]);
        }
      }
    } catch (err) {
      console.error("Decision failed:", err);
    } finally {
      setReviewedId(null);
    }
  };

  // Simulate an AI Agent proposal
  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/ai/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulate: true }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.created) {
          setPendingItems((prev) => [data.created, ...prev]);
          setActiveTab("PENDING");
        }
      }
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* 1. Header with Simulation Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              AI Action Approval Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Deterministic governance queue. Autonomous AI agents cannot execute mutations, reassignments, or configuration changes without explicit human manager authorization.
          </p>
        </div>

        <Button
          variant="ai"
          size="sm"
          onClick={handleSimulate}
          disabled={isSimulating}
          className="font-semibold shadow-xs self-start sm:self-auto shrink-0"
        >
          {isSimulating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5 text-[#6554C0]" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#6554C0]" />
          )}
          <span>Simulate AI Proposal</span>
        </Button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("PENDING")}
          className={cn(
            "flex items-center gap-2 pb-3 px-1 text-xs font-semibold border-b-2 transition-colors cursor-pointer",
            activeTab === "PENDING"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Review</span>
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-bold font-mono",
              pendingItems.length > 0
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            )}
          >
            {pendingItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("HISTORY")}
          className={cn(
            "flex items-center gap-2 pb-3 px-1 text-xs font-semibold border-b-2 transition-colors cursor-pointer",
            activeTab === "HISTORY"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          <History className="w-4 h-4" />
          <span>Audit & Execution History</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold font-mono bg-slate-100 text-slate-600 border border-slate-200">
            {historyItems.length}
          </span>
        </button>
      </div>

      {/* 3. Pending Tab Content */}
      {activeTab === "PENDING" && (
        <div className="space-y-4">
          {pendingItems.map((req) => {
            let parsedPayload: any = {};
            try {
              parsedPayload = JSON.parse(req.payload);
            } catch {
              parsedPayload = { details: req.payload };
            }

            return (
              <Card
                key={req.id}
                className="border-amber-200/90 bg-white shadow-xs hover:border-amber-300 transition"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/80">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {req.actionType.replace(/_/g, " ")}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Proposed by{" "}
                          <span className="text-indigo-600 font-semibold">
                            {req.requestedBy}
                          </span>{" "}
                          • {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border tracking-wide select-none bg-amber-50 text-amber-800 border-amber-200 self-start sm:self-auto">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Awaiting Manager Sign-Off</span>
                    </span>
                  </div>

                  {/* Payload Details */}
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-hidden shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                      <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-blue-400" />
                        Proposed Mutation Payload
                      </span>
                      <span className="text-emerald-400 text-[10px]">Deterministic Sandbox</span>
                    </div>
                    <pre className="text-[11px] text-cyan-300 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-64">
                      {JSON.stringify(parsedPayload, null, 2)}
                    </pre>
                  </div>

                  {/* Actions & Project Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-slate-500">
                      Target Project:{" "}
                      <span className="font-semibold text-slate-800">
                        {req.project?.name || "Global Workspace"}
                      </span>
                      {req.project?.key && (
                        <span className="ml-1.5 font-mono text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                          {req.project.key}
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDecision(req.id, "REJECTED")}
                        disabled={reviewedId === req.id}
                        className="border-slate-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        <span>Reject</span>
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDecision(req.id, "APPROVED")}
                        disabled={reviewedId === req.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        <span>Approve & Execute</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {pendingItems.length === 0 && (
            <div className="p-12 text-center rounded-xl border border-slate-200 bg-white space-y-4 shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">All Clear!</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  There are no pending AI agent mutations awaiting review. All autonomous suggestions have been addressed and synchronized with PostgreSQL.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSimulate}
                disabled={isSimulating}
                className="text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Simulate AI Agent Request
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 4. History Tab Content */}
      {activeTab === "HISTORY" && (
        <div className="space-y-3">
          {historyItems.map((item) => {
            const isApproved = item.status === "APPROVED";
            let parsedPayload: any = {};
            try {
              parsedPayload = JSON.parse(item.payload);
            } catch {
              parsedPayload = { details: item.payload };
            }

            return (
              <Card key={item.id} className="border-slate-200 bg-white shadow-2xs">
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      {isApproved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {item.actionType.replace(/_/g, " ")}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Proposed by <span className="text-slate-700 font-medium">{item.requestedBy}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[11px] font-semibold border",
                          isApproved
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        )}
                      >
                        {item.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Project:{" "}
                      <span className="text-slate-700 font-medium">
                        {item.project?.name || "Global Workspace"}
                      </span>
                    </span>
                    <span>
                      Reviewed by:{" "}
                      <span className="text-slate-800 font-semibold">
                        {item.reviewedBy?.name || item.reviewedBy?.email || "Manager"}
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {historyItems.length === 0 && (
            <div className="p-12 text-center rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
              <History className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-semibold text-slate-900">No History Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once decisions are made on AI agent proposals, immutable audit records will appear here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
