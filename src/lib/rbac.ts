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

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: [
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
  ],
  ADMIN: [
    "members:manage",
    "members:invite",
    "ai:approve",
    "projects:create",
    "projects:delete",
    "tasks:create",
    "tasks:edit",
    "tasks:delete",
    "tasks:view",
  ],
  MANAGER: [
    "ai:approve",
    "projects:create",
    "tasks:create",
    "tasks:edit",
    "tasks:view",
  ],
  MEMBER: [
    "tasks:create",
    "tasks:edit",
    "tasks:view",
  ],
  VIEWER: [
    "tasks:view",
  ],
  AI_AGENT: [
    "tasks:view",
  ],
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  OWNER: "Full control over organization, billing, subscriptions, and all data.",
  ADMIN: "Can manage team members, role assignments, and all projects.",
  MANAGER: "Can create projects, assign sprint issues, and authorize AI agent proposals.",
  MEMBER: "Standard engineering access to create, update, and complete tasks.",
  VIEWER: "Read-only access to sprint boards, telemetry, and discovery matrices.",
  AI_AGENT: "Autonomous agent sandbox with read-only access (mutations require manager approval).",
};

/**
 * Check whether a given role holds a specific permission.
 */
export function hasPermission(role: Role | string | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const normalizedRole = role.toUpperCase() as Role;
  const permissions = ROLE_PERMISSIONS[normalizedRole];
  return permissions ? permissions.includes(permission) : false;
}

/**
 * Enforce that a role holds a permission; throws error if forbidden.
 */
export function requirePermission(role: Role | string | undefined | null, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Forbidden: Role '${role || "ANONYMOUS"}' lacks required permission '${permission}'.`);
  }
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
