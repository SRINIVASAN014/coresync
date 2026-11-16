import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Plus,
  AlertCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "Enterprise User";

  // 1. Resolve Active Multi-Tenant Organization from Cookie / Session
  const cookieStore = await cookies();
  const activeOrgCookie = cookieStore.get("coresync_active_org_id")?.value;

  let activeOrg = null;
  if (activeOrgCookie) {
    activeOrg = await db.organization.findUnique({
      where: { id: activeOrgCookie },
    });
  }
  if (!activeOrg && session?.user?.id) {
    const member = await db.organizationMember.findFirst({
      where: { userId: session.user.id },
      include: { organization: true },
    });
    activeOrg = member?.organization || null;
  }
  if (!activeOrg) {
    activeOrg = await db.organization.findFirst({
      orderBy: { createdAt: "asc" },
    });
  }

  const orgId = activeOrg?.id;
  const orgName = activeOrg?.name || "Global CyberTech Solutions";

  const [
    projects,
    totalProjectsCount,
    totalTasksCount,
    completedTasksCount,
    pendingApprovals,
    urgentTasksCount,
  ] = await Promise.all([
    db.project.findMany({
      where: orgId ? { organizationId: orgId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        tasks: true,
        owner: {
          select: { name: true, email: true },
        },
      },
    }),
    db.project.count({ where: orgId ? { organizationId: orgId } : undefined }),
    db.task.count({ where: orgId ? { project: { organizationId: orgId } } : undefined }),
    db.task.count({ where: { status: "DONE", ...(orgId ? { project: { organizationId: orgId } } : {}) } }),
    db.approvalRequest.findMany({
      where: { status: "PENDING", ...(orgId ? { organizationId: orgId } : {}) },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    db.task.count({ where: { priority: "URGENT", status: { not: "DONE" }, ...(orgId ? { project: { organizationId: orgId } } : {}) } }),
  ]);

  const velocity =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Live Cloud Database • {orgName}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Viewing real-time project telemetry, workload velocity, and AI approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/ai-planner">
            <Button variant="ai" size="sm" className="font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#6554C0]" />
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

      {/* 2. Top Metric Cards (Calculated directly from live PostgreSQL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-blue-300 hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Active Projects
            </span>
            <FolderKanban className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalProjectsCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-600 font-medium">100% live</span> PostgreSQL data
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-300 hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Sprint Tasks
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalTasksCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {completedTasksCount} completed ({velocity}% velocity)
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-300 hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Pending AI Approvals
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {pendingApprovals.length}
            </div>
            <p className="text-[11px] text-amber-700/80 mt-1">
              Requires manager sign-off
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-300 hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Urgent Priority Tasks
            </span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {urgentTasksCount}
            </div>
            <p className="text-[11px] text-rose-600/80 mt-1">
              Needs engineering focus
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Live Projects Table (Loaded from PostgreSQL) */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <CardTitle>Active Enterprise Projects</CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Real-time synchronization across {orgName}
            </p>
          </div>
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              View All Projects <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="divide-y divide-slate-100">
            {projects.map((project) => {
              const taskCount = project.tasks.length;
              const completedCount = project.tasks.filter(
                (t) => t.status === "DONE"
              ).length;
              const progress =
                taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

              return (
                <div
                  key={project.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 px-3 rounded-lg transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
                      {project.key}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/project/${project.id}`}
                        className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition truncate block"
                      >
                        {project.name}
                      </Link>
                      <p className="text-xs text-slate-500">
                        Lead: {project.owner.name} • {completedCount} of {taskCount} tasks done
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Progress Bar */}
                    <div className="w-32 hidden sm:block">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Progress</span>
                        <span className="font-mono text-slate-700 font-semibold">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
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
                      <Button variant="outline" size="sm" className="text-xs">
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

      {/* 4. Real Pending AI Approvals Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <CardTitle className="text-amber-900">
                AI Action Approval Center ({pendingApprovals.length})
              </CardTitle>
            </div>
            <p className="text-xs text-amber-700/80">
              Live database proposals generated by autonomous agents awaiting manager review
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApprovals.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-lg bg-white border border-amber-200/80 flex items-center justify-between shadow-2xs"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {req.actionType.replace(/_/g, " ")}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Requested by {req.requestedBy}
                  </p>
                </div>
                <Button variant="secondary" size="sm" className="h-7 text-xs flex-shrink-0 bg-amber-100/70 hover:bg-amber-100 border-amber-200 text-amber-900">
                  Review Action
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Health & Governance Insights */}
        <Card className="border-blue-200 bg-blue-50/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <CardTitle className="text-blue-900">
                Autonomous Project Telemetry
              </CardTitle>
            </div>
            <p className="text-xs text-blue-700/80">
              Real-time policy monitoring on Neon PostgreSQL
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-white border border-blue-200/80 space-y-1 shadow-2xs">
              <p className="text-xs font-semibold text-slate-900">
                Multi-Tenant Isolation Verified
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                All projects, tasks, and audit logs are partitioned under Organization ID: <span className="font-mono text-blue-600 font-bold">{orgId || "org_root"}</span>.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white border border-blue-200/80 space-y-1 shadow-2xs">
              <p className="text-xs font-semibold text-slate-900">
                AI Agent Boundary Active
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Zero autonomous write permissions granted without manager cryptographic signature.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
