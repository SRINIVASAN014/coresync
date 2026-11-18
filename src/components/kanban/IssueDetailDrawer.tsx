"use client";

import * as React from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  Plus,
  Send,
  User as UserIcon,
  Copy,
  Check,
  Loader2,
  Trash2,
} from "lucide-react";
import { StatusIcon, PriorityIcon } from "./LinearIcons";
import { TaskStatus, Priority } from "@prisma/client";
import {
  updateTaskStatus,
  updateTaskPriority,
  updateTaskAssignee,
  toggleSubtask,
  createSubtask,
  decomposeTaskWithAI,
  addComment,
} from "@/app/actions/work";

interface IssueDrawerProps {
  task: any | null;
  isOpen: boolean;
  onClose: () => void;
  teamMembers?: Array<{ id: string; name: string | null; email: string }>;
  onTaskUpdated?: () => void;
}

export function IssueDetailDrawer({
  task,
  isOpen,
  onClose,
  teamMembers = [],
  onTaskUpdated,
}: IssueDrawerProps) {
  const [currentTask, setCurrentTask] = React.useState<any>(task);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState("");
  const [newCommentText, setNewCommentText] = React.useState("");
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  // Handle ESC key to close drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !currentTask) return null;

  // Status Change Handler
  const handleStatusChange = async (newStatus: TaskStatus) => {
    setCurrentTask((prev: any) => ({ ...prev, status: newStatus }));
    await updateTaskStatus(currentTask.id, newStatus);
    onTaskUpdated?.();
  };

  // Priority Change Handler
  const handlePriorityChange = async (newPriority: Priority) => {
    setCurrentTask((prev: any) => ({ ...prev, priority: newPriority }));
    await updateTaskPriority(currentTask.id, newPriority);
    onTaskUpdated?.();
  };

  // Assignee Change Handler
  const handleAssigneeChange = async (assigneeId: string) => {
    const selected = teamMembers.find((m) => m.id === assigneeId);
    setCurrentTask((prev: any) => ({
      ...prev,
      assigneeId,
      assignee: selected || null,
    }));
    await updateTaskAssignee(currentTask.id, assigneeId);
    onTaskUpdated?.();
  };

  // Subtask Toggle Handler
  const handleToggleSubtask = async (subtaskId: string, currentCompleted: boolean) => {
    const nextCompleted = !currentCompleted;
    setCurrentTask((prev: any) => ({
      ...prev,
      subtasks: (prev.subtasks || []).map((s: any) =>
        s.id === subtaskId ? { ...s, completed: nextCompleted } : s
      ),
    }));
    await toggleSubtask(subtaskId, nextCompleted);
    onTaskUpdated?.();
  };

  // Add Subtask Handler
  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const res = await createSubtask(currentTask.id, newSubtaskTitle.trim());
    if (res.success && res.subtask) {
      setCurrentTask((prev: any) => ({
        ...prev,
        subtasks: [...(prev.subtasks || []), res.subtask],
      }));
      setNewSubtaskTitle("");
      onTaskUpdated?.();
    }
  };

  // AI Deconstruct Handler
  const handleAiDecompose = async () => {
    setIsAiLoading(true);
    try {
      const res = await decomposeTaskWithAI(currentTask.id);
      if (res.success && res.subtasks) {
        setCurrentTask((prev: any) => ({
          ...prev,
          aiGenerated: true,
          subtasks: [...(prev.subtasks || []), ...res.subtasks],
        }));
        onTaskUpdated?.();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Add Comment Handler
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const res = await addComment(currentTask.id, newCommentText.trim());
    if (res.success && res.comment) {
      setCurrentTask((prev: any) => ({
        ...prev,
        comments: [...(prev.comments || []), res.comment],
      }));
      setNewCommentText("");
      onTaskUpdated?.();
    }
  };

  const completedSubtasks = (currentTask.subtasks || []).filter(
    (s: any) => s.completed
  ).length;
  const totalSubtasks = (currentTask.subtasks || []).length;
  const subtaskProgress =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative z-50 w-full max-w-2xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 select-none text-slate-900">
        
        {/* 1. Header Toolbar */}
        <div className="h-14 px-6 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
              {currentTask.key}
            </span>

            {currentTask.aiGenerated && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-blue-600" />
                AI Assisted
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition flex items-center gap-1 text-xs"
              title="Copy issue link"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Issue Title & Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {currentTask.title}
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-wrap">
              {currentTask.description || "No description provided."}
            </p>
          </div>

          {/* Linear-Style Property Pickers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
            {/* Status Picker */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                Status
              </label>
              <div className="relative">
                <select
                  value={currentTask.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  className="w-full bg-white text-xs text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="BACKLOG">Backlog</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="DONE">Done</option>
                </select>
                <div className="absolute right-2.5 top-2 pointer-events-none">
                  <StatusIcon status={currentTask.status} className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Priority Picker */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                Priority
              </label>
              <div className="relative">
                <select
                  value={currentTask.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                  className="w-full bg-white text-xs text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
                <div className="absolute right-2.5 top-2 pointer-events-none">
                  <PriorityIcon priority={currentTask.priority} className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Assignee Picker */}
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                Assignee
              </label>
              <select
                value={currentTask.assigneeId || ""}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full bg-white text-xs text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="">Unassigned</option>
                {currentTask.assignee &&
                  !teamMembers.some((m) => m.id === currentTask.assigneeId) && (
                    <option value={currentTask.assigneeId}>
                      {currentTask.assignee.name || currentTask.assignee.email}
                    </option>
                  )}
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name || member.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subtasks Tree & AI Decomposition */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Subtasks
                </h3>
                {totalSubtasks > 0 && (
                  <span className="text-xs font-mono text-slate-500 font-semibold">
                    ({completedSubtasks}/{totalSubtasks})
                  </span>
                )}
              </div>

              {/* AI Decompose Button */}
              <button
                onClick={handleAiDecompose}
                disabled={isAiLoading}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 px-3 py-1.5 rounded-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Deconstructing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Deconstruct with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            {totalSubtasks > 0 && (
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>
            )}

            {/* Subtask Checklist */}
            <div className="space-y-1.5">
              {(currentTask.subtasks || []).map((sub: any) => (
                <div
                  key={sub.id}
                  onClick={() => handleToggleSubtask(sub.id, sub.completed)}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100/70 cursor-pointer transition group shadow-2xs"
                >
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span
                    className={`text-xs transition-colors ${
                      sub.completed
                        ? "line-through text-slate-400"
                        : "text-slate-800 group-hover:text-blue-600"
                    }`}
                  >
                    {sub.title}
                  </span>
                </div>
              ))}

              {/* Quick Add Subtask Input */}
              <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="+ Add new subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newSubtaskTitle.trim()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-medium rounded-lg border border-slate-200 disabled:opacity-40 transition cursor-pointer"
                >
                  Add
                </button>
              </form>
            </div>
          </div>

          {/* Activity & Comments Stream */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Activity & Comments
            </h3>

            {/* Comments List */}
            <div className="space-y-2.5">
              {(currentTask.comments || []).map((c: any) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-900">
                      {c.user?.name || "Team Member"}
                    </span>
                    <span className="font-mono text-[10px]">
                      {new Date(c.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {c.content}
                  </p>
                </div>
              ))}

              {(currentTask.comments || []).length === 0 && (
                <p className="text-xs text-slate-400 italic py-2">
                  No comments yet. Start the conversation below.
                </p>
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Leave an engineering update or mention a teammate..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-sm shadow-blue-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
