"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentOrgName?: string;
  userEmail?: string;
}

export function Sidebar({
  currentOrgName = "Acme Technologies",
  userEmail = "user@acme.com",
}: SidebarProps) {
  const pathname = usePathname();

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
    <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-[#0A0B0E] flex flex-col h-screen select-none">
      {/* 1. Organization & Workspace Switcher */}
      <div className="p-4 border-b border-white/5">
        <button className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition text-left">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {currentOrgName}
              </p>
              <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider">
                Enterprise Plan
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
        </button>
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
                  ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-indigo-400"
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
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
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
      <div className="p-3 mx-3 mb-3 rounded-lg border border-indigo-500/20 bg-indigo-950/20 text-xs">
        <div className="flex items-center gap-2 mb-1.5 text-indigo-300 font-medium">
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Governance Guard</span>
        </div>
        <p className="text-[11px] text-neutral-400 leading-snug">
          Multi-tenant policy active. Autonomous mutations require manager sign-off.
        </p>
      </div>

      {/* 4. User Footer Profile */}
      <div className="p-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-medium text-neutral-300">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">{userEmail}</p>
            <p className="text-[10px] text-neutral-500 truncate">Workspace Owner</p>
          </div>
        </div>
        <Link
          href="/api/auth/signout"
          className="text-[11px] text-neutral-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-white/5 transition"
        >
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
