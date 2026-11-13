import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Keep links from the old WordPress site (and Google results) working.
  async redirects() {
    return [
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/contact-us/", destination: "/contact", permanent: true },
      { source: "/gallery", destination: "/story", permanent: true },
      { source: "/gallery/", destination: "/story", permanent: true },
      { source: "/author/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
