import { db } from "@/lib/db";
import { Settings, Building2, ShieldCheck, Database, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default async function SettingsPage() {
  const org = await db.organization.findFirst();

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      <div className="pb-4 border-b border-white/5 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Workspace Settings
        </h1>
        <p className="text-xs text-neutral-400">
          Organization profile, multi-tenant boundaries, and enterprise security policies
        </p>
      </div>

      {/* Organization Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <CardTitle>Organization Details</CardTitle>
          </div>
          <p className="text-xs text-neutral-400">
            Public company identity and workspace URL slug
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">
                Organization Name
              </label>
              <input
                type="text"
                defaultValue={org?.name || "Global CyberTech Solutions"}
                className="w-full bg-[#14161C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">
                Workspace Slug
              </label>
              <input
                type="text"
                defaultValue={org?.slug || "cybertech-global"}
                readOnly
                className="w-full bg-[#101216] border border-white/5 text-neutral-400 rounded-lg px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1">
              Industry Domain
            </label>
            <input
              type="text"
              defaultValue={org?.industry || "Enterprise Cybersecurity & DevSecOps"}
              className="w-full bg-[#14161C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <Button variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security & Multi-Tenant Isolation */}
      <Card className="border-emerald-500/20 bg-emerald-950/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <CardTitle className="text-emerald-300">
              Enterprise Security & Isolation
            </CardTitle>
          </div>
          <p className="text-xs text-neutral-400">
            Tenant boundaries active on PostgreSQL
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-neutral-300">
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
            <div>
              <p className="font-semibold text-white">Multi-Tenant Logical Partitioning</p>
              <p className="text-[11px] text-neutral-400">
                All projects, tasks, and audit logs are strictly scoped by Organization ID.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              ENFORCED
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
            <div>
              <p className="font-semibold text-white">Human Approval Requirement for AI</p>
              <p className="text-[11px] text-neutral-400">
                Require human manager authorization before autonomous AI agents can assign tasks or rebalance sprints.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
              ACTIVE
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
