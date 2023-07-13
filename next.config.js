/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    responseLimit: "50mb",
    bodyParser: {
      sizeLimit: "50mb",
    },
    timeout: 120000,
  },
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
