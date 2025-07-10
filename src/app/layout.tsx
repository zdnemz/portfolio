import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Zidane | Frontend Developer",
  description:
    "Hi, I'm Zidane – a frontend developer crafting modern, responsive, and interactive web experiences.",
  keywords: [
    "Frontend Developer",
    "Zidane",
    "React",
    "Next.js",
    "Portfolio",
    "Web Developer",
  ],
  authors: [{ name: "ZidaneMZ", url: "https://zdnemz.vercel.app" }],
  creator: "ZidaneMZ",
  metadataBase: new URL("https://zdnemz.vercel.app"),
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Zidane | Frontend Developer",
    description:
      "Explore Zidane's developer portfolio showcasing projects, elegant UI, and modern frontend technologies.",
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
    title: "Zidane | Frontend Developer",
    description:
      "Explore my portfolio – built with Next.js, Tailwind, and love for clean UI.",
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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
