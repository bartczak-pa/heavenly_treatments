import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      'clsx'
    ]
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
    ],
  },
  redirects: async () => [
    // ===========================================
    // SPECIFIC QUERY PARAM REDIRECTS (must be first)
    // Handle legacy query params that don't match current category slugs
    // ===========================================
    {
      source: '/treatments',
      has: [{ type: 'query', key: 'category', value: 'massage' }],
      destination: '/treatments/massages',
      permanent: true,
    },
    {
      source: '/treatments',
      has: [{ type: 'query', key: 'category', value: 'seasonal-treatments' }],
      destination: '/treatments/holistic-treatments',
      permanent: true,
    },
    // Generic query param redirect (catches all other categories)
    {
      source: '/treatments',
      has: [{ type: 'query', key: 'category', value: '(?<cat>.*)' }],
      destination: '/treatments/:cat',
      permanent: true,
    },

    // ===========================================
    // SLUG MISMATCH REDIRECTS
    // Old/incorrect slugs → correct current slugs
    // ===========================================
    {
      source: '/treatments/massage',
      destination: '/treatments/massages',
      permanent: true,
    },
    {
      source: '/treatments/seasonal-treatments',
      destination: '/treatments/holistic-treatments',
      permanent: true,
    },
    {
      source: '/treatments/hollistic-treatments',
      destination: '/treatments/holistic-treatments',
      permanent: true,
    },

    // ===========================================
    // LEGACY ROOT-LEVEL URL REDIRECTS
    // Old site structure → new path-based URLs
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
      destination: '/treatments/holistic-treatments',
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

// Configure bundle analyzer
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

// Use ES Module export syntax
export default bundleAnalyzer(nextConfig); 