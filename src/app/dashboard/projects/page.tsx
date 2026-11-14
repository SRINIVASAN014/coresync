import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProjectsDirectoryClient } from "./ProjectsDirectoryClient";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const activeOrgCookie = cookieStore.get("coresync_active_org_id")?.value;

  let activeOrg = null;
  if (activeOrgCookie) {
    activeOrg = await db.organization.findUnique({
      where: { id: activeOrgCookie },
    });
  }
  if (!activeOrg && session?.user?.id) {
    const member = await db.organizationMember.findFirst({
      where: { userId: session.user.id },
      include: { organization: true },
    });
    activeOrg = member?.organization || null;
  }
  if (!activeOrg) {
    activeOrg = await db.organization.findFirst({
      orderBy: { createdAt: "asc" },
    });
  }

  const orgId = activeOrg?.id;

  const projects = await db.project.findMany({
    where: orgId ? { organizationId: orgId } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      tasks: true,
      owner: { select: { name: true, email: true } },
    },
  });

  return (
    <ProjectsDirectoryClient
      projects={projects}
      orgName={activeOrg?.name || "Global Enterprise"}
    />
  );
}
