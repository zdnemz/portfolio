import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Notion serves uploaded files from S3 behind signed, expiring URLs.
    // `images.domains` is deprecated in Next 16 — remotePatterns replaces it.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      { protocol: "https", hostname: "secure.notion-static.com" },
      { protocol: "https", hostname: "www.notion.so" },
    ],
  },
};

export default nextConfig;
