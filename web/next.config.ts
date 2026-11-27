import type { NextConfig } from "next";

// Static export for GitHub Pages: the built site lives at /hamtercocol/next/ next to the old slime.html.
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/hamtercocol/next",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
