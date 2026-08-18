import "./globals.css";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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
  icons: {
    icon: "/favicon.ico",
  },
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
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} font-sans min-h-[100dvh] flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
