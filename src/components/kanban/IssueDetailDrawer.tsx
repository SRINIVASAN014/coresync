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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative z-50 w-full max-w-2xl bg-[#0D0F12] border-l border-white/10 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 select-none">
        
        {/* 1. Header Toolbar */}
        <div className="h-14 px-6 border-b border-white/5 flex items-center justify-between flex-shrink-0 bg-[#0B0C0E]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded">
              {currentTask.key}
            </span>

            {currentTask.aiGenerated && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-indigo-400" />
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
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition flex items-center gap-1 text-xs"
              title="Copy issue link"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Issue Title & Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white leading-snug">
              {currentTask.title}
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed bg-[#121418] p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
              {currentTask.description || "No description provided."}
            </p>
          </div>

          {/* Linear-Style Property Pickers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-white/5 bg-[#121418]">
            {/* Status Picker */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider block">
                Status
              </label>
              <div className="relative">
                <select
                  value={currentTask.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  className="w-full bg-[#181A20] text-xs text-white border border-white/10 rounded-lg px-2.5 py-1.5 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
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
              <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider block">
                Priority
              </label>
              <div className="relative">
                <select
                  value={currentTask.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                  className="w-full bg-[#181A20] text-xs text-white border border-white/10 rounded-lg px-2.5 py-1.5 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
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
              <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider block">
                Assignee
              </label>
              <select
                value={currentTask.assigneeId || ""}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full bg-[#181A20] text-xs text-white border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Unassigned</option>
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
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Subtasks
                </h3>
                {totalSubtasks > 0 && (
                  <span className="text-xs font-mono text-neutral-400">
                    ({completedSubtasks}/{totalSubtasks})
                  </span>
                )}
              </div>

              {/* AI Decompose Button */}
              <button
                onClick={handleAiDecompose}
                disabled={isAiLoading}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-lg transition active:scale-95 disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Deconstructing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Deconstruct with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            {totalSubtasks > 0 && (
              <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
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
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-[#121418] border border-white/5 hover:border-white/10 cursor-pointer transition group"
                >
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <span
                    className={`text-xs transition-colors ${
                      sub.completed
                        ? "line-through text-neutral-500"
                        : "text-neutral-200 group-hover:text-white"
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
                  className="flex-1 bg-[#121418] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newSubtaskTitle.trim()}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-xs text-white font-medium rounded-lg disabled:opacity-40 transition"
                >
                  Add
                </button>
              </form>
            </div>
          </div>

          {/* Activity & Comments Stream */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Activity & Comments
            </h3>

            {/* Comments List */}
            <div className="space-y-2.5">
              {(currentTask.comments || []).map((c: any) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg bg-[#121418] border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-semibold text-white">
                      {c.user?.name || "Team Member"}
                    </span>
                    <span className="font-mono text-[10px]">
                      {new Date(c.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {c.content}
                  </p>
                </div>
              ))}

              {(currentTask.comments || []).length === 0 && (
                <p className="text-xs text-neutral-500 italic py-2">
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
                className="flex-1 bg-[#121418] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50"
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
