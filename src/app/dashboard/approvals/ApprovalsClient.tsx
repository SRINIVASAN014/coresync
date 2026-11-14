"use client";

import * as React from "react";
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Bot, Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ApprovalsClientProps {
  approvals: any[];
}

export function ApprovalsClient({ approvals }: ApprovalsClientProps) {
  const [items, setItems] = React.useState(approvals);
  const [reviewedId, setReviewedId] = React.useState<string | null>(null);

  const handleDecision = async (id: string, decision: "APPROVED" | "REJECTED") => {
    setReviewedId(id);
    try {
      const res = await fetch("/api/ai/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, decision }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewedId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* 1. Header */}
      <div className="pb-4 border-b border-white/5 space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI Action Approval Center
          </h1>
        </div>
        <p className="text-xs text-neutral-400">
          Deterministic governance queue. Autonomous AI agents cannot execute mutations or assignments without human manager authorization.
        </p>
      </div>

      {/* 2. Pending Requests List */}
      <div className="space-y-4">
        {items.map((req) => {
          let parsedPayload: any = {};
          try {
            parsedPayload = JSON.parse(req.payload);
          } catch {
            parsedPayload = { details: req.payload };
          }

          return (
            <Card key={req.id} className="border-amber-500/20 bg-[#0E1015]">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {req.actionType.replace(/_/g, " ")}
                      </h3>
                      <p className="text-[11px] text-neutral-400">
                        Proposed by <span className="text-indigo-300 font-semibold">{req.requestedBy}</span> • {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Badge variant="warning">Awaiting Manager Sign-Off</Badge>
                </div>

                {/* Payload Details */}
                <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 font-mono text-xs text-neutral-300 space-y-1">
                  <span className="text-[10px] uppercase text-neutral-500 font-semibold block">
                    Proposed Mutation Payload:
                  </span>
                  <pre className="text-[11px] text-indigo-200 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(parsedPayload, null, 2)}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-neutral-500 font-mono">
                    Project: {req.project?.name || "Global Workspace"}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDecision(req.id, "REJECTED")}
                      disabled={reviewedId === req.id}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Reject
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDecision(req.id, "APPROVED")}
                      disabled={reviewedId === req.id}
                      className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Approve & Execute
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {items.length === 0 && (
          <div className="p-12 text-center rounded-xl border border-white/5 bg-[#0C0E12] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-semibold text-white">All Clear!</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              There are no pending AI agent mutations awaiting review. All autonomous suggestions have been addressed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
