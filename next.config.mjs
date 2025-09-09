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
    imageSizes: [320, 640, 1024, 1280, 1536, 1920],
  },
  async rewrites() {
    return [
      {
        source: '/treatments/:categorySlug',
        destination: '/treatments?category=:categorySlug', 
      },
    ];
  },
  redirects: async () => [
    {
      source: '/treatments/hollistic-treatments',
      destination: '/treatments/holistic-treatments',
      permanent: true,
    },
    {
      source: '/treatments',
      has: [
        { type: 'query', key: 'category', value: 'hollistic-treatments' }
      ],
      destination: '/treatments?category=holistic-treatments',
      permanent: true,
    },
    {
      source: '/facials',
      destination: '/treatments?category=facials',
      permanent: true,
    },
    {
      source: '/seasonal-treatments',
      destination: '/treatments?category=seasonal-treatments',
      permanent: true,
    },
    {
      source: '/reflexology',
      destination: '/treatments?category=reflexology',
      permanent: true,
    },
    {
      source: '/massage-kelso-scottish-borders',
      destination: '/treatments?category=massage',
      permanent: true,
    },
    {
      source: '/body-treatments',
      destination: '/treatments?category=body-treatments',
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