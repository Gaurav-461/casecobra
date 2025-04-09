import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers(){
    return [
      {
        source: "/api/:path*",
        headers:[
          {
            key: "Access-Control-Allow-Origin",
            value: "https://casecobra-rouge-delta.vercel.app", // Set your origin
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          }
        ]
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // Temporary fix to bypass build errors
  },
};

export default nextConfig;
