import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { ApprovalsClient } from "./ApprovalsClient";

export default async function ApprovalsPage() {
  const cookieStore = await cookies();
  const activeOrgCookie = cookieStore.get("coresync_active_org_id")?.value;

  const [pendingApprovals, historyApprovals] = await Promise.all([
    db.approvalRequest.findMany({
      where: {
        status: "PENDING",
        ...(activeOrgCookie ? { organizationId: activeOrgCookie } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        project: { select: { name: true, key: true } },
      },
    }),
    db.approvalRequest.findMany({
      where: {
        status: { not: "PENDING" },
        ...(activeOrgCookie ? { organizationId: activeOrgCookie } : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
      include: {
        project: { select: { name: true, key: true } },
        reviewedBy: { select: { name: true, email: true } },
      },
    }),
  ]);

  return (
    <ApprovalsClient
      initialPending={pendingApprovals}
      initialHistory={historyApprovals}
    />
  );
}
