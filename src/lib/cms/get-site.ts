import { getPayloadClient } from "@/lib/cms/payload";
import type { SiteContent } from "@/lib/cms/types";
import type { Site } from "@/payload-types";

/**
 * Every group is spelled out field by field. The generated `Site` type has all
 * leaves optional, so the API can return a half-filled global; the UI reads
 * `site.hero.headline` unguarded, so this returns the same shape with `""` and
 * `[]` standing in for whatever is missing.
 *
 * Public read is allowed on the `site` global, so `overrideAccess: false` lets
 * that access rule apply instead of bypassing it.
 */
export async function getSite(): Promise<SiteContent> {
  const payload = await getPayloadClient();
  const site = await payload.findGlobal({
    slug: "site",
    depth: 0,
    overrideAccess: false,
  });

  const labels = (items: { label?: string | null }[] | null | undefined) =>
    (items ?? []).map((item) => ({ label: item.label ?? "" }));

  const steps = (items: NonNullable<Site["services"]>["items"]) =>
    (items ?? []).map((item) => ({
      title: item.title ?? "",
      description: item.description ?? "",
      tools: labels(item.tools),
    }));

  return {
    seo: {
      title: site.seo?.title ?? "",
      description: site.seo?.description ?? "",
      keywords: site.seo?.keywords ?? "",
      ogImageUrl: site.seo?.ogImageUrl ?? "",
    },
    identity: {
      name: site.identity?.name ?? "",
      role: site.identity?.role ?? "",
      tagline: site.identity?.tagline ?? "",
      location: site.identity?.location ?? "",
      timezone: site.identity?.timezone ?? "",
      email: site.identity?.email ?? "",
      availabilityLabel: site.identity?.availabilityLabel ?? "",
      available: site.identity?.available ?? true,
      localTimeZone: site.identity?.localTimeZone ?? "",
      cvUrl: site.identity?.cvUrl ?? "",
      initials: site.identity?.initials ?? "",
      wordmark: site.identity?.wordmark ?? "",
      wordmarkAccent: site.identity?.wordmarkAccent ?? "",
    },
    hero: {
      eyebrow: site.hero?.eyebrow ?? "",
      headline: site.hero?.headline ?? "",
      headlineAccent: site.hero?.headlineAccent ?? "",
      intro: site.hero?.intro ?? "",
      primaryCta: site.hero?.primaryCta ?? "",
      secondaryCta: site.hero?.secondaryCta ?? "",
      marquee: labels(site.hero?.marquee),
    },
    stats: {
      eyebrow: site.stats?.eyebrow ?? "",
      note: site.stats?.note ?? "",
      items: (site.stats?.items ?? []).map((item) => ({
        value: item.value ?? 0,
        suffix: item.suffix ?? "",
        label: item.label ?? "",
      })),
    },
    projectsSection: {
      eyebrow: site.projectsSection?.eyebrow ?? "",
      heading: site.projectsSection?.heading ?? "",
      browseLabel: site.projectsSection?.browseLabel ?? "",
      emptyMessage: site.projectsSection?.emptyMessage ?? "",
      errorMessage: site.projectsSection?.errorMessage ?? "",
      inProgressLabel: site.projectsSection?.inProgressLabel ?? "",
    },
    services: {
      eyebrow: site.services?.eyebrow ?? "",
      heading: site.services?.heading ?? "",
      intro: site.services?.intro ?? "",
      items: steps(site.services?.items),
    },
    process: {
      eyebrow: site.process?.eyebrow ?? "",
      heading: site.process?.heading ?? "",
      items: steps(site.process?.items),
    },
    about: {
      eyebrow: site.about?.eyebrow ?? "",
      heading: site.about?.heading ?? "",
      bio: site.about?.bio ?? "",
      stackEyebrow: site.about?.stackEyebrow ?? "",
      stackNote: site.about?.stackNote ?? "",
      groups: (site.about?.groups ?? []).map((group) => ({
        title: group.title ?? "",
        span: group.span ?? "3",
        items: labels(group.items),
      })),
    },
    testimonials: {
      eyebrow: site.testimonials?.eyebrow ?? "",
      heading: site.testimonials?.heading ?? "",
      items: (site.testimonials?.items ?? []).map((item) => ({
        quote: item.quote ?? "",
        name: item.name ?? "",
        role: item.role ?? "",
        company: item.company ?? "",
      })),
    },
    github: {
      eyebrow: site.github?.eyebrow ?? "",
      heading: site.github?.heading ?? "",
      profileLabel: site.github?.profileLabel ?? "",
      profileUrl: site.github?.profileUrl ?? "",
      emptyMessage: site.github?.emptyMessage ?? "",
    },
    faq: {
      eyebrow: site.faq?.eyebrow ?? "",
      heading: site.faq?.heading ?? "",
      intro: site.faq?.intro ?? "",
      contactPrompt: site.faq?.contactPrompt ?? "",
      items: (site.faq?.items ?? []).map((item) => ({
        question: item.question ?? "",
        answer: item.answer ?? "",
      })),
    },
    now: {
      eyebrow: site.now?.eyebrow ?? "",
      items: (site.now?.items ?? []).map((item) => ({
        label: item.label ?? "",
        value: item.value ?? "",
        kind: item.kind ?? "text",
      })),
    },
    contact: {
      eyebrow: site.contact?.eyebrow ?? "",
      heading: site.contact?.heading ?? "",
      intro: site.contact?.intro ?? "",
      emailLabel: site.contact?.emailLabel ?? "",
      email: site.contact?.email ?? "",
      formEyebrow: site.contact?.formEyebrow ?? "",
      nameLabel: site.contact?.nameLabel ?? "",
      namePlaceholder: site.contact?.namePlaceholder ?? "",
      emailFieldLabel: site.contact?.emailFieldLabel ?? "",
      emailPlaceholder: site.contact?.emailPlaceholder ?? "",
      messageLabel: site.contact?.messageLabel ?? "",
      messagePlaceholder: site.contact?.messagePlaceholder ?? "",
      submitLabel: site.contact?.submitLabel ?? "",
      sendingLabel: site.contact?.sendingLabel ?? "",
      successMessage: site.contact?.successMessage ?? "",
      errorMessage: site.contact?.errorMessage ?? "",
      cvLabel: site.contact?.cvLabel ?? "",
      cvNote: site.contact?.cvNote ?? "",
    },
    nav: {
      items: (site.nav?.items ?? []).map((item) => ({
        label: item.label ?? "",
        href: item.href ?? "",
      })),
    },
    footer: {
      copyright: site.footer?.copyright ?? "",
      socials: (site.footer?.socials ?? []).map((item) => ({
        label: item.label ?? "",
        href: item.href ?? "",
      })),
    },
    projectPage: {
      backLabel: site.projectPage?.backLabel ?? "",
      archiveEyebrow: site.projectPage?.archiveEyebrow ?? "",
      archiveHeading: site.projectPage?.archiveHeading ?? "",
      archiveIntro: site.projectPage?.archiveIntro ?? "",
      printLabel: site.projectPage?.printLabel ?? "",
      emptyMessage: site.projectPage?.emptyMessage ?? "",
      problemLabel: site.projectPage?.problemLabel ?? "",
      roleLabel: site.projectPage?.roleLabel ?? "",
      outcomeLabel: site.projectPage?.outcomeLabel ?? "",
      timelineLabel: site.projectPage?.timelineLabel ?? "",
      stackLabel: site.projectPage?.stackLabel ?? "",
      liveLabel: site.projectPage?.liveLabel ?? "",
      codeLabel: site.projectPage?.codeLabel ?? "",
      galleryEmpty: site.projectPage?.galleryEmpty ?? "",
      metaClientLabel: site.projectPage?.metaClientLabel ?? "",
      metaTypeLabel: site.projectPage?.metaTypeLabel ?? "",
      metaStatusLabel: site.projectPage?.metaStatusLabel ?? "",
      backToProjectsLabel: site.projectPage?.backToProjectsLabel ?? "",
    },
    projectsPrint: {
      eyebrow: site.projectsPrint?.eyebrow ?? "",
      headline: site.projectsPrint?.headline ?? "",
      profileHeading: site.projectsPrint?.profileHeading ?? "",
      stackHeading: site.projectsPrint?.stackHeading ?? "",
      workHeading: site.projectsPrint?.workHeading ?? "",
      footerNote: site.projectsPrint?.footerNote ?? "",
    },
  };
}
