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
        <div className="flex items-center gap-6 lg:gap-8">
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
          
          {/* Top Left Navigation Links: Pricing, Templates, Contact */}
          <nav className="hidden sm:flex items-center gap-4 lg:gap-6">
            <a
              href="#pricing"
              className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#templates"
              className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Templates
            </a>
            <a
              href="#contact"
              className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Contact
            </a>
            <a
              href="#features"
              className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Capabilities
            </a>
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Workspace
            </Link>
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
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#3B82F6] hover:bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.35)] transition select-none active:scale-95"
              >
                <span>Create Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
}
