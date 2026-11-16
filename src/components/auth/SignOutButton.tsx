"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  className?: string;
  variant?: "nav" | "sidebar";
  children?: React.ReactNode;
}

export function SignOutButton({
  className,
  variant = "nav",
  children,
}: SignOutButtonProps) {
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        title="Sign out"
        className={cn(
          "text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition flex-shrink-0 cursor-pointer disabled:opacity-50",
          className
        )}
      >
        {isSigningOut ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
        ) : (
          <LogOut className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={cn(
        "text-xs font-medium text-neutral-400 hover:text-rose-400 px-3 py-1.5 rounded-full border border-white/5 hover:border-rose-500/20 hover:bg-rose-500/5 transition ml-1 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5",
        className
      )}
    >
      {isSigningOut ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-neutral-400" />
          <span>Signing out...</span>
        </>
      ) : (
        children || "Sign Out"
      )}
    </button>
  );
}
