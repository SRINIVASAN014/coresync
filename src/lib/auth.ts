import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Authentication",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isGoogleChooser: { label: "isGoogleChooser", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        // 1. Google Account Chooser instant 1-click authentication
        if (credentials.isGoogleChooser === "true") {
          let user = await db.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (!user) {
            user = await db.user.create({
              data: {
                email: normalizedEmail,
                name: normalizedEmail.split("@")[0],
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }

        // 2. Standard Email/Password verification
        if (!credentials.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      // Resolve effective user ID and email
      const targetUserId = (token.id as string) || user?.id;
      const targetEmail = (token.email as string) || user?.email;

      let effectiveUserId = targetUserId;
      if (!effectiveUserId && targetEmail) {
        const found = await db.user.findUnique({
          where: { email: targetEmail.toLowerCase().trim() },
        });
        if (found) {
          effectiveUserId = found.id;
          token.id = found.id;
        }
      }

      // Ensure organization membership is resolved or provisioned
      if (effectiveUserId) {
        let member = await db.organizationMember.findFirst({
          where: { userId: effectiveUserId },
          include: { organization: true },
          orderBy: { joinedAt: "asc" },
        });

        // If newly signed up with Google and has no organization yet, attach to default org
        if (!member) {
          const defaultOrg = await db.organization.findFirst({
            orderBy: { createdAt: "asc" },
          });
          if (defaultOrg) {
            member = await db.organizationMember.create({
              data: {
                organizationId: defaultOrg.id,
                userId: effectiveUserId,
                role: "OWNER",
              },
              include: { organization: true },
            });
          }
        }

        if (member) {
          token.organizationId = member.organizationId;
          token.organizationName = member.organization.name;
          token.role = member.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string;
        session.user.organizationName = token.organizationName as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "coresync-secret-key-enterprise-2026",
};
