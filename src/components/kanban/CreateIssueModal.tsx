"use client";

import * as React from "react";
import { X, Sparkles, Loader2, Plus } from "lucide-react";
import { TaskStatus, Priority } from "@prisma/client";
import { createIssue } from "@/app/actions/work";
import { StatusIcon, PriorityIcon } from "./LinearIcons";

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Array<{ id: string; name: string; key: string }>;
  teamMembers: Array<{ id: string; name: string | null; email: string }>;
  defaultProjectId?: string;
  onCreated?: () => void;
}

export function CreateIssueModal({
  isOpen,
  onClose,
  projects,
  teamMembers,
  defaultProjectId,
  onCreated,
}: CreateIssueModalProps) {
  const [selectedProjectId, setSelectedProjectId] = React.useState(
    defaultProjectId || (projects[0]?.id || "")
  );
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = React.useState<Priority>(Priority.MEDIUM);
  const [assigneeId, setAssigneeId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (defaultProjectId) setSelectedProjectId(defaultProjectId);
  }, [defaultProjectId]);

  // Global "C" key shortcut to open issue creator
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Ctrl + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && isOpen) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, title, selectedProjectId, status, priority, assigneeId]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !selectedProjectId) return;

    setIsLoading(true);
    try {
      const res = await createIssue({
        projectId: selectedProjectId,
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId: assigneeId || undefined,
      });

      if (res.success) {
        setTitle("");
        setDescription("");
        onCreated?.();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-50 w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 select-none overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              New Issue
            </span>
            <span className="text-slate-300">•</span>
            {/* Project Selector */}
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-semibold text-slate-800 rounded-md px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.key} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Issue Title */}
          <div>
            <input
              type="text"
              autoFocus
              placeholder="Issue title (e.g. Implement Zero-Trust OAuth PKCE flow)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Issue Description */}
          <div>
            <textarea
              placeholder="Add description, acceptance criteria, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed transition"
            />
          </div>

          {/* Linear-Style Quick Property Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Status Select */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
              <StatusIcon status={status} className="w-3.5 h-3.5" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="BACKLOG">Backlog</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Priority Select */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
              <PriorityIcon priority={priority} className="w-3.5 h-3.5" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            {/* Assignee Select */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="">Assignee: Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    Assignee: {m.name || m.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-mono">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono">Ctrl+Enter</kbd> to save
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || isLoading}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>Create Issue</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
