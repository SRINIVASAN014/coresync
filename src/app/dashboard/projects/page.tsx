import { db } from "@/lib/db";
import { ProjectsDirectoryClient } from "./ProjectsDirectoryClient";

export default async function ProjectsPage() {
  const [projects, org] = await Promise.all([
    db.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        tasks: true,
        owner: { select: { name: true, email: true } },
      },
    }),
    db.organization.findFirst(),
  ]);

  return (
    <ProjectsDirectoryClient
      projects={projects}
      orgName={org?.name || "Global Enterprise"}
    />
  );
}
