import type { NextConfig } from "next";

const webpack = (config: any, { dev }: { dev: boolean }) => {
  if (dev) {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/.next/**",
      ],
      aggregateTimeout: 500,
      ...(process.env.NEXT_DEV_POLL === "1"
        ? { poll: 1000 }
        : {}),
    };
  }
  return config;
}

const nextConfig: NextConfig = {
  webpack: process.env.NODE_ENV === "production" ? undefined : webpack,
};

export default nextConfig;
