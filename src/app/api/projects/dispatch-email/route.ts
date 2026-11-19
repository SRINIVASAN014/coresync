import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendProjectCreatedEmail, TaskSummaryItem } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      projectId,
      recipientEmail,
      recipientName,
      recipientRole,
      note,
      selectedTaskIds,
      dispatchMode,
    } = body;

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {
      // Allow API-level access
    }

    const callerUser = await db.user.findFirst({
      where: session?.user?.email ? { email: session.user.email } : undefined,
    });

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        organization: true,
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // MNC Mode: Fan-out to all team members by role
    if (dispatchMode === "FAN_OUT_ALL") {
      const results: any[] = [];

      // Group tasks by assignee email
      const tasksByAssignee = new Map<string, typeof project.tasks>();
      for (const t of project.tasks) {
        const email = t.assignee?.email || project.owner.email;
        if (!tasksByAssignee.has(email)) {
          tasksByAssignee.set(email, []);
        }
        tasksByAssignee.get(email)!.push(t);
      }

      // Fan out email to each assignee with their role and split deliverables
      for (const [targetEmail, assignedTasks] of tasksByAssignee.entries()) {
        const memberRecord = project.members.find((m) => m.user.email === targetEmail);
        const memberRole = memberRecord?.role || (targetEmail === project.owner.email ? "OWNER" : "MEMBER");
        const memberName = memberRecord?.user.name || assignedTasks[0]?.assignee?.name || "Team Member";

        const tasksList: TaskSummaryItem[] = assignedTasks.map((t) => ({
          key: t.key,
          title: t.title,
          priority: t.priority,
          status: t.status,
          assigneeName: t.assignee?.name,
        }));

        const status = await sendProjectCreatedEmail({
          toEmail: targetEmail,
          toName: memberName,
          projectName: project.name,
          projectKey: project.key,
          projectId: project.id,
          description: note ? `${project.description || ""}\n\nNote: ${note}` : project.description,
          priority: project.priority,
          organizationName: project.organization?.name,
          tasksCount: assignedTasks.length,
          subjectPrefix: `⚡ [CoreSync] Work Package Allocated (${memberRole})`,
          headline: `Role Assignment: ${memberRole}`,
          recipientRole: memberRole,
          tasksList,
        });

        results.push({ email: targetEmail, role: memberRole, count: assignedTasks.length, status });
      }

      // Record Audit Log
      await db.auditLog.create({
        data: {
          action: "PROJECT_ROLE_FANOUT_DISPATCHED",
          entity: "Project",
          entityId: project.id,
          organizationId: project.organizationId,
          userId: callerUser?.id,
          userEmail: callerUser?.email,
          details: JSON.stringify({
            dispatchMode: "FAN_OUT_ALL",
            totalRecipients: results.length,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        mode: "FAN_OUT_ALL",
        totalRecipients: results.length,
        results,
      });
    }

    // Default: Targeted dispatch by Role or specific email
    const targetEmail = (recipientEmail || callerUser?.email || project.owner.email)?.trim();
    if (!targetEmail) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
    }

    // Filter tasks if specific task IDs are chosen
    let filteredTasks = project.tasks;
    if (selectedTaskIds && Array.isArray(selectedTaskIds) && selectedTaskIds.length > 0) {
      filteredTasks = project.tasks.filter((t) => selectedTaskIds.includes(t.id));
    }

    // Automatically link & assign tasks to recipient in DB so they appear immediately in "My Work"
    let targetUser: any = null;
    try {
      targetUser = await db.user.findUnique({
        where: { email: targetEmail },
      });

      if (!targetUser) {
        targetUser = await db.user.create({
          data: {
            email: targetEmail,
            name: recipientName || targetEmail.split("@")[0],
          },
        });
      }

      // Ensure membership in project
      const existingMember = await db.projectMember.findFirst({
        where: { projectId: project.id, userId: targetUser.id },
      });
      if (!existingMember) {
        await db.projectMember.create({
          data: {
            projectId: project.id,
            userId: targetUser.id,
            role: "MEMBER",
          },
        });
      }

      // Assign the selected split tasks to this employee
      if (filteredTasks.length > 0) {
        await db.task.updateMany({
          where: { id: { in: filteredTasks.map((t) => t.id) } },
          data: { assigneeId: targetUser.id },
        });
      }
    } catch (assignErr) {
      console.warn("Non-blocking task assignment error:", assignErr);
    }

    const tasksList: TaskSummaryItem[] = filteredTasks.map((t) => ({
      key: t.key,
      title: t.title,
      priority: t.priority,
      status: t.status,
      assigneeName: recipientName || targetEmail.split("@")[0],
    }));

    const roleLabel = recipientRole || "CONTRIBUTOR";
    const emailStatus = await sendProjectCreatedEmail({
      toEmail: targetEmail,
      toName: recipientName || "Team Colleague",
      projectName: project.name,
      projectKey: project.key,
      projectId: project.id,
      description: note ? `${project.description || ""}\n\nNote: ${note}` : project.description,
      priority: project.priority,
      organizationName: project.organization?.name,
      tasksCount: filteredTasks.length,
      subjectPrefix: `⚡ [CoreSync] Project Allocation [${roleLabel}]`,
      headline: `Role Assignment & Sprint Tasks: ${roleLabel}`,
      recipientRole: roleLabel,
      tasksList,
    });

    // Record Audit Log safely (non-blocking)
    try {
      await db.auditLog.create({
        data: {
          action: "PROJECT_DISPATCHED_VIA_GMAIL",
          entity: "Project",
          entityId: project.id,
          organizationId: project.organizationId,
          userId: callerUser?.id,
          userEmail: callerUser?.email,
          details: JSON.stringify({
            recipient: targetEmail,
            role: roleLabel,
            tasksSplitCount: tasksList.length,
            delivered: emailStatus.delivered,
            simulated: emailStatus.simulated || false,
          }),
        },
      });
    } catch (auditErr) {
      console.warn("Non-blocking audit log creation error:", auditErr);
    }

    return NextResponse.json({
      success: true,
      emailStatus,
      recipient: targetEmail,
      role: roleLabel,
      tasksSplitCount: tasksList.length,
      assignee: targetUser
        ? {
            id: targetUser.id,
            name: targetUser.name || targetEmail.split("@")[0],
            email: targetUser.email,
          }
        : null,
      taskIds: filteredTasks.map((t) => t.id),
    });
  } catch (err: any) {
    console.error("API /api/projects/dispatch-email error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to dispatch project email" },
      { status: 500 }
    );
  }
}
