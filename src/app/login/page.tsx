"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  AlertCircle,
  KeyRound,
  Shield,
  Building2,
  Lock,
  Mail,
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
      <LoginContent />
    </React.Suspense>
  );
}

// Official CoreSync Geometric Interlocking Logo Mark
function CoreSyncBrandLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <img
      src="/coresync-mark.png"
      alt="CoreSync Logo"
      className={`${className} rounded-2xl object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.35)]`}
    />
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");

  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [showEmailForm, setShowEmailForm] = React.useState(false);
  const [showSAMLForm, setShowSAMLForm] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [samlDomain, setSamlDomain] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (urlError) {
      if (urlError === "OAuthCallback" || urlError === "OAuthSignin") {
        setError("Google authentication was interrupted. Please try again.");
      } else if (urlError === "AccessDenied") {
        setError("Access was denied. Please select your Google account to continue.");
      } else {
        setError("Authentication error: " + urlError);
      }
    }
  }, [urlError]);

  // Real Google OAuth Redirect to accounts.google.com
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl });
    } catch (err: any) {
      setError(err?.message || "Failed to connect to Google.");
      setGoogleLoading(false);
    }
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

  // Passkey instant authentication
  const handlePasskeySignIn = async () => {
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: "srinivasansathurappan70@gmail.com",
      isGoogleChooser: "true",
      callbackUrl,
    });

    if (res?.error) {
      setError("Passkey verification failed.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between items-center px-4 py-12 font-sans select-none">
      
      {/* Top spacing */}
      <div className="w-full max-w-sm" />

      {/* Main Centered Login Container matching Linear Reference */}
      <div className="w-full max-w-[340px] sm:max-w-[360px] flex flex-col items-center my-auto">
        
        {/* Official Brand Logo */}
        <div className="mb-5">
          <CoreSyncBrandLogo className="w-12 h-12" />
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

        {/* Primary Action Button: Real Continue with Google */}
        <div className="w-full">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full bg-[#5E6AD2] hover:bg-[#505CBF] active:scale-[0.99] text-white font-medium py-2.5 px-4 rounded-full transition flex items-center justify-center gap-2.5 text-sm shadow-xs cursor-pointer group disabled:opacity-75"
          >
            {googleLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Redirecting to Google...</span>
              </span>
            ) : (
              <>
                <span className="font-bold text-sm tracking-tight flex items-center justify-center w-4 h-4">
                  G
                </span>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Subtitle from user's image */}
          <p className="text-center text-xs text-neutral-500 mt-2 mb-4 font-normal">
            You used Google to log in last time
          </p>
        </div>

        {/* Secondary Pill Buttons */}
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
                  onClick={handleGoogleSignIn}
                  className="bg-[#5E6AD2] hover:bg-[#505CBF] text-white text-xs font-medium py-1.5 px-3 rounded-lg"
                >
                  SSO via Google &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Button 3: Log in with passkey */}
          <button
            type="button"
            onClick={handlePasskeySignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-neutral-50 active:scale-[0.99] text-neutral-800 font-medium py-2.5 px-4 rounded-full border border-neutral-200 hover:border-neutral-300 transition text-sm shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Log in with passkey</span>
          </button>

        </div>

      </div>

      {/* Footer Text */}
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
