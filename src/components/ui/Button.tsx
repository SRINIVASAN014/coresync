import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "ai";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080808] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-white text-black hover:bg-neutral-200 focus:ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.07)]",
      secondary:
        "bg-[#1A1C20] text-neutral-200 hover:bg-[#25282E] hover:text-white border border-white/10 focus:ring-indigo-500/30",
      outline:
        "border border-white/15 text-neutral-300 hover:bg-white/5 hover:text-white focus:ring-white/10",
      ghost:
        "text-neutral-400 hover:text-white hover:bg-white/5 focus:ring-white/10",
      danger:
        "bg-red-600/90 text-white hover:bg-red-600 focus:ring-red-500/40 border border-red-500/30",
      ai: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 shadow-[0_0_20px_rgba(99,102,241,0.35)] border border-indigo-400/30",
    };

    const sizes = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5 h-8",
      md: "text-sm px-4 py-2 gap-2 h-10",
      lg: "text-base px-6 py-2.5 gap-2.5 h-12",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
