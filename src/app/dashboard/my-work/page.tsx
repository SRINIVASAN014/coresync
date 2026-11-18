import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { MyWorkClient } from "./MyWorkClient";

export const metadata = {
  title: "My Work | CoreSync Enterprise",
  description: "View and execute all your assigned deliverables across projects",
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

  // 1. Fetch tasks assigned directly to the current user
  let assignedTasks = await db.task.findMany({
    where: { assigneeId: user.id },
    include: {
      project: { select: { id: true, name: true, key: true, priority: true } },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  // 2. Intelligent fallback: if no direct assignments yet, show tasks from projects they own or belong to
  if (assignedTasks.length === 0) {
    assignedTasks = await db.task.findMany({
      where: {
        OR: [
          { creatorId: user.id },
          { project: { ownerId: user.id } },
          { project: { members: { some: { userId: user.id } } } },
        ],
      },
      include: {
        project: { select: { id: true, name: true, key: true, priority: true } },
      },
      take: 25,
      orderBy: [{ createdAt: "desc" }],
    });
  }

  return (
    <MyWorkClient
      user={{ id: user.id, name: user.name, email: user.email }}
      initialTasks={assignedTasks}
    />
  );
}
