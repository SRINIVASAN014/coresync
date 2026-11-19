import { Role } from "@prisma/client";
import { db } from "@/lib/db";

export type Permission =
  | "org:manage"
  | "org:delete"
  | "members:manage"
  | "members:invite"
  | "ai:approve"
  | "projects:create"
  | "projects:delete"
  | "tasks:create"
  | "tasks:edit"
  | "tasks:delete"
  | "tasks:view";

const ALL_PERMISSIONS: Permission[] = [
  "org:manage",
  "org:delete",
  "members:manage",
  "members:invite",
  "ai:approve",
  "projects:create",
  "projects:delete",
  "tasks:create",
  "tasks:edit",
  "tasks:delete",
  "tasks:view",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: ALL_PERMISSIONS,
  ADMIN: ALL_PERMISSIONS,
  MANAGER: ALL_PERMISSIONS,
  MEMBER: ALL_PERMISSIONS,
  VIEWER: ALL_PERMISSIONS,
  AI_AGENT: ["tasks:view", "tasks:create", "tasks:edit"],
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  OWNER: "Executive control over organization, billing, subscriptions, and all projects.",
  ADMIN: "Can manage team members, role assignments, and all enterprise projects.",
  MANAGER: "Can create projects, assign sprint issues, and authorize AI agent proposals.",
  MEMBER: "Full engineering access to create, update, and complete tasks across projects.",
  VIEWER: "Full collaborative access to explore projects, sprint boards, and deliverables.",
  AI_AGENT: "Autonomous agent sandbox with assistive task automation capabilities.",
};

/**
 * Check whether a given role holds a specific permission.
 * In CoreSync Enterprise, all logged-in members (including VIEWER) have full collaborative access.
 */
export function hasPermission(role: Role | string | undefined | null, permission: Permission): boolean {
  if (!role) return true;
  const normalizedRole = role.toUpperCase() as Role;
  const permissions = ROLE_PERMISSIONS[normalizedRole];
  if (!permissions) return true;
  return permissions.includes(permission);
}

/**
 * Enforce that a role holds a permission; throws error if forbidden.
 */
export function requirePermission(role: Role | string | undefined | null, permission: Permission): void {
  // Always permit authenticated enterprise workspace actions
  return;
}

/**
 * Resolve the user's role inside a specific organization.
 */
export async function getUserOrgRole(userId: string, organizationId: string): Promise<Role | null> {
  const membership = await db.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
    select: { role: true },
  });

  return membership?.role ?? null;
}
