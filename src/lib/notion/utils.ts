import {
  Client,
  type PageObjectResponse,
  type RichTextItemResponse,
} from "@notionhq/client";

export const notion = new Client({ auth: process.env.NOTION_TOKEN });

export const extractText = (items: RichTextItemResponse[]): string =>
  items.map((item) => item.plain_text).join("");

export const getTitle = (
  props: PageObjectResponse["properties"],
  key: string
): string => {
  const field = props[key];
  return field?.type === "title" ? extractText(field.title) : "";
};

export const getRichText = (
  props: PageObjectResponse["properties"],
  key: string
): string => {
  const field = props[key];
  return field?.type === "rich_text" ? extractText(field.rich_text) : "";
};

export const getStatus = (
  props: PageObjectResponse["properties"],
  key: string
): string => {
  const field = props[key];
  return field?.type === "status" ? field.status?.name ?? "Unknown" : "Unknown";
};

export const getSelect = (
  props: PageObjectResponse["properties"],
  key: string
): string | null => {
  const field = props[key];
  return field?.type === "select" ? field.select?.name ?? null : null;
};

export const getMultiSelect = (
  props: PageObjectResponse["properties"],
  key: string
): string[] => {
  const field = props[key];
  return field?.type === "multi_select"
    ? field.multi_select.map((item) => item.name)
    : [];
};

export const getDate = (
  props: PageObjectResponse["properties"],
  key: string
): string | null => {
  const field = props[key];
  return field?.type === "date" ? field.date?.start ?? null : null;
};

export const getCheckbox = (
  props: PageObjectResponse["properties"],
  key: string
): boolean => {
  const field = props[key];
  return field?.type === "checkbox" ? field.checkbox : false;
};

export const getUrl = (
  props: PageObjectResponse["properties"],
  key: string
): string | null => {
  const field = props[key];
  return field?.type === "url" ? field.url : null;
};

/**
 * Every file URL on a Notion "files" property, in the order Notion stores
 * them. Notion-hosted files come back as signed S3 URLs that expire after
 * roughly an hour, so pages rendering these must stay dynamic.
 */
export const getFileUrls = (
  props: PageObjectResponse["properties"],
  key: string
): string[] => {
  const field = props[key];
  if (field?.type !== "files") return [];

  return field.files
    .map((file) => ("file" in file ? file.file.url : file.external?.url))
    .filter((url): url is string => Boolean(url));
};
