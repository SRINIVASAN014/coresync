"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Shield, ArrowRight, Lock, Mail, Sparkles, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </React.Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword("EnterpriseDemo2026!");
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: quickEmail,
        password: "EnterpriseDemo2026!",
        callbackUrl,
      });

      if (res?.error) {
        setError("Quick login failed: " + res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError("Quick login error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-center items-center px-4 relative selection:bg-[#3B82F6]/30 font-sans">
      {/* Background Soft Violet & Blue Ambient Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-violet-600/20 via-[#8B5CF6]/18 to-[#3B82F6]/15 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0F1015]/90 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <span className="text-3xl font-extrabold tracking-tight">
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Core</span>
              <span className="text-[#3B82F6] drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:text-blue-400 transition-colors">Sync</span>
            </span>
          </Link>
          <p className="text-xs text-[#8A8F98] uppercase tracking-wider font-semibold">
            Enterprise Work & AI Governance Platform
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-300">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#3B82F6] hover:bg-blue-600 active:scale-[0.99] text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Sign in to Workspace <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> 1-Click Demo Profiles
            </span>
            <span className="text-[10px] text-neutral-500">Preset credentials</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@cybertech.com")}
              className="w-full p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold">
                  SS
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate group-hover:text-indigo-300">
                    Srinivasan Sathurappan
                  </p>
                  <p className="text-[10px] text-neutral-400">admin@cybertech.com</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold uppercase">
                Owner
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("alex.mercer@cybertech.com")}
              className="w-full p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold">
                  AM
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate group-hover:text-blue-300">
                    Alex Mercer
                  </p>
                  <p className="text-[10px] text-neutral-400">alex.mercer@cybertech.com</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold uppercase">
                Manager
              </span>
            </button>
          </div>
        </div>

        {/* Link to Register */}
        <div className="mt-6 text-center text-xs text-[#8A8F98]">
          Don&apos;t have an enterprise account?{" "}
          <Link href="/register" className="text-[#3B82F6] hover:text-blue-400 font-medium underline underline-offset-4">
            Create workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
