import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = async (req: NextRequest, ctx: any) => {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host && host.includes("localhost")) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  } else {
    // In production or Vercel preview environments, always lock to the registered canonical production domain
    // so Google Cloud Console OAuth redirect_uri is strictly matched without mismatch errors.
    process.env.NEXTAUTH_URL = "https://coresync-bay.vercel.app";
  }
  return (NextAuth(authOptions) as any)(req, ctx);
};

export { handler as GET, handler as POST };
