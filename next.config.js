/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  reactStrictMode: true,
  transpilePackages: ['@wisp-cms/client'],
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    domains: ["upcdn.io", "replicate.delivery", "lh3.googleusercontent.com","cdn.picsart.io"],
    unoptimized: true,
  },

  webpack: (config, { isServer }) => {
    if (!isServer && !isProduction) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        tls: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/blogsitemap.xml',
        destination: '/api/blogsitemap',
      },
    ];
  },
};