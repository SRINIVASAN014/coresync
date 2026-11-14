import { db } from "@/lib/db";
import { ProjectBoardClient } from "@/components/kanban/ProjectBoardClient";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function GlobalKanbanPage() {
  const [projects, tasks, teamMembers] = await Promise.all([
    db.project.findMany({
      select: { id: true, name: true, key: true },
      orderBy: { createdAt: "desc" },
    }),
    db.task.findMany({
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        subtasks: true,
        comments: {
          include: {
            user: { select: { name: true, email: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.user.findMany({
      select: { id: true, name: true, email: true },
      take: 20,
    }),
  ]);

  if (projects.length === 0) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-900">No Projects Available</h2>
        <p className="text-xs text-slate-500">
          Create a project to start managing tasks on the Kanban board.
        </p>
        <Link href="/dashboard/projects">
          <Button variant="primary" size="sm">
            Create Project
          </Button>
        </Link>
      </div>
    );
  }

  // Unified workspace project container
  const unifiedProject = {
    id: projects[0].id,
    name: "Global Workspace Board",
    key: "ALL",
    description: "Cross-project aggregated Kanban board displaying active tasks across all roadmaps.",
    tasks: tasks,
  };

  return (
    <ProjectBoardClient
      project={unifiedProject}
      teamMembers={teamMembers}
      allProjects={projects}
    />
  );
}
