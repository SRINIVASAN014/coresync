import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { TeamsClient } from "./TeamsClient";
import { Role } from "@prisma/client";

export default async function TeamsPage() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const activeOrgCookie = cookieStore.get("coresync_active_org_id")?.value;

  let activeOrg = null;
  if (activeOrgCookie) {
    activeOrg = await db.organization.findUnique({
      where: { id: activeOrgCookie },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
          orderBy: { joinedAt: "asc" },
        },
      },
    });
  }
  if (!activeOrg && session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) {
      const member = await db.organizationMember.findFirst({
        where: { userId: user.id },
        include: {
          organization: {
            include: {
              members: {
                include: {
                  user: { select: { id: true, name: true, email: true, image: true } },
                },
                orderBy: { joinedAt: "asc" },
              },
            },
          },
        },
      });
      activeOrg = member?.organization || null;
    }
  }
  if (!activeOrg) {
    activeOrg = await db.organization.findFirst({
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
          orderBy: { joinedAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  // Resolve current user ID and role in this org
  let currentUserId = "";
  let currentUserRole: Role = Role.MEMBER;

  if (session?.user?.email) {
    const dbUser = await db.user.findUnique({
      where: { email: session.user.email },
    });
    if (dbUser) {
      currentUserId = dbUser.id;
      const callerMembership = activeOrg?.members.find(
        (m: any) => m.userId === dbUser.id
      );
      if (callerMembership) {
        currentUserRole = callerMembership.role;
      }
    }
  }

  const members = activeOrg?.members || [];

  return (
    <TeamsClient
      initialMembers={members}
      currentUserId={currentUserId}
      currentUserRole={currentUserRole}
      orgName={activeOrg?.name || "Global CyberTech Solutions"}
    />
  );
}
