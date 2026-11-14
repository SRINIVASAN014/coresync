import { PrismaClient, Role, ProjectStatus, Priority, TaskStatus, ApprovalStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CoreSync Live Database Seeding on Neon PostgreSQL...");

  // 1. Clear existing seed records if any
  await prisma.auditLog.deleteMany({});
  await prisma.approvalRequest.deleteMany({});
  await prisma.taskDependency.deleteMany({});
  await prisma.subtask.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.organizationMember.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Real Enterprise Organization
  const org = await prisma.organization.create({
    data: {
      name: "Global CyberTech Solutions",
      slug: "cybertech-global",
      industry: "Enterprise Cybersecurity & DevSecOps",
      website: "https://cybertech.example.com",
    },
  });
  console.log(`✅ Created Organization: ${org.name} (${org.slug})`);

  // 3. Create Real Enterprise Users
  const hashedPassword = await bcrypt.hash("EnterpriseDemo2026!", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "Srinivasan Sathurappan",
      email: "admin@cybertech.com",
      password: hashedPassword,
    },
  });

  const leadDev = await prisma.user.create({
    data: {
      name: "Alex Mercer",
      email: "alex.mercer@cybertech.com",
      password: hashedPassword,
    },
  });

  const secOps = await prisma.user.create({
    data: {
      name: "Elena Rostova",
      email: "elena.r@cybertech.com",
      password: hashedPassword,
    },
  });

  console.log(`✅ Created 3 Enterprise Users: ${adminUser.name}, ${leadDev.name}, ${secOps.name}`);

  // 4. Bind Users to Organization with Roles
  await prisma.organizationMember.createMany({
    data: [
      { organizationId: org.id, userId: adminUser.id, role: Role.OWNER },
      { organizationId: org.id, userId: leadDev.id, role: Role.MANAGER },
      { organizationId: org.id, userId: secOps.id, role: Role.MEMBER },
    ],
  });
  console.log("✅ Bound Users to Organization with RBAC Roles (OWNER, MANAGER, MEMBER)");

  // 5. Create Real Projects
  const project1 = await prisma.project.create({
    data: {
      name: "Cloud Infrastructure Zero-Day Hardening",
      key: "SEC",
      description: "Automated penetration testing, IAM boundary enforcement, and Kubernetes runtime hardening for banking compliance.",
      status: ProjectStatus.ACTIVE,
      priority: Priority.URGENT,
      organizationId: org.id,
      ownerId: adminUser.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "AI Agent Governance & Policy Engine",
      key: "GOV",
      description: "Deterministic backend authorization layer ensuring autonomous agents cannot execute destructive actions without manager approval.",
      status: ProjectStatus.ACTIVE,
      priority: Priority.HIGH,
      organizationId: org.id,
      ownerId: leadDev.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: "CoreSync Enterprise Mobile SDK",
      key: "MOB",
      description: "Cross-platform mobile workspace enabling real-time push alerts, sprint reviews, and emergency approval actions on iOS & Android.",
      status: ProjectStatus.PLANNING,
      priority: Priority.MEDIUM,
      organizationId: org.id,
      ownerId: adminUser.id,
    },
  });

  console.log(`✅ Created 3 Real Projects: [SEC], [GOV], [MOB]`);

  // 6. Create Real Tasks for Project 1 (SEC)
  await prisma.task.createMany({
    data: [
      {
        key: "SEC-1",
        title: "Audit IAM wildcard policies across production AWS accounts",
        description: "Enforce least-privilege boundary policies and revoke unused root credentials.",
        status: TaskStatus.TODO,
        priority: Priority.URGENT,
        aiGenerated: false,
        projectId: project1.id,
        creatorId: adminUser.id,
        assigneeId: secOps.id,
      },
      {
        key: "SEC-2",
        title: "Deploy PostgreSQL Row-Level Security (RLS) across tenant models",
        description: "Ensure multi-tenant isolation is mathematically verified at the database query level.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        aiGenerated: true,
        projectId: project1.id,
        creatorId: adminUser.id,
        assigneeId: leadDev.id,
      },
      {
        key: "SEC-3",
        title: "Configure automated Sentry & CloudWatch alert triggers",
        description: "Trigger immediate PagerDuty alerts on anomalous 403 authorization spikes.",
        status: TaskStatus.IN_REVIEW,
        priority: Priority.HIGH,
        aiGenerated: false,
        projectId: project1.id,
        creatorId: leadDev.id,
        assigneeId: secOps.id,
      },
      {
        key: "SEC-4",
        title: "Perform automated vulnerability scan with NVD benchmark controls",
        description: "Ensure zero known CVEs in third-party npm and Docker base images.",
        status: TaskStatus.DONE,
        priority: Priority.MEDIUM,
        aiGenerated: true,
        projectId: project1.id,
        creatorId: adminUser.id,
        assigneeId: leadDev.id,
      },
    ],
  });

  // 7. Create Real Tasks for Project 2 (GOV)
  await prisma.task.createMany({
    data: [
      {
        key: "GOV-1",
        title: "Implement Human-in-the-Loop Approval Queue",
        description: "Stage all autonomous AI actions into an immutable approval request table before execution.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.URGENT,
        aiGenerated: false,
        projectId: project2.id,
        creatorId: leadDev.id,
        assigneeId: adminUser.id,
      },
      {
        key: "GOV-2",
        title: "Architect tamper-evident audit trail for AI actions",
        description: "Log every AI agent query, proposed payload, and reviewer decision with timestamps.",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        aiGenerated: true,
        projectId: project2.id,
        creatorId: leadDev.id,
        assigneeId: leadDev.id,
      },
    ],
  });

  console.log("✅ Seeded real tasks across projects with real assignees and priorities.");

  // 8. Create Real Approval Requests (Human-in-the-loop Governance)
  await prisma.approvalRequest.create({
    data: {
      organizationId: org.id,
      projectId: project1.id,
      requestedBy: "AI Project Manager Agent v1",
      requestedByType: "AI_AGENT",
      actionType: "PROPOSE_SUBTASKS",
      payload: JSON.stringify({
        taskKey: "SEC-2",
        proposedSubtasks: [
          "Enable pg_stat_statements for slow query logging",
          "Test cross-tenant RLS bypass scenarios with malicious queries",
        ],
      }),
      status: ApprovalStatus.PENDING,
    },
  });

  await prisma.approvalRequest.create({
    data: {
      organizationId: org.id,
      projectId: project2.id,
      requestedBy: "AI Sprint Optimizer Agent",
      requestedByType: "AI_AGENT",
      actionType: "REBALANCE_SPRINT_CAPACITY",
      payload: JSON.stringify({
        recommendation: "Reassign SEC-1 to Elena Rostova to prevent workload bottleneck on Alex Mercer.",
      }),
      status: ApprovalStatus.PENDING,
    },
  });

  console.log("✅ Created 2 Real Pending Approval Requests for the AI Governance Queue.");

  // 9. Create Real Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        organizationId: org.id,
        userId: adminUser.id,
        userEmail: adminUser.email,
        action: "ORGANIZATION_INITIALIZED",
        entity: "Organization",
        entityId: org.id,
        details: JSON.stringify({ name: org.name, plan: "ENTERPRISE_TIER" }),
      },
      {
        organizationId: org.id,
        userId: adminUser.id,
        userEmail: adminUser.email,
        action: "PROJECT_CREATED",
        entity: "Project",
        entityId: project1.id,
        details: JSON.stringify({ projectKey: "SEC", priority: "URGENT" }),
      },
      {
        organizationId: org.id,
        userId: leadDev.id,
        userEmail: leadDev.email,
        action: "TASK_STATUS_CHANGED",
        entity: "Task",
        entityId: "SEC-4",
        details: JSON.stringify({ from: "IN_REVIEW", to: "DONE" }),
      },
    ],
  });

  console.log("✅ Created Audit Logs for security compliance.");
  console.log("🎉 Seeding completed successfully on live Neon PostgreSQL!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
