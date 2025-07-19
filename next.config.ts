import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts", "api.ts", "api.tsx"],
};

export default nextConfig;
