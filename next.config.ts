import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  transpilePackages: ["three", "@react-three/postprocessing", "postprocessing"],
};

export default nextConfig;
