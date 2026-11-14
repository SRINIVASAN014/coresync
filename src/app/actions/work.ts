"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { TaskStatus, Priority, ProjectStatus } from "@prisma/client";

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
    const org = await db.organization.findFirst();
    if (!org) throw new Error("No organization found");

    const session = await getServerSession();
    const owner = await db.user.findFirst({
      where: session?.user?.email ? { email: session.user.email } : undefined,
    });

    if (!owner) throw new Error("User required");

    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key.toUpperCase(),
        description: data.description || "",
        priority: data.priority || Priority.MEDIUM,
        status: ProjectStatus.ACTIVE,
        organizationId: org.id,
        ownerId: owner.id,
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
