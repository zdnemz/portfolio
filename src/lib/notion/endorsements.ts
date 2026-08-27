import { Endorsement } from "@/types/endorsement";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { getRichText, getTitle, notion } from "./utils";

/**
 * Endorsements shown in the "/ Endorsements" section. Only rows with
 * Published checked are returned — an unpublished or empty database means the
 * section renders nothing at all, which is the honest state until real
 * endorsements exist.
 */
export async function getEndorsements(limit = 6): Promise<Endorsement[]> {
  const databaseId = process.env.NOTION_ENDORSEMENTS_DATABASE_ID;
  if (!databaseId) throw new Error("Missing NOTION_ENDORSEMENTS_DATABASE_ID");

  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
    page_size: limit,
    filter: { property: "Published", checkbox: { equals: true } },
  });

  return response.results
    .filter((page): page is PageObjectResponse => page.object === "page")
    .map((page): Endorsement => {
      const props = page.properties;

      return {
        id: page.id,
        name: getTitle(props, "Name"),
        quote: getRichText(props, "Quote"),
        role: getRichText(props, "Role"),
        company: getRichText(props, "Company"),
      };
    })
    .filter((e) => e.quote && e.name);
}
