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
