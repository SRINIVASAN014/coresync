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
      <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-[#0A0B0E] flex flex-col h-screen select-none relative z-30">
        {/* 1. Organization & Multi-Company Workspace Switcher */}
        <div className="p-3 border-b border-white/5 relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] flex-shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight group-hover:text-blue-300 transition-colors">
                  {currentOrgName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono uppercase tracking-wider font-semibold">
                    {userRole}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Enterprise
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-200",
                isOrgDropdownOpen && "rotate-180 text-white"
              )}
            />
          </button>

          {/* Switcher Dropdown Popover */}
          {isOrgDropdownOpen && (
            <div className="absolute top-full left-3 right-3 mt-1.5 bg-[#0F1015] border border-white/10 rounded-xl p-2 shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50">
              <div className="px-2 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
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
                          ? "bg-[#3B82F6]/15 text-blue-300 font-semibold border border-[#3B82F6]/30"
                          : "text-neutral-300 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-neutral-300 flex-shrink-0">
                          {org.name.charAt(0)}
                        </div>
                        <span className="truncate">{org.name}</span>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5 text-[#3B82F6] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1.5 border-t border-white/5 mt-1">
                <button
                  onClick={() => {
                    setIsOrgDropdownOpen(false);
                    setIsCreateOrgModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition cursor-pointer"
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
          <div className="px-3 pb-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
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
                    ? "bg-[#3B82F6]/15 text-blue-300 border border-[#3B82F6]/30 font-semibold shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-[#3B82F6]"
                        : "text-neutral-500 group-hover:text-neutral-300"
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                      item.badge === "AI"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
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
        <div className="p-3 mx-3 mb-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20 text-xs">
          <div className="flex items-center gap-2 mb-1.5 text-indigo-300 font-medium">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Governance Guard</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-snug">
            Multi-tenant boundary active. Autonomous AI actions require authorized approval.
          </p>
        </div>

        {/* 4. User Footer Profile */}
        <div className="p-3 border-t border-white/5 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{userName}</p>
              <p className="text-[10px] text-neutral-400 truncate">{userEmail}</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            title="Sign out"
            className="text-neutral-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* 5. Create Organization Modal */}
      {isCreateOrgModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F1015] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#3B82F6]" />
                <h3 className="text-base font-bold text-white">Create New Workspace</h3>
              </div>
              <button
                onClick={() => setIsCreateOrgModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orgError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {orgError}
              </div>
            )}

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Workspace / Company Name
                </label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. NextGen Aerospace"
                  className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  value={newOrgIndustry}
                  onChange={(e) => setNewOrgIndustry(e.target.value)}
                  placeholder="e.g. Autonomous Defense & AI"
                  className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOrgModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrg || !newOrgName.trim()}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
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
