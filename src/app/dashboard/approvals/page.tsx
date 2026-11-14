import { db } from "@/lib/db";
import { ApprovalsClient } from "./ApprovalsClient";

export default async function ApprovalsPage() {
  const approvals = await db.approvalRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      project: { select: { name: true, key: true } },
    },
  });

  return <ApprovalsClient approvals={approvals} />;
}
