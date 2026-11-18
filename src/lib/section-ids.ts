/**
 * Section ids in DOM order. The navbar links, the command palette and the
 * reading-progress rail all walk this array, so order is part of the contract.
 */
export const SECTION_IDS = [
  "top",
  "projects",
  "services",
  "process",
  "about",
  "testimonials",
  "github",
  "faq",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];
