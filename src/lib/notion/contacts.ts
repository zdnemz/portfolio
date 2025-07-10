import { notion } from "./utils";

export async function createContact(data: {
  name: string;
  email: string;
  message: string;
}) {
  const { name, email, message } = data;
  if (!name || !email || !message)
    throw new Error("Missing name, email or message");

  const databaseId = process.env.NOTION_CONTACTS_DATABASE_ID;
  if (!databaseId) throw new Error("Missing NOTION_CONTACTS_DATABASE_ID");

  const now = new Date().toISOString(); // ISO 8601 format

  return await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [
          {
            text: { content: name },
          },
        ],
      },
      Email: {
        email,
      },
      Message: {
        rich_text: [
          {
            text: { content: message },
          },
        ],
      },
      Date: {
        date: {
          start: now,
        },
      },
    },
  });
}
