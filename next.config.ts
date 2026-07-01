import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-toast',
      'class-variance-authority',
      'clsx',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 640, 1024, 1280, 1536, 1920],
    imageSizes: [320, 640, 1024],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'www.heavenly-treatments.co.uk',
      },
    ],
  },
  redirects: async () => [
    // ===========================================
    // SPECIFIC QUERY PARAM REDIRECTS (must be first)
    // ===========================================
    {
      source: '/treatments',
      has: [{ type: 'query', key: 'category', value: 'massage' }],
      destination: '/treatments/massages',
      permanent: true,
    },
    {
      source: '/treatments',
      has: [{ type: 'query', key: 'category', value: 'holistic-treatments' }],
      destination: '/treatments/seasonal-treatments',
      permanent: true,
    },
    {
      source: '/treatments',
      has: [{ type: 'query', key: 'category', value: '(?<cat>.*)' }],
      destination: '/treatments/:cat',
      permanent: true,
    },

    // ===========================================
    // SLUG MISMATCH REDIRECTS
    // ===========================================
    {
      source: '/treatments/massage',
      destination: '/treatments/massages',
      permanent: true,
    },
    {
      source: '/treatments/holistic-treatments',
      destination: '/treatments/seasonal-treatments',
      permanent: true,
    },
    {
      source: '/treatments/hollistic-treatments',
      destination: '/treatments/seasonal-treatments',
      permanent: true,
    },

    // ===========================================
    // LEGACY ROOT-LEVEL URL REDIRECTS
    // ===========================================
    {
      source: '/homepage',
      destination: '/',
      permanent: true,
    },
    {
      source: '/facials',
      destination: '/treatments/facials',
      permanent: true,
    },
    {
      source: '/seasonal-treatments',
      destination: '/treatments/seasonal-treatments',
      permanent: true,
    },
    {
      source: '/reflexology',
      destination: '/treatments/reflexology',
      permanent: true,
    },
    {
      source: '/massage-kelso-scottish-borders',
      destination: '/treatments/massages',
      permanent: true,
    },
    {
      source: '/body-treatments',
      destination: '/treatments/body-treatments',
      permanent: true,
    },
    {
      source: '/book-treatments',
      destination: '/treatments',
      permanent: true,
    },
  ],
};

// Only wrap with bundle analyzer when explicitly analyzing — avoids injecting
// a webpack() callback during normal Turbopack dev runs.
export default process.env.ANALYZE === 'true'
  ? withBundleAnalyzer({ enabled: true, openAnalyzer: false })(nextConfig)
  : nextConfig;
