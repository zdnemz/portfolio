import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Zidane | Creative Frontend Developer",
  description:
    "frontend developer crafting immersive, high-performance web experiences with React, Next.js, and WebGL.",
  keywords: [
    "Frontend Developer",
    "Zidane",
    "React",
    "Next.js",
    "Three.js",
    "Creative Developer",
    "Portfolio",
  ],
  authors: [{ name: "ZidaneMZ", url: "https://zdnemz.vercel.app" }],
  creator: "ZidaneMZ",
  metadataBase: new URL("https://zdnemz.vercel.app"),
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Zidane | Creative Frontend Developer",
    description:
      "Explore the portfolio of Zidane, a developer focused on modern UI/UX, animations, and interactive web design.",
    url: "https://zdnemz.vercel.app",
    siteName: "Zidane Portfolio",
    images: [
      {
        url: "https://zdnemz.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "Zidane Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zidane | Creative Frontend Developer",
    description:
      "Crafting immersive web experiences with Next.js and Three.js.",
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
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
