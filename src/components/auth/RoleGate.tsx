"use client";

import * as React from "react";
import { Role } from "@prisma/client";
import { hasPermission, Permission } from "@/lib/rbac";

export interface RoleGateProps {
  role?: Role | string | null;
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders children if the active role possesses the required permission.
 */
export function RoleGate({
  role,
  permission,
  children,
  fallback = null,
}: RoleGateProps) {
  if (!role || !hasPermission(role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
