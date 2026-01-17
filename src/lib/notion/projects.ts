import { Project } from "@/types/project";
import {
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  getCheckbox,
  getDate,
  getImageUrl,
  getMultiSelect,
  getRichText,
  getSelect,
  getStatus,
  getTitle,
  getUrl,
  notion,
} from "./utils";

export async function getProjects({
  limit,
  filter,
}: {
  limit?: number;
  filter?: QueryDatabaseParameters["filter"];
}): Promise<Project[]> {
  const databaseId = process.env.NOTION_PROJECTS_DATABASE_ID;
  if (!databaseId) throw new Error("Missing NOTION_PROJECTS_DATABASE_ID");

  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
    page_size: limit,
    filter,
  });

  return response.results
    .filter((page): page is PageObjectResponse => page.object === "page")
    .map((page): Project => {
      const props = page.properties;

      return {
        id: page.id,
        name: getTitle(props, "Project Name"),
        description: getRichText(props, "Description"),
        client: getRichText(props, "Client"),
        status: getStatus(props, "Status"),
        projectType: getSelect(props, "Project Type"),
        technologies: getMultiSelect(props, "Technologies"),
        keyLearnings: getRichText(props, "Key Learnings"),
        startDate: getDate(props, "Start Date"),
        completionDate: getDate(props, "Completion Date"),
        featured: getCheckbox(props, "Featured"),
        projectUrl: getUrl(props, "Project URL"),
        repositoryUrl: getUrl(props, "Repository URL"),
        image: getImageUrl(
          props["Mockup Image"].type === "files"
            ? props["Mockup Image"]
            : undefined
        ),
      };
    });
}

export async function getProjectById(id: string): Promise<Project | null> {
  const databaseId = process.env.NOTION_PROJECTS_DATABASE_ID;
  if (!databaseId) throw new Error("Missing NOTION_PROJECTS_DATABASE_ID");

  try {
    const page = await notion.pages.retrieve({ page_id: id });
    if (!("properties" in page)) return null;

    // Check if it's a valid project page from our DB (optional verification)
    if (page.parent.type === "database_id" && page.parent.database_id.replaceAll("-", "") !== databaseId.replaceAll("-", "")) {
      // Mismatch database, might be fine depending on usage, but usually good to check
    }

    const props = page.properties;

    // Reconstruct project object
    // Note: 'keyLearnings' and others might need block children fetching for full content
    // For now we map the properties available on the page object
    return {
      id: page.id,
      name: getTitle(props, "Project Name"),
      description: getRichText(props, "Description"),
      client: getRichText(props, "Client"),
      status: getStatus(props, "Status"),
      projectType: getSelect(props, "Project Type"),
      technologies: getMultiSelect(props, "Technologies"),
      keyLearnings: getRichText(props, "Key Learnings"),
      startDate: getDate(props, "Start Date"),
      completionDate: getDate(props, "Completion Date"),
      featured: getCheckbox(props, "Featured"),
      projectUrl: getUrl(props, "Project URL"),
      repositoryUrl: getUrl(props, "Repository URL"),
      image: getImageUrl(
        props["Mockup Image"].type === "files"
          ? props["Mockup Image"]
          : undefined
      ),
    };

  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
}
