import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Zidane | Web3 Developer & Smart Contract Engineer",
  description:
    "Web3 developer and smart contract engineer building secure, decentralized applications and blockchain protocols with a focus on correctness and trust minimization.",
  keywords: [
    "Web3 Developer",
    "Smart Contract Engineer",
    "Zidane",
    "Blockchain",
    "Solidity",
    "Ethereum",
    "DeFi",
    "dApp",
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
    title: "Zidane | Web3 Developer & Smart Contract Engineer",
    description:
      "Explore the portfolio of Zidane, a Web3 developer specializing in smart contracts, decentralized systems, and secure blockchain architecture.",
    url: "https://zdnemz.vercel.app",
    siteName: "Zidane Web3 Portfolio",
    images: [
      {
        url: "https://zdnemz.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "Zidane Web3 Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zidane | Web3 Developer & Smart Contract Engineer",
    description:
      "Building secure, decentralized systems with Solidity and modern Web3 tooling.",
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
