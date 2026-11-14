import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { ProjectStatus, Priority, TaskStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    if (!plan || !plan.projectName || !plan.projectKey) {
      return NextResponse.json({ error: "Invalid plan payload" }, { status: 400 });
    }

    const org = await db.organization.findFirst();
    if (!org) throw new Error("No organization found in database");

    const session = await getServerSession();
    const owner = await db.user.findFirst({
      where: session?.user?.email ? { email: session.user.email } : undefined,
    });

    if (!owner) throw new Error("User required for ownership");

    // Ensure unique project key
    let uniqueKey = plan.projectKey.toUpperCase().slice(0, 4);
    const existing = await db.project.findFirst({
      where: { organizationId: org.id, key: uniqueKey },
    });
    if (existing) {
      uniqueKey = `${uniqueKey}${Math.floor(Math.random() * 9 + 1)}`;
    }

    // 1. Create the Project
    const project = await db.project.create({
      data: {
        name: plan.projectName,
        key: uniqueKey,
        description: plan.description || "",
        status: ProjectStatus.ACTIVE,
        priority: Priority.HIGH,
        organizationId: org.id,
        ownerId: owner.id,
      },
    });

    // 2. Create the Generated Issues
    for (let i = 0; i < (plan.tasks || []).length; i++) {
      const t = plan.tasks[i];
      await db.task.create({
        data: {
          key: `${project.key}-${i + 1}`,
          title: t.title,
          description: t.description || "",
          status: TaskStatus.TODO,
          priority: (t.priority as Priority) || Priority.MEDIUM,
          aiGenerated: true,
          projectId: project.id,
          creatorId: owner.id,
        },
      });
    }

    // 3. Log Immutable Audit Record
    await db.auditLog.create({
      data: {
        organizationId: org.id,
        userId: owner.id,
        userEmail: owner.email,
        action: "AI_PLAN_APPROVED_AND_DEPLOYED",
        entity: "Project",
        entityId: project.id,
        details: JSON.stringify({
          projectKey: project.key,
          tasksCount: (plan.tasks || []).length,
        }),
      },
    });

    return NextResponse.json({ success: true, projectId: project.id });
  } catch (error: any) {
    console.error("Failed to approve and deploy AI plan:", error);
    return NextResponse.json(
      { error: error.message || "Failed to deploy plan to database" },
      { status: 500 }
    );
  }
}
