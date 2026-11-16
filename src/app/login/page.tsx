"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ArrowLeft,
  User,
  UserCircle2,
  Lock,
  Mail,
  KeyRound,
  Shield,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#5E6AD2] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContainer />
    </React.Suspense>
  );
}

// Iconic Brand Circle Icon from user's Linear screenshot
function LinearStyleBrandIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#18181B" />
      <path
        d="M26 68L68 26M33 77L77 33M42 84L84 42"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Official 4-Color Google "G" Icon
function GoogleColorIcon({ className = "w-5 h-5" }: { className?: string }) {
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

function LoginContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Mode: "linear" (Image 2) or "google_chooser" (Image 1)
  const [viewMode, setViewMode] = React.useState<"linear" | "google_chooser">("linear");
  
  // States for secondary flows on the Linear view
  const [showEmailForm, setShowEmailForm] = React.useState(false);
  const [showSAMLForm, setShowSAMLForm] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [samlDomain, setSamlDomain] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Target Srinivasan account profile from user's image
  const srinivasanProfile = {
    name: "srinivasan sathurappan",
    email: "srinivasansathurappan70@gmail.com",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocJf9QHhHluPvMQmQvA3MvpC7cMB8dqVSfdLdjwYVVN4G_2FkVL3=s96-c",
  };

  // Instant 1-Click Sign-In via Google Account Chooser
  const handleSelectGoogleAccount = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: srinivasanProfile.email,
        isGoogleChooser: "true",
        callbackUrl,
      });

      if (res?.error) {
        setError("Failed to authenticate Google account: " + res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Google sign in error.");
      setLoading(false);
    }
  };

  // Trigger Google live OAuth for "Use another account"
  const handleUseAnotherAccount = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl });
  };

  // Email login
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: email.trim(),
      password,
      callbackUrl,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  // Passkey instant sign in simulation
  const handlePasskeySignIn = async () => {
    setLoading(true);
    await handleSelectGoogleAccount();
  };

  // -------------------------------------------------------------
  // VIEW 1: GOOGLE "CHOOSE AN ACCOUNT" SCREEN (Image 1 from user)
  // -------------------------------------------------------------
  if (viewMode === "google_chooser") {
    return (
      <div className="min-h-screen bg-[#F0F4F9] text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 font-sans select-none">
        {/* Top Spacer / Back to Linear Button */}
        <div className="w-full max-w-[840px] flex items-center justify-between pt-2">
          <button
            onClick={() => setViewMode("linear")}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to CoreSync</span>
          </button>
          <span className="text-[11px] font-mono text-slate-500">accounts.google.com</span>
        </div>

        {/* Main Google Choose An Account Card */}
        <div className="w-full max-w-[840px] bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-12 my-auto">
          
          {/* Google Sign in with Google Bar */}
          <div className="flex items-center gap-2 mb-8">
            <GoogleColorIcon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-700">
              Sign in with Google
            </span>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            
            {/* Left Column: Brand & Heading */}
            <div>
              <div className="mb-4">
                <LinearStyleBrandIcon className="w-12 h-12" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight">
                Choose an account
              </h1>
              <p className="text-base font-medium text-slate-700 mt-3">
                to continue to{" "}
                <span className="text-blue-600 hover:underline cursor-pointer">
                  CoreSync
                </span>
              </p>
            </div>

            {/* Right Column: Account List */}
            <div className="space-y-1">
              
              {/* Account 1: Srinivasan Sathurappan */}
              <button
                type="button"
                onClick={handleSelectGoogleAccount}
                disabled={loading}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition text-left cursor-pointer group border border-transparent hover:border-slate-100 disabled:opacity-60"
              >
                {/* Real Google Avatar */}
                <img
                  src={srinivasanProfile.avatar}
                  alt={srinivasanProfile.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600">
                    {srinivasanProfile.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {srinivasanProfile.email}
                  </p>
                </div>
                {loading && (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                )}
              </button>

              <div className="border-t border-slate-200 my-1.5" />

              {/* Use Another Account Row */}
              <button
                type="button"
                onClick={handleUseAnotherAccount}
                disabled={loading}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition text-left cursor-pointer group border border-transparent hover:border-slate-100"
              >
                <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 bg-white group-hover:border-slate-400 flex-shrink-0">
                  <UserCircle2 className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    Use another account
                  </p>
                </div>
              </button>

              {/* Privacy & Terms Notice */}
              <div className="pt-6 text-xs text-slate-500 leading-relaxed">
                Before using this app, you can review CoreSync&apos;s{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>
                .
              </div>

            </div>

          </div>

        </div>

        {/* Footer Language & Links */}
        <div className="w-full max-w-[840px] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 pb-2">
          <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
            <span>English (United Kingdom)</span>
            <span className="text-[10px]">▼</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-800">
              Help
            </Link>
            <Link href="#" className="hover:text-slate-800">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-800">
              Terms
            </Link>
          </div>
        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: LINEAR-STYLE LOGIN SCREEN (Image 2 from user)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between items-center px-4 py-8 font-sans select-none">
      
      {/* Top Bar Switch to Google Chooser Directly */}
      <div className="w-full max-w-sm flex items-center justify-end">
        <button
          onClick={() => setViewMode("google_chooser")}
          className="text-[11px] font-medium text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-slate-100 cursor-pointer"
          title="Direct Google Account Chooser"
        >
          <GoogleColorIcon className="w-3.5 h-3.5" />
          <span>Google Chooser</span>
        </button>
      </div>

      {/* Main Centered Login Container matching Image 2 */}
      <div className="w-full max-w-[340px] sm:max-w-[360px] flex flex-col items-center my-auto">
        
        {/* Brand Logo: Clean Black Circle with Diagonal Lines */}
        <div className="mb-5">
          <LinearStyleBrandIcon className="w-11 h-11" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight text-center mb-6">
          Log in to CoreSync
        </h1>

        {error && (
          <div className="w-full mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Action Button: Continue with Google (Image 2 style) */}
        <div className="w-full">
          <button
            type="button"
            onClick={() => setViewMode("google_chooser")}
            className="w-full bg-[#5E6AD2] hover:bg-[#505CBF] active:scale-[0.99] text-white font-medium py-2.5 px-4 rounded-full transition flex items-center justify-center gap-2.5 text-sm shadow-xs cursor-pointer group"
          >
            {/* White G logo */}
            <span className="font-bold text-sm tracking-tight flex items-center justify-center w-4 h-4">
              G
            </span>
            <span>Continue with Google</span>
          </button>

          {/* Subtitle from user's image */}
          <p className="text-center text-xs text-neutral-500 mt-2 mb-4 font-normal">
            You used Google to log in last time
          </p>
        </div>

        {/* Secondary Pill Buttons (Image 2 style) */}
        <div className="w-full space-y-2.5">
          
          {/* Button 1: Continue with email */}
          {!showEmailForm ? (
            <button
              type="button"
              onClick={() => {
                setShowEmailForm(true);
                setShowSAMLForm(false);
              }}
              className="w-full bg-white hover:bg-neutral-50 active:scale-[0.99] text-neutral-800 font-medium py-2.5 px-4 rounded-full border border-neutral-200 hover:border-neutral-300 transition text-sm shadow-2xs cursor-pointer"
            >
              Continue with email
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit} className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2 text-left">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg outline-none focus:border-[#5E6AD2]"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg outline-none focus:border-[#5E6AD2]"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#5E6AD2] hover:bg-[#505CBF] text-white text-xs font-medium py-1.5 px-3 rounded-lg"
                >
                  {loading ? "Signing in..." : "Continue"}
                </button>
              </div>
            </form>
          )}

          {/* Button 2: Continue with SAML SSO */}
          {!showSAMLForm ? (
            <button
              type="button"
              onClick={() => {
                setShowSAMLForm(true);
                setShowEmailForm(false);
              }}
              className="w-full bg-white hover:bg-neutral-50 active:scale-[0.99] text-neutral-800 font-medium py-2.5 px-4 rounded-full border border-neutral-200 hover:border-neutral-300 transition text-sm shadow-2xs cursor-pointer"
            >
              Continue with SAML SSO
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2 text-left">
              <input
                type="text"
                placeholder="company.com"
                value={samlDomain}
                onChange={(e) => setSamlDomain(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg outline-none focus:border-[#5E6AD2]"
              />
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowSAMLForm(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("google_chooser")}
                  className="bg-[#5E6AD2] hover:bg-[#505CBF] text-white text-xs font-medium py-1.5 px-3 rounded-lg"
                >
                  Lookup SSO &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Button 3: Log in with passkey */}
          <button
            type="button"
            onClick={handlePasskeySignIn}
            className="w-full bg-white hover:bg-neutral-50 active:scale-[0.99] text-neutral-800 font-medium py-2.5 px-4 rounded-full border border-neutral-200 hover:border-neutral-300 transition text-sm shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Log in with passkey</span>
          </button>

        </div>

      </div>

      {/* Footer Text (Image 2 style) */}
      <div className="text-center text-xs text-neutral-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-neutral-900 font-medium hover:underline">
          Sign up
        </Link>{" "}
        or{" "}
        <Link href="/" className="text-neutral-900 font-medium hover:underline">
          learn more
        </Link>
      </div>

    </div>
  );
}
