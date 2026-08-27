import "./globals.css";
import { Space_Grotesk, DM_Sans, Space_Mono } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollProgress from "@/components/scroll-progress";
import ReadingProgressRail from "@/components/reading-progress-rail";
import SkipLink from "@/components/skip-link";
import { ThemeProvider } from "@/components/theme-provider";
import CommandPalette from "@/components/command-palette";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";

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

export const metadata = {
  title: "Maulana Zidane | Fullstack Engineer",
  description:
    "Fullstack engineer specializing in TypeScript, Next.js, and Hono. Shipping production web apps from schema to deploy, with tests and CI on every push.",
  keywords: [
    "Fullstack Engineer",
    "Next.js Developer",
    "TypeScript",
    "Hono",
    "React Developer",
    "Software Engineer",
    "Maulana Zidane",
    "Portfolio",
  ],
  authors: [{ name: "Maulana Zidane", url: "https://zdnemz.vercel.app" }],
  creator: "Maulana Zidane",
  metadataBase: new URL("https://zdnemz.vercel.app"),
  robots: "index, follow",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Maulana Zidane | Fullstack Engineer",
    description:
      "Fullstack engineer building production web apps with Next.js, Hono, and PostgreSQL.",
    url: "https://zdnemz.vercel.app",
    siteName: "Maulana Zidane",
    images: [
      {
        url: "https://zdnemz.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "Maulana Zidane, Fullstack Engineer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maulana Zidane | Fullstack Engineer",
    description:
      "Fullstack engineer building production web apps with Next.js, Hono, and PostgreSQL.",
    images: ["https://zdnemz.vercel.app/api/og"],
    creator: "@zdnemz",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${spaceMono.variable} font-sans min-h-[100dvh] flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SkipLink />
          <ScrollProgress />
          <ReadingProgressRail />
          <CommandPalette />
          <KeyboardShortcuts />
          <Navbar />
          <main id="main-content" className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
