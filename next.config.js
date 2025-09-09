const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude the functions directory from webpack processing
    config.watchOptions = {
      ignored: ['**/functions/**', '**/node_modules/**']
    };
    return config;
  },
  // Exclude functions directory from builds
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./functions/**/*'],
    },
  },
};

module.exports = withPWA(nextConfig);
