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
  Users,
  CheckSquare,
  Square,
  Share2,
  Send,
} from "lucide-react";
import { StatusIcon, PriorityIcon } from "./LinearIcons";
import { IssueDetailDrawer } from "./IssueDetailDrawer";
import { CreateIssueModal } from "./CreateIssueModal";
import { TaskStatus, Priority } from "@prisma/client";
import { Button } from "@/components/ui/Button";

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
  const [dispatchMode, setDispatchMode] = React.useState<"ROLE_TARGETED" | "FAN_OUT_ALL">("ROLE_TARGETED");
  const [selectedRole, setSelectedRole] = React.useState<string>("DEVELOPER");
  const [emailRecipient, setEmailRecipient] = React.useState(project.owner?.email || "");
  const [emailNote, setEmailNote] = React.useState("");
  const [selectedTaskIds, setSelectedTaskIds] = React.useState<string[]>(
    (project.tasks || []).map((t: any) => t.id)
  );
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = React.useState<{ type: "success" | "warning" | "error"; text: string } | null>(null);

  // Toggle single task in split selection
  const toggleTaskId = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle all tasks
  const toggleAllTasks = () => {
    if (selectedTaskIds.length === (project.tasks || []).length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds((project.tasks || []).map((t: any) => t.id));
    }
  };

  const handleSendProjectEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dispatchMode === "ROLE_TARGETED" && !emailRecipient.trim()) return;

    setIsSendingEmail(true);
    setEmailStatusMsg(null);

    try {
      const response = await fetch("/api/projects/dispatch-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          dispatchMode,
          recipientEmail: emailRecipient.trim(),
          recipientRole: selectedRole,
          note: emailNote.trim() || undefined,
          selectedTaskIds: dispatchMode === "ROLE_TARGETED" ? selectedTaskIds : [],
        }),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        if (res.mode === "FAN_OUT_ALL") {
          setEmailStatusMsg({
            type: "success",
            text: `✅ Multi-Tenant MNC Fan-Out: Work packages split and delivered to ${res.totalRecipients} team members based on their assigned roles!`,
          });
        } else if (res.emailStatus?.delivered) {
          setEmailStatusMsg({
            type: "success",
            text: `✅ Delivered ${res.tasksSplitCount} allocated deliverables to ${res.recipient} [${res.role}] via Gmail!`,
          });
        } else if (res.emailStatus?.simulated) {
          setEmailStatusMsg({
            type: "warning",
            text: `⚠️ Simulation Mode: Prepared ${res.tasksSplitCount} tasks for ${res.recipient} [${res.role}]. Add GMAIL_USER and GMAIL_APP_PASSWORD in Vercel to deliver directly to inboxes.`,
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

      {/* 6. MNC Enterprise Project & Role-Split Dispatch via Gmail Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative text-slate-900 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">MNC Enterprise Project Dispatch</h3>
                  <p className="text-[11px] text-slate-500">Split project deliverables and dispatch via Gmail according to team role</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-100 rounded-xl text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setDispatchMode("ROLE_TARGETED")}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  dispatchMode === "ROLE_TARGETED"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Split by Role & Assignee</span>
              </button>
              <button
                type="button"
                onClick={() => setDispatchMode("FAN_OUT_ALL")}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  dispatchMode === "FAN_OUT_ALL"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Auto Fan-Out to Team</span>
              </button>
            </div>

            <form onSubmit={handleSendProjectEmail} className="space-y-4 text-xs mt-4 overflow-y-auto pr-1 flex-1">
              {/* Project preview header */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{project.name}</span>
                    <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      [{project.key}]
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Priority: <strong className="text-slate-700">{project.priority || "MEDIUM"}</strong> &bull; Total Tasks: <strong className="text-slate-700">{(project.tasks || []).length}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Workspace</span>
                  <span className="text-[11px] font-semibold text-slate-700">Global CyberTech</span>
                </div>
              </div>

              {dispatchMode === "ROLE_TARGETED" ? (
                <>
                  {/* Role Selector */}
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Target Role for Deliverable Split
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-medium"
                    >
                      <option value="DEVELOPER">Developer (Frontend / Backend Engineering)</option>
                      <option value="QA_ENGINEER">QA Engineer (Testing & Regression Checklist)</option>
                      <option value="SECURITY_LEAD">Security Lead (Zero-Trust & IAM Hardening)</option>
                      <option value="PRODUCT_OWNER">Project Owner / Stakeholder (Executive Summary)</option>
                      <option value="DEVOPS_LEAD">DevOps / SRE (CI/CD & Infrastructure)</option>
                      <option value="CONTRIBUTOR">General Contributor</option>
                    </select>
                  </div>

                  {/* Recipient Email */}
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Recipient Gmail Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jayavignesh591@gmail.com"
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  {/* Deliverables Split Checklist */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-semibold text-slate-700">
                        Allocated Tasks for this Role ({selectedTaskIds.length}/{(project.tasks || []).length})
                      </label>
                      <button
                        type="button"
                        onClick={toggleAllTasks}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {selectedTaskIds.length === (project.tasks || []).length ? "Deselect All" : "Select All"}
                      </button>
                    </div>

                    <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                      {(project.tasks || []).map((t: any) => {
                        const isChecked = selectedTaskIds.includes(t.id);
                        return (
                          <div
                            key={t.id}
                            onClick={() => toggleTaskId(t.id)}
                            className="p-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer text-[11px] transition"
                          >
                            <div className="flex items-center gap-2 truncate">
                              {isChecked ? (
                                <CheckSquare className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                              <span className="font-mono font-bold text-slate-600 text-[10px]">
                                {t.key}
                              </span>
                              <span className="truncate text-slate-900 font-medium">{t.title}</span>
                            </div>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                                t.priority === "URGENT" || t.priority === "HIGH"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {t.priority || "MED"}
                            </span>
                          </div>
                        );
                      })}
                      {(project.tasks || []).length === 0 && (
                        <div className="p-3 text-center text-slate-400 text-[11px]">No tasks created yet</div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-[11px] text-blue-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-blue-800 text-xs">
                    <Users className="w-4 h-4" />
                    <span>Automated MNC Enterprise Fan-Out Mode</span>
                  </div>
                  <p className="leading-relaxed">
                    CoreSync will automatically inspect all <strong>{(project.tasks || []).length} work items</strong> in this project, group them by their assigned team members, and dispatch tailored role-specific checklists directly to each member&apos;s Gmail address.
                  </p>
                  <div className="bg-white/80 rounded-lg p-2.5 border border-blue-100 text-[11px] text-slate-700 space-y-1">
                    <div>&bull; <strong>Developers:</strong> Receive implementation items & PR tracking links.</div>
                    <div>&bull; <strong>QA / Testers:</strong> Receive testing checklists & validation status.</div>
                    <div>&bull; <strong>Project Owner:</strong> Receives complete high-level sprint governance summary.</div>
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Executive Notes / Directives (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions, sprint milestones, or compliance requirements..."
                  value={emailNote}
                  onChange={(e) => setEmailNote(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              {emailStatusMsg && (
                <div
                  className={`p-3 rounded-xl text-[11px] leading-relaxed border ${
                    emailStatusMsg.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium"
                      : emailStatusMsg.type === "warning"
                      ? "bg-amber-50 border-amber-200 text-amber-900"
                      : "bg-rose-50 border-rose-200 text-rose-800 font-medium"
                  }`}
                >
                  {emailStatusMsg.text}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
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
                  disabled={isSendingEmail || (dispatchMode === "ROLE_TARGETED" && !emailRecipient.trim())}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching...</span>
                    </>
                  ) : dispatchMode === "FAN_OUT_ALL" ? (
                    <>
                      <Users className="w-3.5 h-3.5" />
                      <span>Fan-Out to All Team Members</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Role Package ({selectedTaskIds.length} Tasks)</span>
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
