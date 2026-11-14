import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function Navbar() {
  // Fetch active user session securely from the server
  const session = await getServerSession();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080808]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Official Brand Logo matching the uploaded screenshot */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Blue to Purple Gradient Badge with Sparkle */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] via-[#6366F1] to-[#A855F7] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.35)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {/* Crisp Pure White 'Core' + Electric Blue 'Sync' */}
            <span className="text-xl font-bold tracking-tight text-white flex items-center">
              Core<span className="text-[#3B82F6]">Sync</span>
            </span>
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Workspace
            </Link>
            <a
              href="#features"
              className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Capabilities
            </a>
          </nav>
        </div>
        
        {/* Right Side: Authentication UI */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-medium text-neutral-300 hidden md:inline-block">
                {session.user?.name}
              </span>
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-white/10 ring-1 ring-[#3B82F6]/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white border border-white/10">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
              )}
              <Link 
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-full transition"
              >
                Go to Workspace <ArrowRight className="w-3 h-3" />
              </Link>
              <a
                href="/api/auth/signout"
                className="text-xs font-medium text-neutral-400 hover:text-rose-400 px-3 py-1.5 rounded-full border border-white/5 hover:border-rose-500/20 hover:bg-rose-500/5 transition ml-1"
              >
                Sign Out
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/api/auth/signin"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition"
              >
                Sign In
              </a>
              <a
                href="/api/auth/signin"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-black bg-white hover:bg-neutral-200 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.12)] transition select-none active:scale-95"
              >
                {/* Google SVG Icon */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign In with Google</span>
              </a>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
}
