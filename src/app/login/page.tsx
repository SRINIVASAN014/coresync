"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Building2,
} from "lucide-react";

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#080808] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}

// Official 4-Color Google "G" Icon
function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");

  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailLoading, setEmailLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showEmailLogin, setShowEmailLogin] = React.useState(false);

  React.useEffect(() => {
    if (urlError) {
      if (urlError === "OAuthCallback" || urlError === "OAuthSignin") {
        setError("Google authentication could not be completed. Please try again.");
      } else if (urlError === "AccessDenied") {
        setError("Access was denied. Please grant permission to sign in.");
      } else {
        setError("Authentication error: " + urlError);
      }
    }
  }, [urlError]);

  // 1-Click Professional Google / Gmail Sign In
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl });
    } catch (err: any) {
      setError(err?.message || "Failed to initiate Google sign in.");
      setGoogleLoading(false);
    }
  };

  // Optional Email / Password Fallback
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setEmailLoading(true);
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
      setEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-center items-center px-4 relative selection:bg-[#3B82F6]/30 font-sans">
      {/* Background Soft Violet & Blue Ambient Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-violet-600/20 via-[#8B5CF6]/18 to-[#3B82F6]/15 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0F1015]/95 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <span className="text-3xl font-extrabold tracking-tight">
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Core</span>
              <span className="text-[#3B82F6] drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:text-blue-400 transition-colors">
                Sync
              </span>
            </span>
          </Link>
          <p className="text-xs text-[#8A8F98] uppercase tracking-wider font-semibold">
            Enterprise Work & AI Governance Platform
          </p>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Sign in to CoreSync
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Continue with your Google or Gmail account to access your workspace.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Action: Professional Sign in with Google / Gmail */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-900 font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-3 text-sm shadow-[0_4px_20px_rgba(255,255,255,0.12)] disabled:opacity-60 cursor-pointer group"
          >
            {googleLoading ? (
              <span className="flex items-center gap-2 text-slate-700">
                <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
                Connecting to Google...
              </span>
            ) : (
              <>
                <GoogleIcon className="w-5 h-5 flex-shrink-0 group-hover:scale-105 transition-transform" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Security & Multi-Tenant Assurance */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2.5 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Encrypted OAuth 2.0 authentication & automatic tenant routing</span>
          </div>
        </div>

        {/* Secondary: Collapsible Work Email Option */}
        <div className="mt-6 pt-5 border-t border-white/5">
          {!showEmailLogin ? (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowEmailLogin(true)}
                className="text-xs text-neutral-400 hover:text-white transition inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Or sign in with work email</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5 mt-2">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
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
                    className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={emailLoading}
                className="w-full bg-[#3B82F6] hover:bg-blue-600 active:scale-[0.99] text-white font-medium py-2 px-3 rounded-lg transition flex items-center justify-center gap-2 text-xs shadow-[0_0_15px_rgba(59,130,246,0.25)] disabled:opacity-50 cursor-pointer"
              >
                {emailLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span>Sign in with Email &rarr;</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Link to Register */}
        <div className="mt-6 text-center text-xs text-[#8A8F98]">
          Don&apos;t have an enterprise account?{" "}
          <Link
            href="/register"
            className="text-[#3B82F6] hover:text-blue-400 font-medium underline underline-offset-4"
          >
            Create workspace
          </Link>
        </div>

      </div>
    </div>
  );
}
