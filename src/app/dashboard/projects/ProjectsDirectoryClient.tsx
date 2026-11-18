"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, FolderKanban, ArrowRight, Loader2, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Priority } from "@prisma/client";
import { createProject } from "@/app/actions/work";
import { cn } from "@/lib/utils";

interface ProjectsDirectoryClientProps {
  projects: any[];
  orgName: string;
}

export function ProjectsDirectoryClient({
  projects,
  orgName,
}: ProjectsDirectoryClientProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [key, setKey] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState<Priority>(Priority.MEDIUM);
  const [isLoading, setIsLoading] = React.useState(false);

  // Auto-generate key from name if not manually modified
  const handleNameChange = (val: string) => {
    setName(val);
    if (!key || key.length <= 4) {
      const generated = val
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 3)
        .toUpperCase();
      if (generated) setKey(generated);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;

    setIsLoading(true);
    try {
      const res = await createProject({
        name: name.trim(),
        key: key.trim().toUpperCase(),
        description: description.trim(),
        priority,
      });

      if (res.success) {
        setIsModalOpen(false);
        setName("");
        setKey("");
        setDescription("");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Projects Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            All active engineering roadmaps and boards across {orgName}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>New Project</span>
        </Button>
      </div>

      {/* 2. Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => {
          const taskCount = (p.tasks || []).length;
          const completedCount = (p.tasks || []).filter(
            (t: any) => t.status === "DONE"
          ).length;
          const progress =
            taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

          // Format owner name in clean title case
          const rawLead = p.owner?.name || "Enterprise Lead";
          const formattedLead = rawLead
            .split(" ")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");

          const keyBadgeStyles: Record<string, string> = {
            IAM: "bg-emerald-50 text-emerald-700 border-emerald-200/90",
            SEC: "bg-indigo-50 text-indigo-700 border-indigo-200/90",
            GOV: "bg-purple-50 text-purple-700 border-purple-200/90",
            MOB: "bg-sky-50 text-sky-700 border-sky-200/90",
          };
          const badgeStyle =
            keyBadgeStyles[p.key.toUpperCase()] ||
            "bg-slate-100 text-slate-700 border-slate-200/90";

          return (
            <Card
              key={p.id}
              className="hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs tracking-wider border shadow-2xs select-none",
                      badgeStyle
                    )}
                  >
                    {p.key}
                  </span>
                  <PriorityBadge priority={p.priority} />
                </div>

                <div>
                  <Link
                    href={`/dashboard/project/${p.id}`}
                    className="text-base font-bold text-slate-900 hover:text-blue-600 transition block truncate"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                    {p.description || "No project description provided."}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                    <span>
                      {completedCount} of {taskCount} tasks completed
                    </span>
                    <span className="text-slate-800 font-semibold font-mono">{progress}%</span>
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

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="truncate max-w-[150px]">Lead: {formattedLead}</span>
                  <Link href={`/dashboard/project/${p.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200 hover:border-slate-300 shadow-2xs group flex items-center gap-1"
                    >
                      <span>Open Board</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-50 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Create New Project</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Payments & Billing Gateway"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Project Key (Prefix)
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="e.g. PAY"
                    value={key}
                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Project goals, milestones, or architecture notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100/80 rounded-xl p-2.5 flex items-center gap-2 text-blue-700 text-[11px]">
                <Mail className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                <span>Executive onboarding confirmation & board link will be delivered to your Gmail inbox.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={!name.trim() || !key.trim() || isLoading}
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
