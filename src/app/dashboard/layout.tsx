import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { db } from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect("/login");
  }

  // 1. Resolve Verified User from Database by Email
  let dbUser = await db.user.findUnique({
    where: { email: session.user.email.toLowerCase().trim() },
  });

  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        email: session.user.email.toLowerCase().trim(),
        name: session.user.name || "Enterprise User",
        image: session.user.image,
      },
    });
  }

  const userId = dbUser.id;
  const userEmail = dbUser.email;
  const userName = dbUser.name || session.user.name || "Enterprise User";

  // 2. Fetch Organizations this specific user belongs to
  let memberships = await db.organizationMember.findMany({
    where: { userId },
    include: { organization: true },
    orderBy: { joinedAt: "asc" },
  });

  // 3. If user has no workspace yet, attach them to the default enterprise org
  if (memberships.length === 0) {
    const defaultOrg = await db.organization.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (defaultOrg) {
      const newMembership = await db.organizationMember.create({
        data: {
          organizationId: defaultOrg.id,
          userId,
          role: "OWNER",
        },
        include: { organization: true },
      });
      memberships = [newMembership];
    }
  }

  // 4. Resolve Active Organization from Cookie or First Membership
  const cookieStore = await cookies();
  const activeOrgCookie = cookieStore.get("coresync_active_org_id")?.value;

  const activeMembership =
    memberships.find((m) => m.organizationId === activeOrgCookie) ||
    memberships[0];

  const orgName = activeMembership?.organization?.name || "Global CyberTech Solutions";
  const orgSlug = activeMembership?.organization?.slug || "cybertech-global";
  const userRole = activeMembership?.role || "OWNER";

  // 5. Strictly Deduplicate Organizations by Organization ID (Guarantees unique React keys)
  const uniqueOrgsMap = new Map<
    string,
    { id: string; name: string; slug: string; role: string; isActive: boolean }
  >();

  for (const m of memberships) {
    if (m.organization && !uniqueOrgsMap.has(m.organization.id)) {
      uniqueOrgsMap.set(m.organization.id, {
        id: m.organization.id,
        name: m.organization.name,
        slug: m.organization.slug,
        role: m.role,
        isActive: m.organization.id === activeMembership?.organizationId,
      });
    }
  }

  const allOrganizations = Array.from(uniqueOrgsMap.values());

  // 6. Fetch Active Projects for the Sidebar Navigation Hierarchy
  const projects = await db.project.findMany({
    where: activeMembership?.organizationId
      ? { organizationId: activeMembership.organizationId }
      : undefined,
    select: {
      id: true,
      name: true,
      key: true,
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900">
      {/* 1. Left Sidebar Navigation with Live Multi-Tenant Workspace Switcher */}
      <Sidebar
        currentOrgName={orgName}
        currentOrgSlug={orgSlug}
        userEmail={userEmail}
        userName={userName}
        userRole={userRole}
        organizations={allOrganizations}
        projects={projects}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]">
        <TopNav title={`${orgName}`} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8FAFC] text-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
