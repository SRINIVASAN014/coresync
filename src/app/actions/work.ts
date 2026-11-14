"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { TaskStatus, Priority, ProjectStatus, Role } from "@prisma/client";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

/**
 * Update the status of a task (Backlog -> Todo -> In Progress -> In Review -> Done)
 */
export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  try {
    const updated = await db.task.update({
      where: { id: taskId },
      data: { status },
      include: { project: true },
    });

    // Create Audit Log entry
    await db.auditLog.create({
      data: {
        organizationId: updated.project.organizationId,
        action: "TASK_STATUS_UPDATED",
        entity: "Task",
        entityId: updated.key,
        details: JSON.stringify({ newStatus: status }),
      },
    });

    revalidatePath(`/dashboard/project/${updated.projectId}`);
    revalidatePath("/dashboard");
    return { success: true, task: updated };
  } catch (error: any) {
    console.error("Failed to update task status:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update the priority of a task (Low, Medium, High, Urgent)
 */
export async function updateTaskPriority(taskId: string, priority: Priority) {
  try {
    const updated = await db.task.update({
      where: { id: taskId },
      data: { priority },
      include: { project: true },
    });

    revalidatePath(`/dashboard/project/${updated.projectId}`);
    return { success: true, task: updated };
  } catch (error: any) {
    console.error("Failed to update task priority:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update task assignee
 */
export async function updateTaskAssignee(taskId: string, assigneeId: string | null) {
  try {
    const updated = await db.task.update({
      where: { id: taskId },
      data: { assigneeId: assigneeId || null },
      include: { project: true },
    });

    revalidatePath(`/dashboard/project/${updated.projectId}`);
    return { success: true, task: updated };
  } catch (error: any) {
    console.error("Failed to update task assignee:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Toggle a subtask completion status
 */
export async function toggleSubtask(subtaskId: string, completed: boolean) {
  try {
    const updated = await db.subtask.update({
      where: { id: subtaskId },
      data: { completed },
      include: { task: true },
    });

    revalidatePath(`/dashboard/project/${updated.task.projectId}`);
    return { success: true, subtask: updated };
  } catch (error: any) {
    console.error("Failed to toggle subtask:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Create a new subtask under an existing task
 */
export async function createSubtask(taskId: string, title: string) {
  try {
    const subtask = await db.subtask.create({
      data: {
        taskId,
        title,
        completed: false,
      },
      include: { task: true },
    });

    revalidatePath(`/dashboard/project/${subtask.task.projectId}`);
    return { success: true, subtask };
  } catch (error: any) {
    console.error("Failed to create subtask:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Deconstruct an issue into technical subtasks using Gemini AI
 */
export async function decomposeTaskWithAI(taskId: string) {
  try {
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) throw new Error("Task not found");

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are a Principal Software Engineer.
      Break down the following issue into 3 to 4 concrete, actionable, technical engineering subtasks.
      Issue Title: ${task.title}
      Description: ${task.description || "No description provided."}
      Project: ${task.project.name}

      Return ONLY a raw JSON array of strings:
      ["Subtask 1 title", "Subtask 2 title", "Subtask 3 title"]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const subtaskTitles: string[] = JSON.parse(responseText);

    const createdSubtasks = [];
    for (const title of subtaskTitles) {
      const subtask = await db.subtask.create({
        data: {
          taskId: task.id,
          title,
          completed: false,
        },
      });
      createdSubtasks.push(subtask);
    }

    // Mark task as AI generated/assisted
    await db.task.update({
      where: { id: taskId },
      data: { aiGenerated: true },
    });

    revalidatePath(`/dashboard/project/${task.projectId}`);
    return { success: true, subtasks: createdSubtasks };
  } catch (error: any) {
    console.error("AI Deconstruct failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Add a comment to an issue
 */
export async function addComment(taskId: string, content: string) {
  try {
    const session = await getServerSession();
    const user = await db.user.findFirst({
      where: session?.user?.email ? { email: session.user.email } : undefined,
    });

    if (!user) throw new Error("User authentication required");

    const comment = await db.comment.create({
      data: {
        taskId,
        userId: user.id,
        content,
      },
      include: {
        user: { select: { name: true, email: true, image: true } },
        task: true,
      },
    });

    revalidatePath(`/dashboard/project/${comment.task.projectId}`);
    return { success: true, comment };
  } catch (error: any) {
    console.error("Failed to add comment:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fast Create Issue (Linear Style)
 */
export async function createIssue(data: {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
}) {
  try {
    const project = await db.project.findUnique({
      where: { id: data.projectId },
      include: { tasks: { select: { id: true } } },
    });

    if (!project) throw new Error("Project not found");

    const issueKey = `${project.key}-${project.tasks.length + 1}`;

    const session = await getServerSession();
    const creator = await db.user.findFirst({
      where: session?.user?.email ? { email: session.user.email } : undefined,
    });

    const creatorId = creator ? creator.id : project.ownerId;

    const task = await db.task.create({
      data: {
        key: issueKey,
        title: data.title,
        description: data.description || "",
        status: data.status || TaskStatus.TODO,
        priority: data.priority || Priority.MEDIUM,
        projectId: project.id,
        creatorId: creatorId,
        assigneeId: data.assigneeId || null,
      },
      include: {
        assignee: { select: { name: true, email: true } },
      },
    });

    revalidatePath(`/dashboard/project/${project.id}`);
    revalidatePath("/dashboard");
    return { success: true, task };
  } catch (error: any) {
    console.error("Failed to create issue:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Create a new enterprise Project
 */
export async function createProject(data: {
  name: string;
  key: string;
  description?: string;
  priority?: Priority;
}) {
  try {
    const session = await getServerSession(authOptions);
    const owner = await db.user.findFirst({
      where: session?.user?.email ? { email: session.user.email } : undefined,
    });

    if (!owner) throw new Error("Authenticated user required to create a project");

    // Resolve active organization from cookie or user's first membership
    const cookieStore = await cookies();
    const activeOrgId = cookieStore.get("coresync_active_org_id")?.value;

    let targetOrgId = activeOrgId;
    if (!targetOrgId) {
      const membership = await db.organizationMember.findFirst({
        where: { userId: owner.id },
      });
      targetOrgId = membership?.organizationId;
    }

    if (!targetOrgId) {
      const firstOrg = await db.organization.findFirst();
      targetOrgId = firstOrg?.id;
    }

    if (!targetOrgId) throw new Error("No organization found to create project in");

    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key.toUpperCase(),
        description: data.description || "",
        priority: data.priority || Priority.MEDIUM,
        status: ProjectStatus.ACTIVE,
        organizationId: targetOrgId,
        ownerId: owner.id,
      },
    });

    // Automatically add creator as Project Member with OWNER role
    await db.projectMember.create({
      data: {
        projectId: project.id,
        userId: owner.id,
        role: Role.OWNER,
      },
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        action: "PROJECT_CREATED",
        entity: "Project",
        entityId: project.id,
        organizationId: targetOrgId,
        userId: owner.id,
        userEmail: owner.email,
        details: JSON.stringify({ key: project.key, name: project.name }),
      },
    });

    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    return { success: true, project };
  } catch (error: any) {
    console.error("Failed to create project:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Switch active workspace (tenant isolation context)
 */
export async function switchActiveOrganization(organizationId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Authentication required");

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) throw new Error("User not found");

    // Verify user belongs to this organization
    const membership = await db.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id,
        },
      },
      include: { organization: true },
    });

    if (!membership) {
      throw new Error("You do not have access to this organization");
    }

    const cookieStore = await cookies();
    cookieStore.set("coresync_active_org_id", organizationId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard/teams");
    revalidatePath("/dashboard/settings");

    return { success: true, organization: membership.organization };
  } catch (error: any) {
    console.error("Failed to switch organization:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Create a new enterprise organization workspace
 */
export async function createOrganization(data: {
  name: string;
  industry?: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Authentication required");

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) throw new Error("User not found");

    const baseSlug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    const newOrg = await db.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: data.name.trim(),
          slug: uniqueSlug,
          industry: data.industry?.trim() || "Technology & Software",
        },
      });

      await tx.organizationMember.create({
        data: {
          organizationId: org.id,
          userId: user.id,
          role: Role.OWNER,
        },
      });

      const team = await tx.team.create({
        data: {
          name: "Engineering",
          description: "Primary engineering and architecture team",
          organizationId: org.id,
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: user.id,
          role: "LEAD",
        },
      });

      const project = await tx.project.create({
        data: {
          name: "Core Platform",
          key: "CORE",
          description: "Primary feature sprint backlog",
          status: ProjectStatus.ACTIVE,
          organizationId: org.id,
          ownerId: user.id,
        },
      });

      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId: user.id,
          role: Role.OWNER,
        },
      });

      await tx.task.create({
        data: {
          key: "CORE-1",
          title: `Welcome to ${org.name} Workspace`,
          description: "This workspace has full mathematical tenant isolation.",
          status: TaskStatus.TODO,
          priority: Priority.HIGH,
          projectId: project.id,
          creatorId: user.id,
          assigneeId: user.id,
        },
      });

      await tx.auditLog.create({
        data: {
          action: "WORKSPACE_CREATED",
          entity: "Organization",
          entityId: org.id,
          organizationId: org.id,
          userId: user.id,
          userEmail: user.email,
          details: JSON.stringify({ name: org.name, slug: org.slug }),
        },
      });

      return org;
    });

    const cookieStore = await cookies();
    cookieStore.set("coresync_active_org_id", newOrg.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { success: true, organization: newOrg };
  } catch (error: any) {
    console.error("Failed to create organization:", error);
    return { success: false, error: error.message };
  }
}
