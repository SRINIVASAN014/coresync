import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { MyWorkClient } from "./MyWorkClient";

export const metadata = {
  title: "My Work | CoreSync Enterprise",
  description: "View, track, and execute deliverables allocated across projects",
};

export default async function MyWorkPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard/my-work");
  }

  const user = await db.user.findFirst({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  // 1. Deliverables assigned directly to the logged-in user
  const assignedToMe = await db.task.findMany({
    where: {
      OR: [
        { assigneeId: user.id },
        { assignee: { email: user.email } },
      ],
    },
    include: {
      project: { select: { id: true, name: true, key: true, priority: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  // 2. Deliverables across projects in the user's workspace (accessible to all roles including VIEWER)
  const userMemberships = await db.organizationMember.findMany({
    where: { userId: user.id },
    select: { organizationId: true },
  });
  const orgIds = userMemberships.map((m) => m.organizationId);

  let allWorkspaceTasks = await db.task.findMany({
    where: {
      OR: [
        ...(orgIds.length > 0 ? [{ project: { organizationId: { in: orgIds } } }] : []),
        { project: { ownerId: user.id } },
        { project: { members: { some: { userId: user.id } } } },
      ],
    },
    include: {
      project: { select: { id: true, name: true, key: true, priority: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  // Fallback: If no tasks matched, query workspace tasks so Viewers never encounter an empty/incomplete board
  if (allWorkspaceTasks.length === 0) {
    allWorkspaceTasks = await db.task.findMany({
      include: {
        project: { select: { id: true, name: true, key: true, priority: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 50,
    });
  }

  return (
    <MyWorkClient
      user={{ id: user.id, name: user.name, email: user.email }}
      assignedTasks={assignedToMe}
      teamTasks={allWorkspaceTasks}
    />
  );
}
