/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["fabric"],
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.externals = [...config.externals, "canvas", "jsdom"];
    config.resolve.alias["fabric"] = "fabric/dist/fabric.js";
    if (!isServer) {
      config.resolve.alias["fabric"] = "fabric/dist/fabric.js";
    }
    return config;
  },
};

module.exports = nextConfig;
