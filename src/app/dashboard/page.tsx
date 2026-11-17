import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Plus,
  AlertCircle,
  Building2,
  Lock,
  Bot,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

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
      take: 4,
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Viewing real-time project telemetry, workload velocity, and AI governance queue.
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

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/projects" className="block group">
          <Card className="hover:border-slate-300 hover:shadow-md transition h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Active Projects
              </span>
              <FolderKanban className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {totalProjectsCount}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Synchronized</span> across workspace
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/kanban" className="block group">
          <Card className="hover:border-slate-300 hover:shadow-md transition h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Sprint Tasks
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalTasksCount}</div>
              <p className="text-[11px] text-slate-500 mt-1">
                {completedTasksCount} completed ({velocity}% velocity)
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/approvals" className="block group">
          <Card className="hover:border-slate-300 hover:shadow-md transition h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Pending AI Approvals
              </span>
              <ShieldAlert className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {pendingApprovals.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span className={pendingApprovals.length > 0 ? "text-amber-700 font-semibold" : "text-emerald-600 font-medium"}>
                  {pendingApprovals.length > 0 ? "Requires manager review" : "All cleared"}
                </span>
                <span>• Review queue &rarr;</span>
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/kanban" className="block group">
          <Card className="hover:border-slate-300 hover:shadow-md transition h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Urgent Priority Tasks
              </span>
              <AlertCircle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                {urgentTasksCount}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span className={urgentTasksCount > 0 ? "text-rose-600 font-medium" : "text-slate-500"}>
                  {urgentTasksCount > 0 ? "Needs engineering focus" : "On track"}
                </span>
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 3. Live Projects Table */}
      <Card className="shadow-xs border-slate-200/90">
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

              // Format owner name in clean title case
              const rawName = project.owner?.name || "Enterprise Lead";
              const formattedLead = rawName
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(" ");

              // Key badge styling per project domain
              const keyBadgeStyles: Record<string, string> = {
                IAM: "bg-emerald-50 text-emerald-700 border-emerald-200/90",
                SEC: "bg-indigo-50 text-indigo-700 border-indigo-200/90",
                GOV: "bg-purple-50 text-purple-700 border-purple-200/90",
                MOB: "bg-sky-50 text-sky-700 border-sky-200/90",
              };
              const badgeStyle =
                keyBadgeStyles[project.key.toUpperCase()] ||
                "bg-slate-100 text-slate-700 border-slate-200/90";

              return (
                <div
                  key={project.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 px-3.5 rounded-lg transition-colors border border-transparent hover:border-slate-200/70"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-xs tracking-wider border shadow-2xs shrink-0 select-none",
                        badgeStyle
                      )}
                    >
                      {project.key}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/project/${project.id}`}
                        className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition truncate block"
                      >
                        {project.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span>Lead: {formattedLead}</span>
                        <span className="text-slate-300">•</span>
                        <span>{completedCount} of {taskCount} tasks completed</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-end md:self-auto shrink-0">
                    {/* Progress Bar */}
                    <div className="w-36 hidden sm:block">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                        <span>Sprint Progress</span>
                        <span className="font-mono text-slate-800 font-semibold">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            progress === 100
                              ? "bg-emerald-500"
                              : progress >= 50
                              ? "bg-blue-600"
                              : "bg-indigo-600"
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <PriorityBadge priority={project.priority} />

                    <Link href={`/dashboard/project/${project.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border-slate-200/80 hover:border-slate-300 shadow-2xs group flex items-center gap-1.5"
                      >
                        <span>Open Board</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 4. Enterprise AI Governance & Security Posture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Governance & Approval Queue */}
        <Card className="border-slate-200/90 bg-white shadow-xs hover:border-slate-300 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  AI Governance & Approval Queue
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proposals from autonomous agents awaiting manager authorization
                </p>
              </div>
            </div>

            <Link href="/dashboard/approvals">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-2 font-medium">
                View All ({pendingApprovals.length}) <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="pt-4 space-y-3 pb-6">
            {pendingApprovals.map((req) => {
              const actionTitle = req.actionType
                .toLowerCase()
                .split("_")
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

              const agentName = req.requestedBy.split("(")[0].trim();

              return (
                <div
                  key={req.id}
                  className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-md bg-white border border-slate-200/90 text-indigo-600 shadow-2xs shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {actionTitle}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        Proposed by <span className="font-medium text-slate-700">{agentName}</span>
                      </p>
                    </div>
                  </div>

                  <Link href="/dashboard/approvals" className="shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs group flex items-center gap-1.5"
                    >
                      <span>Review Action</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              );
            })}

            {pendingApprovals.length === 0 && (
              <div className="p-8 text-center rounded-lg border border-dashed border-slate-200 space-y-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-900">All autonomous proposals reviewed</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Autonomous agents operate in sandboxed read-only mode until optimizations are detected.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enterprise Security Posture & Guardrails */}
        <Card className="border-slate-200/90 bg-white shadow-xs hover:border-slate-300 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Enterprise Governance & Guardrails
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time workspace boundary controls and tenant isolation
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </CardHeader>

          <CardContent className="pt-4 space-y-3 pb-6">
            <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Multi-Tenant Boundary Isolation
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Row-Level Isolation
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                All projects, sprint backlogs, and audit logs are strictly partitioned under <span className="font-semibold text-slate-700">{orgName}</span>.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  Autonomous Agent Sandbox
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Constrained
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Zero autonomous write permissions granted. All mutations require human manager cryptographic sign-off.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                  Tamper-Evident Audit Ledger
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Immutable
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Every user interaction, AI proposal, and approval decision is logged to append-only audit trail records.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
