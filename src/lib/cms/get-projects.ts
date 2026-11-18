import { mediaList } from "@/lib/cms/media";
import { getPayloadClient } from "@/lib/cms/payload";
import type { ProjectCard, ProjectDetail } from "@/lib/cms/types";
import type { Project } from "@/payload-types";

/** Newest first, featured first; `-createdAt` keeps the order stable on ties. */
const PROJECT_SORT = ["-featured", "-endDate", "-createdAt"];

/** Everything at once — the archive is small and the print page needs it all. */
const MAX_PROJECTS = 200;

/**
 * Public read is allowed on `projects`, so `overrideAccess: false` lets the
 * collection's access rule apply instead of bypassing it. Depth 1 populates
 * `media` so the media helpers receive documents, never bare ids.
 */
const READ_OPTIONS = {
  overrideAccess: false,
  depth: 1,
} as const;

function toCard(project: Project): ProjectCard {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    summary: project.summary ?? "",
    stack: (project.stack ?? []).map((item) => ({ label: item.label ?? "" })),
    projectType: project.projectType ?? "",
    status: project.status ?? "shipped",
    featured: project.featured ?? false,
    media: mediaList(project.media),
  };
}

function toDetail(project: Project): ProjectDetail {
  const metric = project.outcomeMetric;
  return {
    ...toCard(project),
    problem: project.problem ?? "",
    role: project.role ?? "",
    outcome: project.outcome ?? "",
    outcomeMetric:
      metric?.value === null || metric?.value === undefined
        ? null
        : { value: metric.value, unit: metric.unit ?? "" },
    timeline: project.timeline ?? "",
    client: project.client ?? "",
    startDate: project.startDate ?? null,
    endDate: project.endDate ?? null,
    projectUrl: project.projectUrl ?? "",
    repositoryUrl: project.repositoryUrl ?? "",
  };
}

export async function getAllProjects(): Promise<ProjectCard[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    ...READ_OPTIONS,
    sort: PROJECT_SORT,
    limit: MAX_PROJECTS,
    page: 1,
  });

  return docs.map(toCard);
}

export async function getFeaturedProjects(limit = 3): Promise<ProjectCard[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    ...READ_OPTIONS,
    where: { featured: { equals: true } },
    sort: PROJECT_SORT,
    limit,
    page: 1,
  });

  return docs.map(toCard);
}

export async function getProjectBySlug(
  slug: string
): Promise<ProjectDetail | null> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    ...READ_OPTIONS,
    where: { slug: { equals: slug } },
    limit: 1,
    page: 1,
  });

  const project = docs[0];
  return project ? toDetail(project) : null;
}

export async function getProjectSlugs(): Promise<string[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    ...READ_OPTIONS,
    limit: MAX_PROJECTS,
    page: 1,
  });

  return docs.map((project) => project.slug).filter((slug) => slug !== "");
}
