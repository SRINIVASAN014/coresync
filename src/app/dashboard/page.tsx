import { getServerSession } from "next-auth";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Plus,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession();
  const userName = session?.user?.name || "Team Member";

  // Attempt to load projects from PostgreSQL (safe fallback to mock data if db is empty or initializing)
  let projects: any[] = [];
  try {
    projects = await db.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: {
        tasks: true,
      },
    });
  } catch (err) {
    // Database connection or table initialization fallback
    projects = [];
  }

  // Fallback demo projects for Phase 1 visualization if database hasn't been seeded yet
  const displayProjects =
    projects.length > 0
      ? projects.map((p) => ({
          id: p.id,
          name: p.name,
          key: p.key || "CORE",
          status: p.status,
          priority: p.priority,
          taskCount: p.tasks.length,
          completedCount: p.tasks.filter((t: any) => t.status === "DONE").length,
        }))
      : [
          {
            id: "demo-1",
            name: "Cloud Infrastructure Zero-Day Hardening",
            key: "SEC",
            status: "ACTIVE",
            priority: "HIGH",
            taskCount: 12,
            completedCount: 8,
          },
          {
            id: "demo-2",
            name: "CoreSync Mobile App SDK",
            key: "MOB",
            status: "PLANNING",
            priority: "MEDIUM",
            taskCount: 7,
            completedCount: 2,
          },
          {
            id: "demo-3",
            name: "AI Agent Policy & Audit Engine",
            key: "GOV",
            status: "ACTIVE",
            priority: "URGENT",
            taskCount: 16,
            completedCount: 11,
          },
        ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Here is what&apos;s happening across Acme Technologies today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/ai-planner">
            <Button variant="ai" size="sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Sprint Planner</span>
            </Button>
          </Link>
          <Link href="/dashboard/projects">
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-white/20 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Active Projects
            </span>
            <FolderKanban className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {displayProjects.length}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">+2</span> from last sprint
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-white/20 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Sprint Tasks In Flight
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">35</div>
            <p className="text-[11px] text-neutral-500 mt-1">
              21 completed (60% velocity)
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-white/20 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Pending AI Approvals
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-300">3</div>
            <p className="text-[11px] text-amber-400/80 mt-1">
              Awaiting manager sign-off
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-white/20 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Overdue / At Risk
            </span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-400">1</div>
            <p className="text-[11px] text-rose-400/80 mt-1">
              API rate limiter bug
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Main Projects Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Projects</CardTitle>
            <p className="text-xs text-neutral-400 mt-1">
              High-priority engineering projects underway
            </p>
          </div>
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm" className="text-xs text-indigo-400">
              View All Projects <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-white/5">
            {displayProjects.map((project) => {
              const progress =
                project.taskCount > 0
                  ? Math.round((project.completedCount / project.taskCount) * 100)
                  : 0;

              return (
                <div
                  key={project.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] px-3 rounded-lg transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded">
                      {project.key}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/project/${project.id}`}
                        className="text-sm font-semibold text-white hover:text-indigo-300 transition truncate block"
                      >
                        {project.name}
                      </Link>
                      <p className="text-xs text-neutral-500">
                        {project.completedCount} of {project.taskCount} tasks completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Progress Bar */}
                    <div className="w-32 hidden sm:block">
                      <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                        <span>Progress</span>
                        <span className="font-mono">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <Badge
                      variant={
                        project.priority === "URGENT"
                          ? "danger"
                          : project.priority === "HIGH"
                          ? "warning"
                          : "default"
                      }
                    >
                      {project.priority}
                    </Badge>

                    <Link href={`/dashboard/project/${project.id}`}>
                      <Button variant="outline" size="sm">
                        Open Board
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 4. AI Insights & Pending Approvals Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <Card className="border-indigo-500/20 bg-indigo-950/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <CardTitle className="text-indigo-200">
                AI Project Manager Insights
              </CardTitle>
            </div>
            <p className="text-xs text-neutral-400">
              Autonomous observations generated from project velocity
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <p className="text-xs font-semibold text-white">
                Potential bottleneck in &apos;Cloud Infrastructure&apos;
              </p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Task &quot;Configure IAM Role Boundary Policies&quot; has no assignee and is marked Urgent. Recommended assigning to Senior SecOps.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <p className="text-xs font-semibold text-white">
                Sprint completion pace ahead of schedule
              </p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                60% of target story points completed by mid-sprint. Capacity available for additional backlog items.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Human-in-the-Loop Approvals */}
        <Card className="border-amber-500/20 bg-amber-950/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <CardTitle className="text-amber-200">
                Pending Approval Queue
              </CardTitle>
            </div>
            <p className="text-xs text-neutral-400">
              AI agent proposals awaiting manager authorization
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white">
                  Add 3 Subtasks to SEC-12
                </p>
                <p className="text-[10px] text-neutral-400">
                  Proposed by AI Agent • 15 mins ago
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="h-7 text-xs">
                  Review
                </Button>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white">
                  Rebalance Sprint Backlog
                </p>
                <p className="text-[10px] text-neutral-400">
                  Proposed by AI Agent • 1 hour ago
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="h-7 text-xs">
                  Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
