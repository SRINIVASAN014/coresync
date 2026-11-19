"use client";

import * as React from "react";
import {
  Mail,
  UserPlus,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Info,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Role } from "@prisma/client";
import { updateMemberRole, inviteMember } from "@/app/actions/work";
import { ROLE_DESCRIPTIONS, hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

interface TeamsClientProps {
  initialMembers: any[];
  currentUserId: string;
  currentUserRole: Role | string;
  orgName: string;
}

const AVAILABLE_ROLES: { role: Role; label: string }[] = [
  { role: Role.OWNER, label: "Owner — Full control & billing" },
  { role: Role.ADMIN, label: "Admin — Manage directory & projects" },
  { role: Role.MANAGER, label: "Manager — Projects & AI approvals" },
  { role: Role.MEMBER, label: "Member — Standard engineering access" },
  { role: Role.VIEWER, label: "Viewer — Read-only telemetry access" },
];

export function TeamsClient({
  initialMembers,
  currentUserId,
  currentUserRole,
  orgName,
}: TeamsClientProps) {
  const [members, setMembers] = React.useState(initialMembers);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals state
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteName, setInviteName] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<Role>(Role.MEMBER);
  const [isInviting, setIsInviting] = React.useState(false);

  const [inspectingRole, setInspectingRole] = React.useState<Role | null>(null);

  const canManageMembers = hasPermission(currentUserRole, "members:manage");
  const canInviteMembers = hasPermission(currentUserRole, "members:invite");

  // Handle changing a member's role
  const handleRoleChange = async (memberId: string, newRole: Role) => {
    setUpdatingId(memberId);
    setNotification(null);
    try {
      const res = await updateMemberRole(memberId, newRole);
      if (res.success && res.member) {
        setMembers((prev) =>
          prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
        );
        setNotification({
          type: "success",
          message: `Role successfully updated to ${newRole}.`,
        });
      } else {
        setNotification({
          type: "error",
          message: res.error || "Failed to update member role.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Network error updating role.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle inviting a new member
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    setNotification(null);
    try {
      const res = await inviteMember({
        email: inviteEmail.trim(),
        name: inviteName.trim() || undefined,
        role: inviteRole,
      });

      if (res.success && res.member) {
        setMembers((prev) => [...prev, res.member]);
        setIsInviteOpen(false);
        setInviteEmail("");
        setInviteName("");
        setInviteRole(Role.MEMBER);
        setNotification({
          type: "success",
          message: `Successfully added ${res.member.user?.email} as ${res.member.role}.`,
        });
      } else {
        setNotification({
          type: "error",
          message: res.error || "Failed to invite member.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to invite member.",
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Organization Directory & Teams
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Team directory, organizational access, and workspace governance for{" "}
            <span className="font-semibold text-slate-700">{orgName}</span>
          </p>
        </div>

        {canInviteMembers && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsInviteOpen(true)}
            className="self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            <span>Invite Member</span>
          </Button>
        )}
      </div>

      {/* 2. Feedback Notification Alert */}
      {notification && (
        <div
          className={cn(
            "p-3 rounded-lg border text-xs flex items-center justify-between animate-in fade-in duration-200",
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          )}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-700 ml-4 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Organization Members List with Interactive Role Assignment */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <CardTitle>Organization Workforce ({members.length})</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Active enterprise accounts provisioned with strict tenant isolation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">Your Access:</span>
            <RoleBadge role={currentUserRole} />
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="divide-y divide-slate-100">
            {members.map((member) => {
              const isCurrentUser = member.user?.id === currentUserId;
              const isOwner = member.role === Role.OWNER;
              const canEditThisMember = canManageMembers && (!isCurrentUser || !isOwner);

              return (
                <div
                  key={member.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 px-2.5 rounded-lg transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200 flex items-center justify-center text-xs shadow-2xs shrink-0">
                      {member.user?.name ? member.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {member.user?.name || "Team Member"}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 font-mono truncate mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{member.user?.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    {/* Role Dropdown (If Manager/Admin) or Static Badge */}
                    {canEditThisMember ? (
                      <div className="flex items-center gap-1.5">
                        <div className="relative inline-flex items-center">
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value as Role)}
                            disabled={updatingId === member.id}
                            className={cn(
                              "h-8 text-xs font-semibold rounded-md pl-2.5 pr-7 py-1 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition appearance-none border",
                              member.role === Role.OWNER
                                ? "bg-purple-50/80 border-purple-200 text-purple-700 hover:border-purple-300"
                                : member.role === Role.ADMIN
                                ? "bg-blue-50/80 border-blue-200 text-blue-700 hover:border-blue-300"
                                : member.role === Role.MANAGER
                                ? "bg-emerald-50/80 border-emerald-200 text-emerald-700 hover:border-emerald-300"
                                : member.role === Role.VIEWER
                                ? "bg-zinc-100/80 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                                : "bg-slate-100/80 border-slate-200 text-slate-700 hover:border-slate-300"
                            )}
                          >
                            {AVAILABLE_ROLES.map((r) => (
                              <option key={r.role} value={r.role} className="bg-white text-slate-900 font-normal">
                                {r.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
                        </div>
                        {updatingId === member.id && (
                          <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                        )}
                      </div>
                    ) : (
                      <RoleBadge role={member.role} />
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInspectingRole(member.role)}
                      className="h-8 text-xs border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs"
                    >
                      <Shield className="w-3 h-3 mr-1 text-slate-500" />
                      <span>Permissions</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 4. Invite Employee Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Provision Organization Member</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Corporate Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="engineer@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Team Role *
                  </label>
                  <RoleBadge role={inviteRole} size="sm" />
                </div>
                <div className="relative">
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Role)}
                    className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none"
                  >
                    <option value={Role.ADMIN}>Admin — Manage directory & projects</option>
                    <option value={Role.MANAGER}>Manager — Projects & AI approvals</option>
                    <option value={Role.MEMBER}>Member — Standard engineering access</option>
                    <option value={Role.VIEWER}>Viewer — Read-only telemetry access</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  {ROLE_DESCRIPTIONS[inviteRole]}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isInviting || !inviteEmail.trim()}
                >
                  {isInviting && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                  <span>Add to Workspace</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Permission Details Inspector Modal */}
      {inspectingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RoleBadge role={inspectingRole} />
                <h3 className="text-sm font-bold text-slate-900">
                  Role Permissions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingRole(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {ROLE_DESCRIPTIONS[inspectingRole]}
            </p>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectingRole(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
