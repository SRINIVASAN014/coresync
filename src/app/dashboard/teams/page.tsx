import { db } from "@/lib/db";
import { Users, Mail, Shield, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default async function TeamsPage() {
  const [org, members] = await Promise.all([
    db.organization.findFirst({
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
      },
    }),
    db.user.findMany({
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Teams & Employees
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage organization members, RBAC permissions, and team access for {org?.name}
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
          <p className="text-xs text-neutral-400">
            Enterprise seats active under multi-tenant isolation
          </p>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-white/5">
            {members.map((member) => (
              <div
                key={member.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                    {member.name ? member.name.charAt(0) : "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {member.name || "Team Member"}
                    </p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5 font-mono">
                      <Mail className="w-3 h-3 text-neutral-500" />
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="default" className="text-[10px]">
                    MEMBER
                  </Badge>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
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
