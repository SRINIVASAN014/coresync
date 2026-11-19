"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  PanelLeftClose,
  PanelLeft,
  LayoutGrid,
  User,
  Clock,
  Star,
  Layers,
  FolderKanban,
  Plus,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Zap,
  Sparkles,
  Filter,
  LayoutDashboard,
  ShieldCheck,
  Shield,
  Users,
  Settings,
  ExternalLink,
  Building2,
  Check,
  X,
  RefreshCw,
  KanbanSquare,
  Wrench,
  Compass,
  Rocket,
  Plane,
  Mail,
  CheckSquare,
} from "lucide-react";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { cn } from "@/lib/utils";
import { switchActiveOrganization, createOrganization, createProject } from "@/app/actions/work";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { CoreSyncLogo } from "@/components/ui/CoreSyncLogo";

// Custom Jira Product Discovery Icons matching user screenshot
function IdeaListIcon({ className = "w-3.5 h-3.5 text-slate-500" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="7" r="1.5" fill="currentColor" />
      <circle cx="5" cy="17" r="1.5" fill="currentColor" />
      <line x1="10" y1="7" x2="20" y2="7" />
      <line x1="10" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function MatrixIcon({ className = "w-3.5 h-3.5 text-slate-500" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4v16h16" />
      <circle cx="9" cy="9" r="1.8" fill="currentColor" />
      <circle cx="16" cy="7" r="1.8" fill="currentColor" />
      <circle cx="13" cy="14" r="1.8" fill="currentColor" />
    </svg>
  );
}

function TimelineBarsIcon({ className = "w-3.5 h-3.5 text-slate-500" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="4" y1="17" x2="14" y2="17" />
    </svg>
  );
}

export interface ProjectItem {
  id: string;
  name: string;
  key: string;
  status?: string;
}

export interface OrgItem {
  id: string;
  name: string;
  slug: string;
  role: string;
  isActive?: boolean;
}

interface SidebarProps {
  currentOrgName?: string;
  currentOrgSlug?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  organizations?: OrgItem[];
  projects?: ProjectItem[];
  pendingApprovalsCount?: number;
}

export function Sidebar({
  currentOrgName = "Global CyberTech Solutions",
  currentOrgSlug = "cybertech-global",
  userEmail = "admin@cybertech.com",
  userName = "Enterprise User",
  userRole = "OWNER",
  organizations = [],
  projects = [],
  pendingApprovalsCount = 0,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawView = searchParams.get("view") || "horizon-roadmap";
  const isViewActive = (viewKey: string) => {
    if (viewKey === "initiatives") return rawView === "initiatives" || rawView === "all-ideas";
    if (viewKey === "priority-scoring") return rawView === "priority-scoring" || rawView === "impact-assessment";
    if (viewKey === "strategic-matrix") return rawView === "strategic-matrix" || rawView === "impact-vs-effort";
    if (viewKey === "horizon-roadmap") return rawView === "horizon-roadmap" || rawView === "roadmap" || !rawView;
    if (viewKey === "milestone-schedule") return rawView === "milestone-schedule" || rawView === "timeline";
    if (viewKey === "active-delivery") return rawView === "active-delivery" || rawView === "in-flight";
    return false;
  };

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = React.useState(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = React.useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = React.useState(false);
  const [isDiscoveryMenuOpen, setIsDiscoveryMenuOpen] = React.useState(false);

  // New Project Form State
  const [newProjectName, setNewProjectName] = React.useState("");
  const [newProjectKey, setNewProjectKey] = React.useState("");
  const [newProjectDesc, setNewProjectDesc] = React.useState("");
  const [isSubmittingProject, setIsSubmittingProject] = React.useState(false);
  const [projectError, setProjectError] = React.useState("");

  // New Org Form State
  const [newOrgName, setNewOrgName] = React.useState("");
  const [newOrgIndustry, setNewOrgIndustry] = React.useState("Technology & Software");
  const [isSubmittingOrg, setIsSubmittingOrg] = React.useState(false);
  const [orgError, setOrgError] = React.useState("");

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Deduplicate organizations defensively
  const uniqueOrganizations = React.useMemo(() => {
    const map = new Map<string, OrgItem>();
    organizations.forEach((org, idx) => {
      const key = org.id || `org-${idx}`;
      if (!map.has(key)) map.set(key, org);
    });
    return Array.from(map.values());
  }, [organizations]);

  // Fallback demo projects if database has none
  const displayProjects = React.useMemo(() => {
    if (projects && projects.length > 0) return projects;
    return [
      { id: "example-billing", name: "(Example) Billing System Dev", key: "BILL" },
      { id: "example-software", name: "My Software Team", key: "DEV" },
    ];
  }, [projects]);

  const starredProject = displayProjects[0] || {
    id: "example-billing",
    name: "(Example) Billing System Dev",
    key: "BILL",
  };
  const recentProjects = displayProjects.slice(1);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOrgDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchOrg = async (orgId: string) => {
    setIsOrgDropdownOpen(false);
    await switchActiveOrganization(orgId);
    router.refresh();
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    setIsSubmittingOrg(true);
    setOrgError("");

    const res = await createOrganization({
      name: newOrgName.trim(),
      industry: newOrgIndustry,
    });

    if (res.success) {
      setIsCreateOrgModalOpen(false);
      setNewOrgName("");
      setIsOrgDropdownOpen(false);
      router.refresh();
    } else {
      setOrgError(res.error || "Failed to create organization");
    }
    setIsSubmittingOrg(false);
  };

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectKey.trim()) return;

    setIsSubmittingProject(true);
    setProjectError("");

    const res = await createProject({
      name: newProjectName.trim(),
      key: newProjectKey.trim().toUpperCase(),
      description: newProjectDesc.trim() || undefined,
    });

    if (res.success && res.project) {
      setIsCreateProjectModalOpen(false);
      setNewProjectName("");
      setNewProjectKey("");
      setNewProjectDesc("");
      router.push(`/dashboard/project/${res.project.id}`);
      router.refresh();
    } else {
      setProjectError(res.error || "Failed to create project");
    }
    setIsSubmittingProject(false);
  };

  // Generate suggested key as project name is typed
  const handleProjectNameChange = (name: string) => {
    setNewProjectName(name);
    if (!newProjectKey || newProjectKey === name.slice(0, 3).toUpperCase()) {
      const generated = name
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 4)
        .toUpperCase();
      setNewProjectKey(generated);
    }
  };

  return (
    <>
      <aside
        className={cn(
          "flex-shrink-0 border-r border-slate-200 bg-white flex flex-col h-screen select-none relative z-30 transition-all duration-200 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* 1. Top Header Row */}
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-3 gap-2 flex-shrink-0">
          {/* CoreSync Brand Wordmark */}
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0 group">
            <CoreSyncLogo size={28} />
            {!isCollapsed && (
              <span className="text-base font-bold text-slate-900 tracking-tight truncate">
                Core<span className="text-[#3B82F6]">Sync</span>
              </span>
            )}
          </Link>

          {/* Collapse / Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer flex-shrink-0"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* 2. Workspace Selector Button */}
        {!isCollapsed && (
          <div className="p-2 border-b border-slate-100 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold flex-shrink-0">
                  {currentOrgName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate leading-tight group-hover:text-[#0C66E4]">
                    {currentOrgName}
                  </p>
                  <RoleBadge role={userRole} size="sm" />
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            </button>

            {/* Workspace Dropdown Popover */}
            {isOrgDropdownOpen && (
              <div className="absolute top-full left-2 right-2 mt-1 bg-white border border-slate-200 rounded-xl p-2 shadow-xl z-50">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Workspaces ({uniqueOrganizations.length})
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 my-1">
                  {uniqueOrganizations.map((org, idx) => {
                    const isActive = org.name === currentOrgName;
                    return (
                      <button
                        key={org.id || `org-${idx}`}
                        onClick={() => handleSwitchOrg(org.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition cursor-pointer",
                          isActive
                            ? "bg-blue-50 text-[#0C66E4] font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <span className="truncate">{org.name}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-[#0C66E4]" />}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-1 border-t border-slate-100 mt-1">
                  <button
                    onClick={() => {
                      setIsOrgDropdownOpen(false);
                      setIsCreateOrgModalOpen(true);
                    }}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-[#0C66E4] hover:bg-blue-50 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Scrollable Sidebar Navigation Tree */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          
          {/* Section A: Personal Overview (For You, Recent, Starred, Plans) */}
          <div className="space-y-0.5">
            {/* For You */}
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs transition",
                pathname === "/dashboard"
                  ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-normal"
              )}
              title="For you"
            >
              <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
              {!isCollapsed && <span>For you</span>}
            </Link>

            {/* Recent */}
            <Link
              href="/dashboard"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition group"
              title="Recent"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                {!isCollapsed && <span>Recent</span>}
              </div>
              {!isCollapsed && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              )}
            </Link>

            {/* Starred */}
            <Link
              href="/dashboard"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition group"
              title="Starred"
            >
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-slate-500 flex-shrink-0" />
                {!isCollapsed && <span>Starred</span>}
              </div>
              {!isCollapsed && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              )}
            </Link>

            {/* Apps & Workspaces */}
            <Link
              href="/dashboard/projects"
              className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
              title="Apps"
            >
              <LayoutGrid className="w-4 h-4 text-slate-500 flex-shrink-0" />
              {!isCollapsed && <span>Apps</span>}
            </Link>

            {/* Plans / Kanban Roadmap */}
            <Link
              href="/dashboard/kanban"
              className={cn(
                "flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs transition",
                pathname === "/dashboard/kanban"
                  ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-normal"
              )}
              title="Plans"
            >
              <Layers className="w-4 h-4 text-slate-500 flex-shrink-0" />
              {!isCollapsed && <span>Plans</span>}
            </Link>
          </div>

          {/* Section B: Spaces / Projects Section (From User's Photo) */}
          <div className="pt-2 border-t border-slate-100">
            {/* Header: Spaces / Projects with '+' and '...' */}
            <div className="flex items-center justify-between px-2 py-1 mb-1">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-600 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-xs font-semibold text-slate-800">Projects</span>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setIsCreateProjectModalOpen(true)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                    title="Create new project"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    href="/dashboard/projects"
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                    title="View all projects"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="space-y-2 mt-1">
                {/* 1. Subcategory: Starred */}
                <div>
                  <div className="px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    Starred
                  </div>
                  {/* Starred Active Project Card */}
                  <Link
                    href={starredProject.id === "example-billing" ? "/dashboard/kanban" : `/dashboard/project/${starredProject.id}`}
                    className={cn(
                      "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition mt-0.5 group",
                      pathname.includes(starredProject.id) || (starredProject.id === "example-billing" && pathname === "/dashboard/kanban")
                        ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {/* Jira-Style Sync / Blue-Purple Project Badge */}
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-2xs">
                      <RefreshCw className="w-3 h-3 text-white" />
                    </div>
                    <span className="truncate">{starredProject.name}</span>
                  </Link>
                </div>

                {/* 2. Subcategory: Recent */}
                <div>
                  <div className="px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    Recent
                  </div>
                  {recentProjects.map((p, idx) => (
                    <Link
                      key={p.id || idx}
                      href={`/dashboard/project/${p.id}`}
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition mt-0.5",
                        pathname.includes(p.id)
                          ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      {/* Jira-Style Tool Project Badge */}
                      <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-2xs">
                        <Wrench className="w-3 h-3 text-white" />
                      </div>
                      <span className="truncate">{p.name}</span>
                    </Link>
                  ))}

                  {/* More Projects Button with Chevron */}
                  <Link
                    href="/dashboard/projects"
                    className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition mt-0.5 group"
                  >
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
                      <span>More projects</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                  </Link>
                </div>

                {/* 3. Subcategory: Recommended (AI Sprint Roadmap with 'Try' badge) */}
                <div>
                  <div className="px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    Recommended
                  </div>
                  <Link
                    href="/dashboard/ai-planner"
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition mt-0.5",
                      pathname === "/dashboard/ai-planner"
                        ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0 shadow-2xs">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <span className="truncate font-medium">Create a roadmap</span>
                    </div>
                    {/* Jira-Style 'Try' Badge */}
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                      Try
                    </span>
                  </Link>
                </div>

                {/* 4. Subcategory: Product Strategy & Discovery Tree (Tailored for CoreSync) */}
                <div className="pt-2 border-t border-slate-100">
                  {/* Strategy Project Header with Badge & '...' */}
                  <div className="flex items-center justify-between px-1.5 py-1 rounded-lg hover:bg-slate-50 transition group relative">
                    <Link
                      href="/dashboard/discovery"
                      className="flex items-center gap-2 min-w-0 flex-1"
                      title="Product Strategy Hub"
                    >
                      {/* CoreSync Strategy 3-Color Badge */}
                      <div className="w-5 h-5 rounded-md bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 flex items-center justify-center shadow-xs flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-xs bg-slate-900/40 flex items-center justify-center text-white text-[8px] font-bold">
                          ✦
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#0C66E4]">
                        Product Strategy Hub
                      </span>
                    </Link>

                    <button
                      onClick={() => setIsDiscoveryMenuOpen(!isDiscoveryMenuOpen)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                      title="Strategy options"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>

                    {/* Options Dropdown Popover */}
                    {isDiscoveryMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50">
                        <Link
                          href="/dashboard/discovery?view=initiatives"
                          onClick={() => setIsDiscoveryMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          <IdeaListIcon />
                          <span>Initiative Catalog</span>
                        </Link>
                        <Link
                          href="/dashboard/discovery?view=horizon-roadmap"
                          onClick={() => setIsDiscoveryMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          <span className="text-xs">🚀</span>
                          <span>Horizon Roadmap</span>
                        </Link>
                        <div className="my-1 border-t border-slate-100" />
                        <Link
                          href="/dashboard/discovery"
                          onClick={() => setIsDiscoveryMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#0C66E4] hover:bg-blue-50 font-medium rounded-lg"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Strategy Overview</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Strategy Views Sub-Tree with Original CoreSync Terminology */}
                  <div className="space-y-0.5 mt-1 pl-2.5 ml-2 border-l border-slate-200/60">
                    {/* View 1: Initiative Catalog */}
                    <Link
                      href="/dashboard/discovery?view=initiatives"
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition",
                        pathname === "/dashboard/discovery" && isViewActive("initiatives")
                          ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none -ml-[11px] pl-[8px]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                      title="Initiative Catalog"
                    >
                      <IdeaListIcon />
                      <span className="truncate">Initiative Catalog</span>
                    </Link>

                    {/* View 2: Priority Scoring */}
                    <Link
                      href="/dashboard/discovery?view=priority-scoring"
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition",
                        pathname === "/dashboard/discovery" && isViewActive("priority-scoring")
                          ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none -ml-[11px] pl-[8px]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                      title="Priority Scoring"
                    >
                      <IdeaListIcon />
                      <span className="truncate">Priority Scoring</span>
                    </Link>

                    {/* View 3: Strategic Matrix */}
                    <Link
                      href="/dashboard/discovery?view=strategic-matrix"
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition",
                        pathname === "/dashboard/discovery" && isViewActive("strategic-matrix")
                          ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none -ml-[11px] pl-[8px]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                      title="Strategic Matrix"
                    >
                      <MatrixIcon />
                      <span className="truncate">Strategic Matrix</span>
                    </Link>

                    {/* View 4: Horizon Roadmap (🚀) */}
                    <Link
                      href="/dashboard/discovery?view=horizon-roadmap"
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition",
                        pathname === "/dashboard/discovery" && isViewActive("horizon-roadmap")
                          ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none -ml-[11px] pl-[8px]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                      title="Horizon Roadmap"
                    >
                      <span className="text-sm leading-none flex items-center justify-center flex-shrink-0">
                        🚀
                      </span>
                      <span className="truncate font-medium">Horizon Roadmap</span>
                    </Link>

                    {/* View 5: Milestone Schedule */}
                    <Link
                      href="/dashboard/discovery?view=milestone-schedule"
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition",
                        pathname === "/dashboard/discovery" && isViewActive("milestone-schedule")
                          ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none -ml-[11px] pl-[8px]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                      title="Milestone Schedule"
                    >
                      <TimelineBarsIcon />
                      <span className="truncate">Milestone Schedule</span>
                    </Link>

                    {/* View 6: Active Delivery */}
                    <Link
                      href="/dashboard/discovery?view=active-delivery"
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition",
                        pathname === "/dashboard/discovery" && isViewActive("active-delivery")
                          ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none -ml-[11px] pl-[8px]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                      title="Active Delivery"
                    >
                      <span className="text-sm leading-none flex items-center justify-center flex-shrink-0">
                        ✈️
                      </span>
                      <span className="truncate">Active Delivery</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsed State Icon */}
            {isCollapsed && (
              <div className="space-y-1 mt-2 flex flex-col items-center">
                <Link
                  href="/dashboard/discovery?view=horizon-roadmap"
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-lg text-xs transition",
                    pathname === "/dashboard/discovery"
                      ? "bg-[#EBF3FF] text-[#0C66E4]"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                  title="Product Strategy Hub"
                >
                  <span className="text-sm">🚀</span>
                </Link>
              </div>
            )}
          </div>

          {/* Section C: Views & Approvals */}
          <div className="pt-2 border-t border-slate-100 space-y-0.5">
            {/* My Work (Personal Employee Cockpit) */}
            <Link
              href="/dashboard/my-work"
              className={cn(
                "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition",
                pathname === "/dashboard/my-work"
                  ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-normal"
              )}
              title="My Work & Assigned Deliverables"
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4 text-[#0C66E4] flex-shrink-0" />
                {!isCollapsed && <span className="font-semibold text-slate-800">My Work</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  Assigned
                </span>
              )}
            </Link>

            {/* Filters */}
            <Link
              href="/dashboard/kanban"
              className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
              title="Filters"
            >
              <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
              {!isCollapsed && <span>Filters</span>}
            </Link>

            {/* Dashboards */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
              title="Dashboards"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500 flex-shrink-0" />
              {!isCollapsed && <span>Dashboards</span>}
            </Link>

            {/* Governance & Approval Center */}
            <Link
              href="/dashboard/approvals"
              className={cn(
                "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition",
                pathname === "/dashboard/approvals"
                  ? "bg-[#EBF3FF] text-[#0C66E4] font-semibold border-l-[3px] border-[#0C66E4] rounded-l-none"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-normal"
              )}
              title="Approval Center"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-slate-500 flex-shrink-0" />
                {!isCollapsed && <span>Approvals</span>}
              </div>
              {!isCollapsed && pendingApprovalsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {pendingApprovalsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Section D: External Assets & Teams */}
          <div className="pt-2 border-t border-slate-100 space-y-0.5">
            {/* Assets & Security Policies */}
            <Link
              href="/dashboard/settings"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition group"
              title="Assets & Security"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-slate-500 flex-shrink-0" />
                {!isCollapsed && <span>Assets</span>}
              </div>
              {!isCollapsed && (
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              )}
            </Link>

            {/* Teams */}
            <Link
              href="/dashboard/teams"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition group"
              title="Teams"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
                {!isCollapsed && <span>Teams</span>}
              </div>
              {!isCollapsed && (
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              )}
            </Link>
          </div>

        </div>

        {/* 4. User Footer Profile with Instant Direct Sign Out */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/70 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate leading-tight">
                  {userName}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {userEmail}
                </p>
              </div>
            )}
          </div>

          <SignOutButton variant="sidebar" />
        </div>
      </aside>

      {/* 5. Create Project Modal (Triggered by '+' next to Projects) */}
      {isCreateProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-[#0C66E4]" />
                <h3 className="text-base font-bold text-slate-900">Create New Project</h3>
              </div>
              <button
                onClick={() => setIsCreateProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Billing System Development"
                  value={newProjectName}
                  onChange={(e) => handleProjectNameChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Key (Prefix)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. BILL"
                  value={newProjectKey}
                  onChange={(e) => setNewProjectKey(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of the project scope..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              {projectError && (
                <p className="text-rose-600 text-[11px] font-medium">{projectError}</p>
              )}

              <div className="bg-blue-50 border border-blue-100/80 rounded-xl p-2.5 flex items-center gap-2 text-blue-700 text-[11px]">
                <Mail className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                <span>Executive onboarding confirmation & board link will be delivered to your Gmail inbox.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProject || !newProjectName.trim() || !newProjectKey.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0C66E4] hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isSubmittingProject ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Create Workspace Modal */}
      {isCreateOrgModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0C66E4]" />
                <h3 className="text-base font-bold text-slate-900">Create New Workspace</h3>
              </div>
              <button
                onClick={() => setIsCreateOrgModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company / Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Security Systems"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Industry Domain</label>
                <select
                  value={newOrgIndustry}
                  onChange={(e) => setNewOrgIndustry(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option>Technology & Software</option>
                  <option>Fintech & Banking</option>
                  <option>Healthcare & Life Sciences</option>
                  <option>Cybersecurity & Defense</option>
                  <option>E-Commerce & Retail</option>
                </select>
              </div>

              {orgError && (
                <p className="text-rose-600 text-[11px] font-medium">{orgError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOrgModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrg || !newOrgName.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0C66E4] hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isSubmittingOrg ? "Creating..." : "Create Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
