import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow large file uploads (up to 50 MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "52mb",
    },
  },
};

export default nextConfig;
