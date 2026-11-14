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

  if (!session || !session.user) {
    redirect("/login");
  }

  const userEmail = session.user.email || "admin@cybertech.com";
  const userName = session.user.name || "Enterprise User";

  // Fetch all organizations the user belongs to
  let memberships = await db.organizationMember.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { joinedAt: "asc" },
  });

  // If user doesn't have any memberships yet, assign them to the default seeded org
  if (memberships.length === 0) {
    const defaultOrg = await db.organization.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (defaultOrg) {
      const newMembership = await db.organizationMember.create({
        data: {
          organizationId: defaultOrg.id,
          userId: session.user.id,
          role: "MEMBER",
        },
        include: { organization: true },
      });
      memberships = [newMembership];
    }
  }

  const cookieStore = await cookies();
  const activeOrgCookie = cookieStore.get("coresync_active_org_id")?.value;

  // Find active membership matching cookie, or fallback to first membership
  const activeMembership =
    memberships.find((m) => m.organizationId === activeOrgCookie) ||
    memberships[0];

  const orgName = activeMembership?.organization?.name || "Global CyberTech Solutions";
  const orgSlug = activeMembership?.organization?.slug || "cybertech-global";
  const userRole = activeMembership?.role || "OWNER";

  const allOrganizations = memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    role: m.role,
    isActive: m.organization.id === activeMembership?.organizationId,
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808]">
      {/* 1. Left Sidebar Navigation with Live Multi-Tenant Workspace Switcher */}
      <Sidebar
        currentOrgName={orgName}
        currentOrgSlug={orgSlug}
        userEmail={userEmail}
        userName={userName}
        userRole={userRole}
        organizations={allOrganizations}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav title={`${orgName}`} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#090A0D]">
          {children}
        </main>
      </div>
    </div>
  );
}
