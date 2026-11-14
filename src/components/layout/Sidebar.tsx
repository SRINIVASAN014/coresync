"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  KanbanSquare,
  Sparkles,
  ShieldCheck,
  Users,
  Settings,
  Building2,
  ChevronDown,
  Bot,
  Plus,
  Check,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { switchActiveOrganization, createOrganization } from "@/app/actions/work";

interface OrgItem {
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
}

export function Sidebar({
  currentOrgName = "Global CyberTech Solutions",
  currentOrgSlug = "cybertech-global",
  userEmail = "admin@cybertech.com",
  userName = "Enterprise User",
  userRole = "OWNER",
  organizations = [],
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = React.useState(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = React.useState(false);
  const [newOrgName, setNewOrgName] = React.useState("");
  const [newOrgIndustry, setNewOrgIndustry] = React.useState("Technology & Software");
  const [isSubmittingOrg, setIsSubmittingOrg] = React.useState(false);
  const [orgError, setOrgError] = React.useState("");

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Deduplicate organizations defensively so React keys are always unique
  const uniqueOrganizations = React.useMemo(() => {
    const map = new Map<string, OrgItem>();
    organizations.forEach((org, idx) => {
      const key = org.id || `org-${idx}`;
      if (!map.has(key)) {
        map.set(key, org);
      }
    });
    return Array.from(map.values());
  }, [organizations]);

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

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Kanban Board", href: "/dashboard/kanban", icon: KanbanSquare },
    { name: "AI Project Planner", href: "/dashboard/ai-planner", icon: Sparkles, badge: "AI" },
    { name: "Approval Center", href: "/dashboard/approvals", icon: ShieldCheck, badge: "3" },
    { name: "Teams & Members", href: "/dashboard/teams", icon: Users },
    { name: "Workspace Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col h-screen select-none relative z-30">
        {/* 1. Organization & Multi-Company Workspace Switcher */}
        <div className="p-3 border-b border-slate-200 relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-500/25 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
                  {currentOrgName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono uppercase tracking-wider font-semibold">
                    {userRole}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Enterprise
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200",
                isOrgDropdownOpen && "rotate-180 text-slate-700"
              )}
            />
          </button>

          {/* Switcher Dropdown Popover */}
          {isOrgDropdownOpen && (
            <div className="absolute top-full left-3 right-3 mt-1.5 bg-white border border-slate-200 rounded-xl p-2 shadow-xl backdrop-blur-xl z-50">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Workspaces ({uniqueOrganizations.length || 1})
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1 my-1">
                {uniqueOrganizations.map((org, index) => {
                  const isActive = org.name === currentOrgName;
                  return (
                    <button
                      key={org.id ? `${org.id}-${index}` : `workspace-${index}`}
                      onClick={() => handleSwitchOrg(org.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition cursor-pointer",
                        isActive
                          ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 flex-shrink-0">
                          {org.name.charAt(0)}
                        </div>
                        <span className="truncate">{org.name}</span>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1.5 border-t border-slate-100 mt-1">
                <button
                  onClick={() => {
                    setIsOrgDropdownOpen(false);
                    setIsCreateOrgModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>

          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-blue-50 text-blue-600 border border-blue-200 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-blue-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                      item.badge === "AI"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* 3. AI Agent Status & Governance Widget */}
        <div className="p-3 mx-3 mb-3 rounded-xl border border-blue-100 bg-blue-50/70 text-xs">
          <div className="flex items-center gap-2 mb-1.5 text-blue-700 font-semibold">
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Governance Guard</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            Multi-tenant boundary active. Autonomous AI actions require authorized approval.
          </p>
        </div>

        {/* 4. User Footer Profile */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{userName}</p>
              <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            title="Sign out"
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* 5. Create Organization Modal */}
      {isCreateOrgModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Create New Workspace</h3>
              </div>
              <button
                onClick={() => setIsCreateOrgModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orgError && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600">
                {orgError}
              </div>
            )}

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Workspace / Company Name
                </label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. NextGen Aerospace"
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  value={newOrgIndustry}
                  onChange={(e) => setNewOrgIndustry(e.target.value)}
                  placeholder="e.g. Autonomous Defense & AI"
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOrgModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrg || !newOrgName.trim()}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmittingOrg ? "Provisioning..." : "Create Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
