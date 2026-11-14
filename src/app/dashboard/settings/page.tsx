import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Building2, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const activeOrgCookie = cookieStore.get("coresync_active_org_id")?.value;

  let org = null;
  if (activeOrgCookie) {
    org = await db.organization.findUnique({
      where: { id: activeOrgCookie },
    });
  }
  if (!org && session?.user?.id) {
    const member = await db.organizationMember.findFirst({
      where: { userId: session.user.id },
      include: { organization: true },
    });
    org = member?.organization || null;
  }
  if (!org) {
    org = await db.organization.findFirst();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      <div className="pb-4 border-b border-slate-200 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Workspace Settings
        </h1>
        <p className="text-xs text-slate-500">
          Organization profile, multi-tenant boundaries, and enterprise security policies
        </p>
      </div>

      {/* Organization Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <CardTitle>Organization Details</CardTitle>
          </div>
          <p className="text-xs text-slate-500">
            Public company identity and workspace URL slug
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Organization Name
              </label>
              <input
                type="text"
                defaultValue={org?.name || "Global CyberTech Solutions"}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Workspace Slug
              </label>
              <input
                type="text"
                defaultValue={org?.slug || "cybertech-global"}
                readOnly
                className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-lg px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Industry Domain
            </label>
            <input
              type="text"
              defaultValue={org?.industry || "Enterprise Cybersecurity & DevSecOps"}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
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
      <Card className="border-emerald-200 bg-emerald-50/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <CardTitle className="text-emerald-950">
              Enterprise Security & Isolation
            </CardTitle>
          </div>
          <p className="text-xs text-slate-500">
            Tenant boundaries active on PostgreSQL
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-slate-700">
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div>
              <p className="font-semibold text-slate-900">Multi-Tenant Logical Partitioning</p>
              <p className="text-[11px] text-slate-500">
                All projects, tasks, and audit logs are strictly scoped by Organization ID ({org?.id}).
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded">
              ENFORCED
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div>
              <p className="font-semibold text-slate-900">Human Approval Requirement for AI</p>
              <p className="text-[11px] text-slate-500">
                Require human manager authorization before autonomous AI agents can assign tasks or rebalance sprints.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded">
              ACTIVE
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Google Gemini AI Configuration */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-blue-950">
              Google Gemini AI Engine
            </CardTitle>
          </div>
          <p className="text-xs text-slate-500">
            Cloud generative AI integration for autonomous project planning and sprint decomposition
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-slate-700">
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div>
              <p className="font-semibold text-slate-900">Model Engine: Google Gemini 1.5 Flash</p>
              <p className="text-[11px] text-slate-500">
                Deconstructs natural language product objectives into Linear issues, epics, and acceptance criteria.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded">
              GEMINI 1.5 FLASH
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 text-xs">
                Free Gemini API Key Setup
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1 font-medium"
              >
                <span>Generate key on Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Connect your Gemini API key in the AI Project Planner or add <code className="px-1.5 py-0.5 bg-slate-100 rounded text-blue-700 font-mono text-[10px]">GEMINI_API_KEY</code> to your <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-[10px]">.env</code> file.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
