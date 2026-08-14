/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    domains: ['firebasestorage.googleapis.com', 'oaidalleapiprodscus.blob.core.windows.net'],
  },
};
module.exports = nextConfig;