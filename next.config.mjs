/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

// Use ES Module export syntax
export default nextConfig; 