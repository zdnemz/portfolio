import type { Media } from "@/payload-types";

import type { ProjectMedia } from "@/lib/cms/types";

/**
 * Resolution order: a populated document's `externalUrl` (production CDN), then
 * its built-in `url` (local `/api/media/file/...`), then nothing. An unpopulated
 * relation arrives as a bare id, so it resolves to nothing rather than a guess.
 */
export function mediaUrl(
  value: Media | number | null | undefined
): string | null {
  if (value === null || value === undefined || typeof value === "number") {
    return null;
  }

  const external = value.externalUrl?.trim();
  if (external) return external;

  const url = value.url?.trim();
  return url ? url : null;
}

export function mediaAlt(
  value: Media | number | null | undefined,
  fallback: string
): string {
  if (value === null || value === undefined || typeof value === "number") {
    return fallback;
  }

  const alt = typeof value.alt === "string" ? value.alt.trim() : "";
  return alt === "" ? fallback : alt;
}

/** Media docs that resolve to a URL, in the order the CMS stored them. */
export function mediaList(
  value: (Media | number)[] | null | undefined
): ProjectMedia[] {
  return (value ?? []).flatMap((entry) => {
    const url = mediaUrl(entry);
    return url === null ? [] : [{ url, alt: mediaAlt(entry, "") }];
  });
}
