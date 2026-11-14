import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { Role, ProjectStatus, Priority, TaskStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, companyName } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const workspaceName = companyName?.trim() || `${name.trim()}'s Workspace`;
    const baseSlug = workspaceName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    // Execute multi-tenant creation transaction
    const result = await db.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
        },
      });

      // 2. Create Organization
      const organization = await tx.organization.create({
        data: {
          name: workspaceName,
          slug: uniqueSlug,
          industry: "Technology & Software Engineering",
        },
      });

      // 3. Bind User as OWNER
      await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role: Role.OWNER,
        },
      });

      // 4. Create default Engineering Team
      const team = await tx.team.create({
        data: {
          name: "Engineering",
          description: "Core software engineering and architecture team",
          organizationId: organization.id,
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: user.id,
          role: "LEAD",
        },
      });

      // 5. Create starter Project
      const project = await tx.project.create({
        data: {
          name: "Core Platform",
          key: "CORE",
          description: "Primary engineering platform and feature sprint backlog",
          status: ProjectStatus.ACTIVE,
          organizationId: organization.id,
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

      // 6. Create starter Task
      await tx.task.create({
        data: {
          key: "CORE-1",
          title: "Welcome to CoreSync — Explore your AI-governed workspace",
          description: "Welcome to your new enterprise workspace! Click here to test the Linear-style detail drawer, AI subtask decomposition, and live sprint workflows.",
          status: TaskStatus.TODO,
          priority: Priority.HIGH,
          projectId: project.id,
          creatorId: user.id,
          assigneeId: user.id,
          subtasks: {
            create: [
              { title: "Review workspace settings and team members", completed: true },
              { title: "Create your first project sprint issue", completed: false },
              { title: "Try AI Project Planner to decompose a goal into sprints", completed: false },
            ],
          },
        },
      });

      // 7. Audit Log
      await tx.auditLog.create({
        data: {
          action: "WORKSPACE_INITIALIZED",
          entity: "Organization",
          entityId: organization.id,
          organizationId: organization.id,
          userId: user.id,
          userEmail: user.email,
          details: JSON.stringify({
            organizationName: organization.name,
            creatorEmail: user.email,
          }),
        },
      });

      return { user, organization };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account and workspace provisioned successfully.",
        userId: result.user.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { error: "Internal server error during registration. Please try again." },
      { status: 500 }
    );
  }
}
