import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling pdf-parse / pdfjs-dist so the
  // pdf.worker.mjs dynamic import resolves correctly at runtime.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],

  // Allow large file uploads (up to 50 MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "52mb",
    },
  },
};

export default nextConfig;
