/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  experimental: {
    // Each locale has its own root layout, so there is no app/layout.js to wrap
    // the 404; app/global-not-found.js brings its own <html lang="ja"> and head.
    globalNotFound: true,
  },
};

export default nextConfig;
