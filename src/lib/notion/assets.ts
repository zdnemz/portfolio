import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { getFileUrls, getTitle, notion } from "./utils";

/**
 * A file the site serves directly, looked up by its exact Name in the
 * Portfolio Assets database — "CV" is the only key used today.
 *
 * Returns null when the row is missing or its File column is empty, which is
 * what lets the Download CV button stay hidden until a real PDF exists.
 *
 * ponytail: the URL Notion returns is signed and expires after roughly an
 * hour. Fine for a click made shortly after page load; if a tab sits open
 * past that the link 403s. Proxy the bytes through this route if that ever
 * matters.
 */
export async function getAssetUrl(name: string): Promise<string | null> {
  const databaseId = process.env.NOTION_ASSETS_DATABASE_ID;
  if (!databaseId) throw new Error("Missing NOTION_ASSETS_DATABASE_ID");

  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
    page_size: 10,
    filter: { property: "Name", title: { equals: name } },
  });

  const page = response.results
    .filter((p): p is PageObjectResponse => p.object === "page")
    .find((p) => getTitle(p.properties, "Name") === name);
  if (!page) return null;

  return getFileUrls(page.properties, "File")[0] ?? null;
}
