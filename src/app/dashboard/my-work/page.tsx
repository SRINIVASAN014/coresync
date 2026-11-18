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
    where: { assigneeId: user.id },
    include: {
      project: { select: { id: true, name: true, key: true, priority: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  // 2. Deliverables across projects where the user is Owner, Manager, or Member
  const allWorkspaceTasks = await db.task.findMany({
    where: {
      project: {
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } },
        ],
      },
    },
    include: {
      project: { select: { id: true, name: true, key: true, priority: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return (
    <MyWorkClient
      user={{ id: user.id, name: user.name, email: user.email }}
      assignedTasks={assignedToMe}
      teamTasks={allWorkspaceTasks}
    />
  );
}
