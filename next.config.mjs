import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const nextConfig = {
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Add custom webpack configurations here
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve("src"),
    };

    return config;
  },
  reactStrictMode: false,
  typescript: {
    // Ignore TypeScript errors during the build process
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["t1.daumcdn.net"],
  },
};

export default nextConfig;