import * as React from "react";
import { Role } from "@prisma/client";
import { Crown, ShieldCheck, Briefcase, User, Eye, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  role: Role | string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function RoleBadge({
  role,
  size = "md",
  showIcon = true,
  className,
  ...props
}: RoleBadgeProps) {
  const normalizedRole = (role || "MEMBER").toUpperCase();

  const config = React.useMemo(() => {
    switch (normalizedRole) {
      case "OWNER":
        return {
          label: "OWNER",
          icon: Crown,
          style: "bg-purple-50/90 text-purple-700 border-purple-200/90 font-bold",
          iconColor: "text-purple-600",
        };
      case "ADMIN":
        return {
          label: "ADMIN",
          icon: ShieldCheck,
          style: "bg-blue-50/90 text-blue-700 border-blue-200/90 font-semibold",
          iconColor: "text-blue-600",
        };
      case "MANAGER":
        return {
          label: "MANAGER",
          icon: Briefcase,
          style: "bg-emerald-50/90 text-emerald-700 border-emerald-200/90 font-semibold",
          iconColor: "text-emerald-600",
        };
      case "VIEWER":
        return {
          label: "VIEWER",
          icon: Eye,
          style: "bg-zinc-100/80 text-zinc-600 border-zinc-200/90 font-medium",
          iconColor: "text-zinc-500",
        };
      case "AI_AGENT":
        return {
          label: "AI AGENT",
          icon: Bot,
          style: "bg-indigo-50/90 text-indigo-700 border-indigo-200/90 font-semibold",
          iconColor: "text-indigo-600",
        };
      case "MEMBER":
      default:
        return {
          label: "MEMBER",
          icon: User,
          style: "bg-slate-100/80 text-slate-700 border-slate-200/90 font-medium",
          iconColor: "text-slate-500",
        };
    }
  }, [normalizedRole]);

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border tracking-wider select-none shadow-2xs font-mono",
        size === "sm" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5",
        config.style,
        className
      )}
      {...props}
    >
      {showIcon && <Icon className={cn("shrink-0", size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3", config.iconColor)} />}
      <span>{config.label}</span>
    </span>
  );
}
