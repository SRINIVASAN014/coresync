import { getServerSession } from "next-auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Sparkles, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { db } from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  const { id } = await params;

  // 1. Fetch Real Project & Real Tasks from Neon Cloud PostgreSQL
  let project = await db.project.findUnique({
    where: { id: id },
    include: {
      tasks: {
        include: {
          assignee: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      owner: { select: { name: true, email: true } },
    },
  });

  if (!project) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white">Project Not Found</h2>
        <p className="text-xs text-neutral-400">
          This project may have been deleted or your account does not have authorization to view it.
        </p>
        <Link href="/dashboard">
          <Button variant="primary" size="sm">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  // 2. Server Action to Generate Real Tasks via Gemini AI
  async function generateAITasks() {
    "use server";
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not configured.");
        return;
      }
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        You are a Senior Technical Project Manager.
        Break down this project into 3 concrete, actionable software engineering tasks.
        Project Name: ${project?.name}
        Project Description: ${project?.description}
        Return ONLY valid JSON array with objects containing title, description, priority:
        [{"title": "Task title", "description": "Technical details", "priority": "HIGH"}]
      `;
      const result = await model.generateContent(prompt);
      const responseText = result.response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const aiTasks = JSON.parse(responseText);

      // Persist real tasks to Neon PostgreSQL
      for (let i = 0; i < aiTasks.length; i++) {
        const t = aiTasks[i];
        const taskKey = `${project!.key}-${Date.now().toString().slice(-4)}${i}`;
        await db.task.create({
          data: {
            key: taskKey,
            title: t.title,
            description: t.description,
            status: "TODO",
            priority: (t.priority as any) || "MEDIUM",
            aiGenerated: true,
            projectId: project!.id,
            creatorId: project!.ownerId,
          },
        });
      }
      revalidatePath(`/dashboard/project/${id}`);
    } catch (error) {
      console.error("AI Generation error:", error);
    }
  }

  const columns = [
    { title: "To Do", status: "TODO", count: project.tasks.filter((t) => t.status === "TODO").length },
    { title: "In Progress", status: "IN_PROGRESS", count: project.tasks.filter((t) => t.status === "IN_PROGRESS").length },
    { title: "In Review", status: "IN_REVIEW", count: project.tasks.filter((t) => t.status === "IN_REVIEW").length },
    { title: "Done", status: "DONE", count: project.tasks.filter((t) => t.status === "DONE").length },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation & Project Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <Link
            href="/dashboard"
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
              {project.key}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {project.name}
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            {project.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form action={generateAITasks}>
            <Button variant="ai" size="sm" type="submit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Tasks</span>
            </Button>
          </form>
          <Button variant="secondary" size="sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {/* Real Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = project.tasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="rounded-xl border border-white/5 bg-[#0D0E12] p-4 flex flex-col min-h-[550px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  {col.title}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-neutral-400">
                  {col.count}
                </span>
              </div>

              {/* Real Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-lg border border-white/10 bg-[#13151A] hover:border-white/20 hover:bg-[#181A20] transition group shadow-sm space-y-2 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-400">
                        {task.key}
                      </span>
                      {task.aiGenerated && (
                        <Badge variant="ai" className="text-[9px] px-1.5 py-0">
                          AI
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xs font-semibold text-white leading-snug group-hover:text-indigo-300 transition">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-neutral-500">
                      <Badge
                        variant={
                          task.priority === "URGENT"
                            ? "danger"
                            : task.priority === "HIGH"
                            ? "warning"
                            : "secondary"
                        }
                        className="text-[9px] px-1.5 py-0"
                      >
                        {task.priority}
                      </Badge>
                      <span className="font-mono text-[10px] text-neutral-400 truncate max-w-[100px]">
                        {task.assignee?.name || "Unassigned"}
                      </span>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-32 border border-dashed border-white/5 rounded-lg flex items-center justify-center text-xs text-neutral-600">
                    No tasks in {col.title}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
