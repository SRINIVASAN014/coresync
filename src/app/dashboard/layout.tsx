import { getServerSession } from "next-auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const userEmail = session?.user?.email || "developer@coresync.io";
  const orgName = "Acme Technologies"; // In Phase 3, this dynamically loads the active Organization

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808]">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar currentOrgName={orgName} userEmail={userEmail} />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav title="Workspace Overview" />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#090A0D]">
          {children}
        </main>
      </div>
    </div>
  );
}
