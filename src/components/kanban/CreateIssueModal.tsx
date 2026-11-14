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
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-50 w-full max-w-xl rounded-xl border border-white/10 bg-[#0E1015] shadow-2xl animate-in zoom-in-95 duration-200 select-none overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0B0C0E]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              New Issue
            </span>
            <span className="text-neutral-600">•</span>
            {/* Project Selector */}
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-[#14161C] border border-white/10 text-xs font-semibold text-white rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
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
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition"
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
              className="w-full bg-transparent text-base font-semibold text-white placeholder:text-neutral-500 focus:outline-none"
            />
          </div>

          {/* Issue Description */}
          <div>
            <textarea
              placeholder="Add description, acceptance criteria, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#13151A] border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Linear-Style Quick Property Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Status Select */}
            <div className="flex items-center gap-1.5 bg-[#14161C] border border-white/10 rounded-lg px-2.5 py-1.5">
              <StatusIcon status={status} className="w-3.5 h-3.5" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="bg-transparent text-xs text-neutral-300 focus:outline-none cursor-pointer"
              >
                <option value="BACKLOG">Backlog</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Priority Select */}
            <div className="flex items-center gap-1.5 bg-[#14161C] border border-white/10 rounded-lg px-2.5 py-1.5">
              <PriorityIcon priority={priority} className="w-3.5 h-3.5" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="bg-transparent text-xs text-neutral-300 focus:outline-none cursor-pointer"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            {/* Assignee Select */}
            <div className="flex items-center gap-1.5 bg-[#14161C] border border-white/10 rounded-lg px-2.5 py-1.5">
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="bg-transparent text-xs text-neutral-300 focus:outline-none cursor-pointer"
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
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-[10px] text-neutral-500 font-mono">
              Press <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10">Ctrl+Enter</kbd> to save
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || isLoading}
                className="px-4 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-semibold rounded-lg shadow-md transition disabled:opacity-40 flex items-center gap-1.5"
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
