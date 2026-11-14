import Link from "next/link";
import { getServerSession } from "next-auth";

export default async function Navbar() {
  // Fetch the active user session securely from the server
  const session = await getServerSession();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo & Protected Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-slate-900 tracking-tight">
            Core<span className="text-blue-600">Sync</span>
          </Link>
          
          {/* Only show the Workspace link if the user is logged in */}
          {session && (
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Workspace
            </Link>
          )}
        </div>
        
        {/* Right Side: Dynamic Authentication UI */}
        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {session.user?.name}
              </span>
              {session.user?.image && (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-slate-200"
                />
              )}
              <a href="/api/auth/signout" className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors ml-2">
                Sign Out
              </a>
            </>
          ) : (
            <a href="/api/auth/signin" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Sign In with Google
            </a>
          )}
        </nav>
        
      </div>
    </header>
  );
}