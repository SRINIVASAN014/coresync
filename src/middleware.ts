import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
  },
});

export default function middleware(req: NextRequest, event: any) {
  const host = req.headers.get("host") || "";

  // Canonical redirect for ephemeral Vercel deployment preview URLs
  // This ensures Google OAuth always receives the registered production callback domain.
  if (
    host.includes("vercel.app") &&
    !host.includes("coresync-bay.vercel.app") &&
    !host.includes("localhost")
  ) {
    const url = req.nextUrl.clone();
    url.host = "coresync-bay.vercel.app";
    url.protocol = "https";
    return NextResponse.redirect(url, 307);
  }

  // Enforce session authentication for protected dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    return (authMiddleware as any)(req, event);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
