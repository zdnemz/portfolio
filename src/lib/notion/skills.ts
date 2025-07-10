import { Skill } from "@/types/skill";
import {
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { getTitle, getSelect, getUrl, notion } from "./utils";

export async function getSkills({
  limit,
  filter,
}: {
  limit?: number;
  filter?: QueryDatabaseParameters["filter"];
}): Promise<Skill[]> {
  const databaseId = process.env.NOTION_SKILLS_DATABASE_ID;
  if (!databaseId) throw new Error("Missing NOTION_SKILLS_DATABASE_ID");

  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
    page_size: limit,
    filter,
  });

  return response.results
    .filter((page): page is PageObjectResponse => page.object === "page")
    .map((page): Skill => {
      const props = page.properties;

      return {
        id: page.id,
        name: getTitle(props, "Skill Name"),
        category: getSelect(props, "Category"),
        proficiency: getSelect(props, "Proficiency Level"),
        url: getUrl(props, "URL"),
      };
    });
}
