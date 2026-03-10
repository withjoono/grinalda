const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    scope: '/',
    sw: './sw.js',
    importScripts: ['./worker/handlepush.js'],
    register: true,
    skipWaiting: true,
  },
  images: {
    domains: ['img.ingipsy.com'],
  },
  eslint: {
    dirs: ['comp', 'contexts', 'lib', 'pages', 'styles'],
    ignoreDuringBuilds: true,
  },
  webpack(config, options) {
    if (!options.isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.dns = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.tls = false;
      config.resolve.fallback['pg-native'] = false;
    }

    return config;
  },
});
