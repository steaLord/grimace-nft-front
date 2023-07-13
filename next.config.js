/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      bufferutil: false,
      "utf-8-validate": false,
      encoding: false,
    };
    return config;
  },
};

module.exports = nextConfig;
