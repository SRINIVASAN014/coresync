"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Shield, ArrowRight, Lock, Mail, Building2, User, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !companyName) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          companyName: companyName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create workspace.");
      }

      setSuccess(true);

      // Auto sign in with credentials
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
        callbackUrl: "/dashboard",
      });

      if (signInRes?.error) {
        // If signIn fails, redirect to login
        router.push("/login?message=Account created. Please sign in.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-center items-center px-4 relative selection:bg-[#3B82F6]/30 font-sans py-12">
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
            Create New Enterprise Workspace
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Workspace created! Provisioning your environment...</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Connor"
                className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Company or Workspace Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Robotics"
                className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              Your company will receive dedicated mathematical data isolation.
            </p>
          </div>

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
                placeholder="sarah@acme.com"
                className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
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
            className="w-full mt-3 bg-[#3B82F6] hover:bg-blue-600 active:scale-[0.99] text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Setting up workspace...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Launch My Workspace <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="mt-6 text-center text-xs text-[#8A8F98]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#3B82F6] hover:text-blue-400 font-medium underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
