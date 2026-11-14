import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

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
  if (!activeOrg && session?.user?.id) {
    const member = await db.organizationMember.findFirst({
      where: { userId: session.user.id },
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

  const members = activeOrg?.members || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Teams & Employees
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage organization members, RBAC permissions, and team access for {activeOrg?.name}
          </p>
        </div>

        <Button variant="primary" size="sm">
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          <span>Invite Employee</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Members ({members.length})</CardTitle>
          <p className="text-xs text-slate-500">
            Enterprise seats active under multi-tenant isolation
          </p>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {members.map((member) => (
              <div
                key={member.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 px-2 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200 flex items-center justify-center text-xs shadow-2xs">
                    {member.user?.name ? member.user.name.charAt(0) : "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {member.user?.name || "Team Member"}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {member.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      member.role === "OWNER"
                        ? "ai"
                        : member.role === "MANAGER"
                        ? "warning"
                        : "default"
                    }
                    className="text-[10px]"
                  >
                    {member.role}
                  </Badge>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-slate-200 text-slate-700 hover:bg-slate-50">
                    Permissions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
