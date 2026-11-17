import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { ApprovalStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Handle "Simulate AI Agent Proposal" for live testing & demonstrations
    if (body.simulate) {
      const org = await db.organization.findFirst();
      if (!org) {
        return NextResponse.json({ error: "No organization found" }, { status: 400 });
      }

      const projects = await db.project.findMany({
        where: { organizationId: org.id },
        take: 4,
      });
      const targetProj = projects.length > 0
        ? projects[Math.floor(Math.random() * projects.length)]
        : null;

      const simulationPool = [
        {
          requestedBy: "CyberGuard AI Agent (Autonomous Security Orchestrator)",
          actionType: "AUTOMATED_SECURITY_HARDENING_PROPOSAL",
          payload: JSON.stringify(
            {
              targetProject: targetProj?.name || "Enterprise Identity & Zero-Trust Access",
              proposedAction: "Enforce automated vulnerability scanning on pull request merge hooks",
              riskLevel: "LOW - Non-breaking automated CI/CD guardrail",
              suggestedActions: [
                "Deploy static analysis container in GitHub Actions",
                "Enforce zero-tolerance rule for CVE severity scores >= 7.0",
                "Trigger automated security rollback on container build failure",
              ],
              confidenceScore: 0.96,
            },
            null,
            2
          ),
        },
        {
          requestedBy: "CoreSync Autonomous Sprint Optimizer",
          actionType: "SPRINT_CAPACITY_REBALANCE_PROPOSAL",
          payload: JSON.stringify(
            {
              targetProject: targetProj?.name || "Cloud Infrastructure Zero-Day Hardening",
              proposedAction: "Rebalance sprint workload across active team contributors",
              bottleneckIdentified: "Lead engineer assigned 75% of open sprint points",
              suggestedRebalancing: [
                "Shift 2 unit-test and doc tasks to secondary contributors",
                "Adjust sprint burndown target by +1.5 days buffer",
              ],
              projectedDeliveryAcceleration: "+24% on-time sprint velocity",
            },
            null,
            2
          ),
        },
        {
          requestedBy: "Architect-AI Policy Engine",
          actionType: "DATABASE_INDEX_OPTIMIZATION_PROPOSAL",
          payload: JSON.stringify(
            {
              targetProject: targetProj?.name || "Enterprise Mobile SDK",
              proposedAction: "Create composite index on (tenantId, status, updatedAt)",
              estimatedLatencyReduction: "-42ms on heavy telemetry queries",
              impactAssessment: "Zero downtime online index migration using concurrent lock-free DDL",
            },
            null,
            2
          ),
        },
      ];

      const chosen = simulationPool[Math.floor(Math.random() * simulationPool.length)];

      const created = await db.approvalRequest.create({
        data: {
          organizationId: org.id,
          projectId: targetProj ? targetProj.id : null,
          requestedBy: chosen.requestedBy,
          requestedByType: "AI_AGENT",
          actionType: chosen.actionType,
          status: "PENDING",
          payload: chosen.payload,
        },
        include: {
          project: { select: { name: true, key: true } },
        },
      });

      return NextResponse.json({ success: true, created });
    }

    // 2. Handle Human Manager Approval / Rejection Decision
    const { id, decision } = body;

    if (!id || !["APPROVED", "REJECTED"].includes(decision)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const session = await getServerSession();
    const reviewer = await db.user.findFirst({
      where: session?.user?.email ? { email: session.user.email } : undefined,
    });

    const updated = await db.approvalRequest.update({
      where: { id },
      data: {
        status: decision as ApprovalStatus,
        reviewedById: reviewer?.id || null,
      },
      include: {
        project: { select: { name: true, key: true } },
        reviewedBy: { select: { name: true, email: true } },
      },
    });

    // Create Immutable Audit Log in PostgreSQL
    await db.auditLog.create({
      data: {
        organizationId: updated.organizationId,
        userId: reviewer?.id,
        userEmail: reviewer?.email,
        action: `AI_ACTION_${decision}`,
        entity: "ApprovalRequest",
        entityId: updated.id,
        details: JSON.stringify({
          actionType: updated.actionType,
          reviewedBy: reviewer?.name || reviewer?.email || "Manager",
        }),
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error("Failed to process approval:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process approval decision" },
      { status: 500 }
    );
  }
}
