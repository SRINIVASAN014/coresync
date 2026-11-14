"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, FolderKanban, ArrowRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Priority } from "@prisma/client";
import { createProject } from "@/app/actions/work";

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Projects Directory
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
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

          return (
            <Card
              key={p.id}
              className="hover:border-white/20 transition flex flex-col justify-between"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {p.key}
                  </span>
                  <Badge
                    variant={
                      p.priority === "URGENT"
                        ? "danger"
                        : p.priority === "HIGH"
                        ? "warning"
                        : "default"
                    }
                  >
                    {p.priority}
                  </Badge>
                </div>

                <Link
                  href={`/dashboard/project/${p.id}`}
                  className="text-base font-semibold text-white hover:text-indigo-300 transition block truncate"
                >
                  {p.name}
                </Link>

                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {p.description || "No project description provided."}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1 font-mono">
                    <span>
                      {completedCount}/{taskCount} tasks done
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-neutral-400">
                  <span>Lead: {p.owner?.name || "Admin"}</span>
                  <Link href={`/dashboard/project/${p.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Open Board <ArrowRight className="w-3 h-3 ml-1" />
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-50 w-full max-w-lg rounded-xl border border-white/10 bg-[#0E1015] p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <h2 className="text-base font-bold text-white">Create New Project</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Payments & Billing Gateway"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-[#14161C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Project Key (Prefix)
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="e.g. PAY"
                    value={key}
                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                    className="w-full bg-[#14161C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-[#14161C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Project goals, milestones, or architecture notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#14161C] border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
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
