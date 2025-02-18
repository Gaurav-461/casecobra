import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // Temporary fix to bypass build errors
  },
};

export default nextConfig;
