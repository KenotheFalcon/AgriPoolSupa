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
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/functions': false,
    };
    
    // Ignore functions directory entirely
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
  // Add pageExtensions to ignore functions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Transpile only src directory
  transpilePackages: [],
};

module.exports = withPWA(nextConfig);
