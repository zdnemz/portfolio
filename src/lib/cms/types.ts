import type { Project, Site } from "@/payload-types";

/**
 * The generated `Site` global has every group and every leaf optional, which is
 * accurate for the database but wrong for rendering: the fetchers always return
 * complete groups, so the UI can read `site.hero.headline` without guarding.
 *
 * The group keys and field names still come from `@/payload-types`, so a rename
 * in `src/globals/Site.ts` breaks the build here instead of at runtime.
 */

/** A generated group with no `null`/`undefined` at the top level. */
type Filled<T> = { [K in keyof T]-?: NonNullable<T[K]> };

type RawGroup<K extends keyof Site> = NonNullable<Site[K]>;

type LabelItem = { label: string };

type LinkItem = { label: string; href: string };

type StepItem = {
  title: string;
  description: string;
  tools: LabelItem[];
};

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

type FaqItem = { question: string; answer: string };

type NowItem = { label: string; value: string; kind: "text" | "clock" };

export type ProjectMedia = {
  url: string;
  alt: string;
};

export type ProjectCard = {
  id: Project["id"];
  title: string;
  slug: string;
  summary: string;
  stack: { label: string }[];
  projectType: string;
  status: NonNullable<Project["status"]>;
  featured: boolean;
  media: ProjectMedia[];
};

export type ProjectDetail = ProjectCard & {
  problem: string;
  role: string;
  outcome: string;
  outcomeMetric: { value: number; unit: string } | null;
  timeline: string;
  client: string;
  startDate: string | null;
  endDate: string | null;
  projectUrl: string;
  repositoryUrl: string;
};

export type StatItem = {
  value: number;
  suffix?: string | null;
  label: string;
};

export type StackGroup = {
  title: string;
  span: "3" | "4" | "2";
  items: LabelItem[];
};

export type SiteContent = {
  seo: Filled<RawGroup<"seo">>;
  identity: Filled<RawGroup<"identity">>;
  hero: Omit<Filled<RawGroup<"hero">>, "marquee"> & { marquee: LabelItem[] };
  stats: Omit<Filled<RawGroup<"stats">>, "items"> & { items: StatItem[] };
  projectsSection: Filled<RawGroup<"projectsSection">>;
  services: Omit<Filled<RawGroup<"services">>, "items"> & { items: StepItem[] };
  process: Omit<Filled<RawGroup<"process">>, "items"> & { items: StepItem[] };
  about: Omit<Filled<RawGroup<"about">>, "groups"> & { groups: StackGroup[] };
  testimonials: Omit<Filled<RawGroup<"testimonials">>, "items"> & {
    items: TestimonialItem[];
  };
  github: Filled<RawGroup<"github">>;
  faq: Omit<Filled<RawGroup<"faq">>, "items"> & { items: FaqItem[] };
  now: Omit<Filled<RawGroup<"now">>, "items"> & { items: NowItem[] };
  contact: Filled<RawGroup<"contact">>;
  nav: Omit<Filled<RawGroup<"nav">>, "items"> & { items: LinkItem[] };
  footer: Omit<Filled<RawGroup<"footer">>, "socials"> & { socials: LinkItem[] };
  projectPage: Filled<RawGroup<"projectPage">>;
  projectsPrint: Filled<RawGroup<"projectsPrint">>;
};
