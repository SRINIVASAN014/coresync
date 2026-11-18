"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Loader2,
  Check,
  User,
  Users,
  Send,
} from "lucide-react";
import { TaskStatus, Priority } from "@prisma/client";
import { updateTaskStatus } from "@/app/actions/work";
import { Button } from "@/components/ui/Button";

interface MyWorkClientProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
  };
  assignedTasks: any[];
  teamTasks: any[];
}

export function MyWorkClient({ user, assignedTasks, teamTasks }: MyWorkClientProps) {
  // Determine initial scope: If user has personal assigned tasks, show them; otherwise show team deliverables
  const [scope, setScope] = React.useState<"ASSIGNED_TO_ME" | "DELEGATED_TO_TEAM" | "ALL">(
    assignedTasks.length > 0 ? "ASSIGNED_TO_ME" : "ALL"
  );
  const [activeTab, setActiveTab] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(null);

  // Separate tasks assigned to others (delegated work)
  const delegatedTasks = React.useMemo(() => {
    return teamTasks.filter((t) => t.assigneeId && t.assigneeId !== user.id);
  }, [teamTasks, user.id]);

  // Active pool of tasks according to scope
  const activeTaskPool = React.useMemo(() => {
    if (scope === "ASSIGNED_TO_ME") return assignedTasks;
    if (scope === "DELEGATED_TO_TEAM") return delegatedTasks;
    return teamTasks;
  }, [scope, assignedTasks, delegatedTasks, teamTasks]);

  const [taskList, setTaskList] = React.useState<any[]>(activeTaskPool);

  // Sync taskList when activeTaskPool changes
  React.useEffect(() => {
    setTaskList(activeTaskPool);
  }, [activeTaskPool]);

  // Status Counts
  const todoCount = taskList.filter((t) => t.status === TaskStatus.TODO || t.status === TaskStatus.BACKLOG).length;
  const inProgressCount = taskList.filter((t) => t.status === TaskStatus.IN_PROGRESS).length;
  const inReviewCount = taskList.filter((t) => t.status === TaskStatus.IN_REVIEW).length;
  const doneCount = taskList.filter((t) => t.status === TaskStatus.DONE).length;
  const urgentCount = taskList.filter((t) => t.priority === Priority.URGENT || t.priority === Priority.HIGH).length;

  // Filter tasks based on activeTab and searchQuery
  const filteredTasks = taskList.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "ALL") return true;
    if (activeTab === "TODO") return task.status === TaskStatus.TODO || task.status === TaskStatus.BACKLOG;
    if (activeTab === "IN_PROGRESS") return task.status === TaskStatus.IN_PROGRESS;
    if (activeTab === "IN_REVIEW") return task.status === TaskStatus.IN_REVIEW;
    if (activeTab === "DONE") return task.status === TaskStatus.DONE;

    return true;
  });

  // Handle quick 1-click status change
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setUpdatingTaskId(taskId);
    try {
      const res = await updateTaskStatus(taskId, newStatus);
      if (res.success) {
        setTaskList((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto select-none pb-12">
      {/* 1. Cockpit Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Enterprise Work Cockpit
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>My Work & Deliverables</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {filteredTasks.length} Visible
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Deliverables allocated across project sprints for <strong>{user.name || user.email}</strong> and team.
          </p>
        </div>

        <Link href="/dashboard/projects">
          <Button variant="outline" size="sm" className="text-xs text-slate-700">
            <span>Browse All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* 2. Work Scope Switcher (Assigned to Me vs Delegated / Sent to Team vs All) */}
      <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-3 gap-1 text-xs font-semibold">
        <button
          onClick={() => setScope("ASSIGNED_TO_ME")}
          className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
            scope === "ASSIGNED_TO_ME"
              ? "bg-white text-blue-600 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Assigned to Me ({assignedTasks.length})</span>
        </button>

        <button
          onClick={() => setScope("DELEGATED_TO_TEAM")}
          className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
            scope === "DELEGATED_TO_TEAM"
              ? "bg-white text-blue-600 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Delegated / Sent to Team ({delegatedTasks.length})</span>
        </button>

        <button
          onClick={() => setScope("ALL")}
          className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
            scope === "ALL"
              ? "bg-white text-blue-600 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Project Tasks ({teamTasks.length})</span>
        </button>
      </div>

      {/* 3. KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>To Do</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{todoCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting execution</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>In Progress</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{inProgressCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active development</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>High / Urgent</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{urgentCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Top priority items</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{doneCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Closed & verified</div>
        </div>
      </div>

      {/* 4. Toolbar: Search & Status Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 ml-2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter by title, key, project, or assignee email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === "ALL"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All ({taskList.length})
          </button>
          <button
            onClick={() => setActiveTab("TODO")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === "TODO"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            To Do ({todoCount})
          </button>
          <button
            onClick={() => setActiveTab("IN_PROGRESS")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === "IN_PROGRESS"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setActiveTab("IN_REVIEW")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === "IN_REVIEW"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            In Review ({inReviewCount})
          </button>
          <button
            onClick={() => setActiveTab("DONE")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === "DONE"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Done ({doneCount})
          </button>
        </div>
      </div>

      {/* 5. Deliverables List */}
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-2xs overflow-hidden">
        {filteredTasks.map((task) => {
          const isUpdating = updatingTaskId === task.id;
          return (
            <div
              key={task.id}
              className="p-3.5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              {/* Left Column: Key, Title, Project, Assignee */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* 1-Click Status Quick Button */}
                <button
                  type="button"
                  title="Toggle Done"
                  onClick={() =>
                    handleStatusChange(
                      task.id,
                      task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE
                    )
                  }
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                    task.status === TaskStatus.DONE
                      ? "bg-emerald-500 border-emerald-600 text-white"
                      : "border-slate-300 hover:border-blue-500 text-transparent hover:text-slate-400"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
                      {task.key}
                    </span>
                    <Link
                      href={`/dashboard/project/${task.projectId}`}
                      className={`font-semibold text-slate-900 hover:text-blue-600 transition truncate ${
                        task.status === TaskStatus.DONE ? "line-through text-slate-400" : ""
                      }`}
                    >
                      {task.title}
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500">
                    <Link
                      href={`/dashboard/project/${task.projectId}`}
                      className="hover:underline flex items-center gap-1 text-slate-600 font-medium"
                    >
                      <span>{task.project?.name || "Project"}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                    </Link>

                    <span>&bull;</span>

                    {/* Assignee Badge */}
                    <div className="flex items-center gap-1 text-slate-600">
                      <User className="w-3 h-3 text-blue-500" />
                      <span>
                        {task.assignee?.name || task.assignee?.email ? (
                          <span className="font-medium text-slate-800">
                            {task.assignee.name || task.assignee.email}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </span>
                    </div>

                    {task.description && (
                      <>
                        <span>&bull;</span>
                        <span className="truncate max-w-sm text-slate-400">{task.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Status Select, Priority, Direct Jump */}
              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                {/* Priority Badge */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                    task.priority === Priority.URGENT || task.priority === Priority.HIGH
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : task.priority === Priority.LOW
                      ? "bg-slate-50 text-slate-600 border-slate-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {task.priority || "MEDIUM"}
                </span>

                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    disabled={isUpdating}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <option value={TaskStatus.BACKLOG}>Backlog</option>
                    <option value={TaskStatus.TODO}>To Do</option>
                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TaskStatus.IN_REVIEW}>In Review</option>
                    <option value={TaskStatus.DONE}>Done</option>
                  </select>
                  {isUpdating && (
                    <div className="absolute right-2 top-2 pointer-events-none">
                      <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                    </div>
                  )}
                </div>

                {/* Direct link to Project Board */}
                <Link
                  href={`/dashboard/project/${task.projectId}`}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Open in Project Board"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No deliverables found in this scope</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Switch between <strong>Assigned to Me</strong> and <strong>Delegated to Team</strong> above to view all tasks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
