"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Building2,
  Mail,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { StatusIcon, PriorityIcon } from "./LinearIcons";
import { IssueDetailDrawer } from "./IssueDetailDrawer";
import { CreateIssueModal } from "./CreateIssueModal";
import { TaskStatus, Priority } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { sendProjectViaEmail } from "@/app/actions/work";

interface ProjectBoardClientProps {
  project: any;
  teamMembers: Array<{ id: string; name: string | null; email: string }>;
  allProjects: Array<{ id: string; name: string; key: string }>;
}

export function ProjectBoardClient({
  project,
  teamMembers,
  allProjects,
}: ProjectBoardClientProps) {
  const [selectedTask, setSelectedTask] = React.useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("ALL");
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
  const [emailRecipient, setEmailRecipient] = React.useState(project.owner?.email || "");
  const [emailNote, setEmailNote] = React.useState("");
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = React.useState<{ type: "success" | "warning" | "error"; text: string } | null>(null);

  const handleSendProjectEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecipient.trim()) return;

    setIsSendingEmail(true);
    setEmailStatusMsg(null);

    try {
      const res = await sendProjectViaEmail({
        projectId: project.id,
        recipientEmail: emailRecipient.trim(),
        note: emailNote.trim() || undefined,
      });

      if (res.success) {
        if (res.emailStatus?.delivered) {
          setEmailStatusMsg({
            type: "success",
            text: `✅ Project report successfully delivered to ${res.recipient} via Gmail!`,
          });
        } else if (res.emailStatus?.simulated) {
          setEmailStatusMsg({
            type: "warning",
            text: `⚠️ Simulation Mode: The mail was NOT sent because your Gmail App Password is not yet added in Vercel or .env. Add GMAIL_USER and GMAIL_APP_PASSWORD to send real emails.`,
          });
        } else {
          setEmailStatusMsg({
            type: "success",
            text: `Dispatched to ${res.recipient}.`,
          });
        }
      } else {
        setEmailStatusMsg({
          type: "error",
          text: `❌ ${res.error || "Failed to dispatch email"}`,
        });
      }
    } catch (err: any) {
      setEmailStatusMsg({
        type: "error",
        text: `❌ ${err.message || "An unexpected error occurred"}`,
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Pressing "C" globally opens issue creator
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "c" || e.key === "C") &&
        !isDrawerOpen &&
        !isCreateModalOpen &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setIsCreateModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, isCreateModalOpen]);

  // Open drawer when clicking a task card
  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  // Filter tasks
  const filteredTasks = (project.tasks || []).filter((task: any) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "ALL" || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const columns: Array<{ title: string; status: TaskStatus }> = [
    { title: "Backlog", status: TaskStatus.BACKLOG },
    { title: "To Do", status: TaskStatus.TODO },
    { title: "In Progress", status: TaskStatus.IN_PROGRESS },
    { title: "In Review", status: TaskStatus.IN_REVIEW },
    { title: "Done", status: TaskStatus.DONE },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* 1. Project Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/dashboard"
            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
              {project.key}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {project.name}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEmailStatusMsg(null);
              setIsEmailModalOpen(true);
            }}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Send via Gmail</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>New Issue</span>
            <kbd className="ml-1.5 px-1 py-0.2 rounded bg-white/20 text-[10px] font-mono">
              C
            </kbd>
          </Button>
        </div>
      </div>

      {/* 2. Linear-Style Quick Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 ml-2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter issues by title or key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* 3. Interactive 5-Column Linear Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 min-h-[600px] overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(
            (t: any) => t.status === col.status
          );

          return (
            <div
              key={col.status}
              className="rounded-xl border border-slate-200 bg-slate-100/70 p-3 flex flex-col flex-shrink-0 min-w-[220px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <StatusIcon status={col.status} className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold text-slate-800">
                    {col.title}
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 shadow-2xs font-semibold">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {colTasks.map((task: any) => {
                  const completedCount = (task.subtasks || []).filter(
                    (s: any) => s.completed
                  ).length;
                  const totalCount = (task.subtasks || []).length;

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className="p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition group cursor-pointer shadow-2xs space-y-2 active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                          {task.key}
                        </span>
                        <PriorityIcon priority={task.priority} className="w-3.5 h-3.5" />
                      </div>

                      <h3 className="text-xs font-semibold text-slate-900 leading-snug group-hover:text-blue-600 transition line-clamp-2">
                        {task.title}
                      </h3>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                        {totalCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-600">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>
                              {completedCount}/{totalCount}
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}

                        <span className="truncate max-w-[90px] font-mono text-slate-600">
                          {task.assignee?.name
                            ? task.assignee.name.split(" ")[0]
                            : "Unassigned"}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-28 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[11px] text-slate-400">
                    No issues
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Slide-out Linear Issue Detail Drawer */}
      <IssueDetailDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        teamMembers={teamMembers}
        onTaskUpdated={() => {
          // Re-trigger server revalidation on update
          window.location.reload();
        }}
      />

      {/* 5. Fast Issue Creator Modal */}
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projects={allProjects}
        teamMembers={teamMembers}
        defaultProjectId={project.id}
        onCreated={() => {
          window.location.reload();
        }}
      />

      {/* 6. Send Project via Gmail Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Send Project via Gmail</h3>
                  <p className="text-[11px] text-slate-500">Dispatch project overview & tasks link to any Gmail address</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendProjectEmail} className="space-y-4 text-xs">
              {/* Project preview card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{project.name}</span>
                  <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    [{project.key}]
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Priority: <strong className="text-slate-700">{project.priority || "MEDIUM"}</strong></span>
                  <span>&bull;</span>
                  <span>Tasks: <strong className="text-slate-700">{(project.tasks || []).length}</strong></span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Recipient Gmail Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. srinivasansathurappan70@gmail.com"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Personal Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Add any instructions, milestones, or team updates..."
                  value={emailNote}
                  onChange={(e) => setEmailNote(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              {emailStatusMsg && (
                <div
                  className={`p-3 rounded-xl text-[11px] leading-relaxed border ${
                    emailStatusMsg.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : emailStatusMsg.type === "warning"
                      ? "bg-amber-50 border-amber-200 text-amber-900"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  {emailStatusMsg.text}
                </div>
              )}

              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 text-[11px] text-blue-700">
                Dispatches a formatted executive summary with project telemetry and a direct link to this live Kanban board.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEmailModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSendingEmail || !emailRecipient.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      <span>Dispatch via Gmail</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
