import "../globals.css";
import type { Metadata } from "next";
import { cache } from "react";
import { Space_Grotesk, DM_Sans, Space_Mono } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollProgress from "@/components/scroll-progress";
import ReadingProgressRail from "@/components/reading-progress-rail";
import SkipLink from "@/components/skip-link";
import CommandPalette from "@/components/command-palette";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";
import { getAllProjects } from "@/lib/cms/get-projects";
import { getSite } from "@/lib/cms/get-site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "https://zdnemz.vercel.app";

/** Metadata and the layout body share one CMS read per request. */
const loadSite = cache(getSite);

/**
 * CMS-driven metadata, so an admin edit to SEO copy lands without a rebuild.
 * `generateMetadata` (not a static `metadata` export) because the values come
 * from the database.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await loadSite();
  const title = site.seo.title || site.identity.name;
  const description = site.seo.description;
  const image = site.seo.ogImageUrl || "/api/og";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: site.seo.keywords,
    authors: [{ name: site.identity.name }],
    creator: site.identity.name,
    robots: "index, follow",
    icons: { icon: "/favicon.ico" },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: site.identity.name,
      images: [
        { url: image, width: 1200, height: 630, alt: site.identity.name },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, projects] = await Promise.all([loadSite(), getAllProjects()]);

  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${spaceMono.variable} font-sans min-h-[100dvh] flex flex-col`}
      >
        <SkipLink />
        <ScrollProgress />
        <ReadingProgressRail site={site} />
        <CommandPalette site={site} projects={projects} />
        <KeyboardShortcuts site={site} />
        <Navbar site={site} />
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer site={site} />
      </body>
    </html>
  );
}
