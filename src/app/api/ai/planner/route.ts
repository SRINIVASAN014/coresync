import { NextResponse } from "next/server";
import { planSprintObjective } from "@/lib/ai/coresync-ai";

export async function POST(req: Request) {
  try {
    const { goal } = await req.json();

    if (!goal || typeof goal !== "string" || !goal.trim()) {
      return NextResponse.json(
        { error: "Goal statement required" },
        { status: 400 }
      );
    }

    const cleanGoal = goal.trim();

    // Execute CoreSync Independent AI (Proprietary in-house engine, < 25ms, zero external dependencies)
    const result = planSprintObjective(cleanGoal);

    return NextResponse.json({
      plan: result.plan,
      engine: result.engine,
      version: result.version,
      latencyMs: result.latencyMs,
      dataPrivacy: result.dataPrivacy,
      status: "SUCCESS",
    });
  } catch (error: any) {
    console.error("CoreSync Independent AI Planner error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate project plan" },
      { status: 500 }
    );
  }
}
