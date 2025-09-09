const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;
