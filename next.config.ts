import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoids Next.js mis-detecting the workspace root from an unrelated
  // package-lock.json in the user's home directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
