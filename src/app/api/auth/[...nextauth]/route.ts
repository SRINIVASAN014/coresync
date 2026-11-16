import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = async (req: NextRequest, ctx: any) => {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host && !host.includes("localhost")) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
  return (NextAuth(authOptions) as any)(req, ctx);
};

export { handler as GET, handler as POST };
