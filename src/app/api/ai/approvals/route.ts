import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { ApprovalStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { id, decision } = await req.json();

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
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        organizationId: updated.organizationId,
        userId: reviewer?.id,
        userEmail: reviewer?.email,
        action: `AI_ACTION_${decision}`,
        entity: "ApprovalRequest",
        entityId: updated.id,
        details: JSON.stringify({ actionType: updated.actionType }),
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
