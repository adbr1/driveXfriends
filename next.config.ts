import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["motion", "three", "@react-three/fiber"],
  },
};

export default nextConfig;
