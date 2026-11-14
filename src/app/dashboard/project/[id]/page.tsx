import { getServerSession } from "next-auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { ProjectBoardClient } from "@/components/kanban/ProjectBoardClient";

export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  const { id } = await params;

  // 1. Fetch Project & Tasks from Neon PostgreSQL
  const project = await db.project.findUnique({
    where: { id: id },
    include: {
      tasks: {
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          subtasks: true,
          comments: {
            include: {
              user: { select: { name: true, email: true, image: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      owner: { select: { name: true, email: true } },
    },
  });

  if (!project) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto select-none">
        <h2 className="text-xl font-bold text-slate-900">Project Not Found</h2>
        <p className="text-xs text-slate-500">
          This project may have been archived or your account does not have authorization to view it.
        </p>
        <Link href="/dashboard">
          <Button variant="primary" size="sm">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Workspace
          </Button>
        </Link>
      </div>
    );
  }

  // 2. Fetch Team Members and All Projects for Linear drawers & modals
  const [teamMembers, allProjects] = await Promise.all([
    db.user.findMany({
      select: { id: true, name: true, email: true },
      take: 20,
    }),
    db.project.findMany({
      select: { id: true, name: true, key: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <ProjectBoardClient
      project={project}
      teamMembers={teamMembers}
      allProjects={allProjects}
    />
  );
}
