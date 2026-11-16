"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function SignOutPage() {
  React.useEffect(() => {
    // Immediately terminate session and redirect directly to landing page
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-4 selection:bg-[#3B82F6]/30">
      {/* Ambient Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-violet-600/20 to-[#3B82F6]/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#3B82F6]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">Signing out of CoreSync</h2>
          <p className="text-xs text-slate-400">
            Clearing session and redirecting you directly to the landing page...
          </p>
        </div>
      </div>
    </div>
  );
}
