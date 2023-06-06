/** @type {import('next').NextConfig} */
const path = require("path");
require("dotenv-mono").load();
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  staticPageGenerationTimeout: 5000,
  compiler: {
    styledComponents: true,
  },
  images: { domains: ["bikebook-prod.s3.eu-west-2.amazonaws.com"], unoptimized: true },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    largePageDataBytes: 128 * 100000,
    // strictNextHead: true,
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env && process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
