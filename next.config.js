// File location: /next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Using the stable version of these features
  experimental: {
    serverActions: true,
  },
  // Improved error handling for SSR
  onDemandEntries: {
    // Keep the build page in memory for longer for better dev experience
    maxInactiveAge: 25 * 1000,
    // Poll for changes more frequently
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;