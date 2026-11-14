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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <Link
            href="/dashboard"
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
              {project.key}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {project.name}
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>New Issue</span>
            <kbd className="ml-1.5 px-1 py-0.2 rounded bg-black/10 text-[10px] font-mono">
              C
            </kbd>
          </Button>
        </div>
      </div>

      {/* 2. Linear-Style Quick Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0C0E12] p-2 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 ml-2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter issues by title or key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder:text-neutral-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#14161C] border border-white/10 text-xs text-neutral-300 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
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
              className="rounded-xl border border-white/5 bg-[#0C0E12]/80 p-3 flex flex-col flex-shrink-0 min-w-[220px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <StatusIcon status={col.status} className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold text-neutral-300">
                    {col.title}
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-neutral-400">
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
                      className="p-3 rounded-lg border border-white/5 bg-[#121418] hover:border-white/20 hover:bg-[#16181F] transition group cursor-pointer shadow-sm space-y-2 active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold text-neutral-400 group-hover:text-indigo-300 transition-colors">
                          {task.key}
                        </span>
                        <PriorityIcon priority={task.priority} className="w-3.5 h-3.5" />
                      </div>

                      <h3 className="text-xs font-semibold text-white leading-snug group-hover:text-indigo-200 transition line-clamp-2">
                        {task.title}
                      </h3>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-neutral-400">
                        {totalCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>
                              {completedCount}/{totalCount}
                            </span>
                          </span>
                        ) : (
                          <span className="text-neutral-600">—</span>
                        )}

                        <span className="truncate max-w-[90px] font-mono">
                          {task.assignee?.name
                            ? task.assignee.name.split(" ")[0]
                            : "Unassigned"}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-28 border border-dashed border-white/5 rounded-lg flex items-center justify-center text-[11px] text-neutral-600">
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
    </div>
  );
}
