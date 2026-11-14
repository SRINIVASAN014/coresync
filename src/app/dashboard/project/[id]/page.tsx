import { getServerSession } from "next-auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Sparkles, ArrowLeft, KanbanSquare, CheckCircle2, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { db } from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  const { id } = await params;

  // Attempt to load from PostgreSQL
  let project: any = null;
  try {
    project = await db.project.findFirst({
      where: { id: id },
      include: { tasks: true },
    });
  } catch (err) {
    project = null;
  }

  // Demo fallback project if not found in db yet
  if (!project) {
    project = {
      id: id,
      name: "Cloud Infrastructure Zero-Day Hardening",
      key: "SEC",
      description:
        "Comprehensive infrastructure audit, IAM boundary enforcement, and automated threat detection.",
      status: "ACTIVE",
      priority: "HIGH",
      tasks: [
        {
          id: "t-1",
          key: "SEC-1",
          title: "Audit IAM wildcard policies across staging & production",
          description: "Identify all excessive administrative roles and generate least-privilege policies.",
          status: "TODO",
          priority: "HIGH",
          aiGenerated: false,
        },
        {
          id: "t-2",
          key: "SEC-2",
          title: "Implement PostgreSQL Row-Level Security across tenant entities",
          description: "Verify Company A cannot access Company B under any circumstances.",
          status: "IN_PROGRESS",
          priority: "URGENT",
          aiGenerated: true,
        },
        {
          id: "t-3",
          key: "SEC-3",
          title: "Configure automated Sentry error monitoring and alert triggers",
          description: "Notify SecOps in Slack when anomalous 403 authorization failures occur.",
          status: "DONE",
          priority: "MEDIUM",
          aiGenerated: false,
        },
      ],
    };
  }

  // Server Action to generate tasks via AI
  async function generateAITasks() {
    "use server";
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not configured.");
        return;
      }
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        You are a Senior Technical Project Manager and Architect.
        Break down this project into 3 highly actionable, concrete software engineering tasks.
        Project Name: ${project?.name}
        Project Description: ${project?.description}
        Return ONLY valid JSON array with objects containing title, description, priority:
        [{"title": "Task title", "description": "Details", "priority": "HIGH"}]
      `;
      const result = await model.generateContent(prompt);
      const responseText = result.response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const aiTasks = JSON.parse(responseText);

      // If project exists in real database, persist
      const dbProject = await db.project.findUnique({ where: { id: id } });
      if (dbProject) {
        for (let i = 0; i < aiTasks.length; i++) {
          const t = aiTasks[i];
          const taskKey = `${dbProject.key}-${Date.now().toString().slice(-3)}${i}`;
          await db.task.create({
            data: {
              key: taskKey,
              title: t.title,
              description: t.description,
              status: "TODO",
              priority: (t.priority as any) || "MEDIUM",
              aiGenerated: true,
              projectId: dbProject.id,
              creatorId: dbProject.ownerId,
            },
          });
        }
      }
      revalidatePath(`/dashboard/project/${id}`);
    } catch (error) {
      console.error("AI Generation error:", error);
    }
  }

  const columns = [
    { title: "To Do", status: "TODO", count: project.tasks.filter((t: any) => t.status === "TODO").length },
    { title: "In Progress", status: "IN_PROGRESS", count: project.tasks.filter((t: any) => t.status === "IN_PROGRESS").length },
    { title: "In Review", status: "IN_REVIEW", count: project.tasks.filter((t: any) => t.status === "IN_REVIEW").length },
    { title: "Done", status: "DONE", count: project.tasks.filter((t: any) => t.status === "DONE").length },
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

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = project.tasks.filter((t: any) => t.status === col.status);

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

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-lg border border-white/10 bg-[#13151A] hover:border-white/20 hover:bg-[#181A20] transition group shadow-sm space-y-2 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-400">
                        {task.key || "SEC-0"}
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
                        {task.priority || "MEDIUM"}
                      </Badge>
                      <span className="font-mono">Assignee</span>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-32 border border-dashed border-white/5 rounded-lg flex items-center justify-center text-xs text-neutral-600">
                    No tasks
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
