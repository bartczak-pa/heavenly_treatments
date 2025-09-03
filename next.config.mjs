/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment-specific HSTS
  async headers() {
    const env = process.env.NODE_ENV;
    if (env === 'development') {
      return [
        {
          source: '/(.*)',
          headers: [{ key: 'Strict-Transport-Security', value: 'max-age=0' }],
        },
      ];
    }
    if (env === 'production') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
          ],
        },
      ];
    }
    return [];
  },
  
  // Image optimization configuration
  images: {
    // Modern image formats - order matters (AVIF preferred, WebP fallback)
    formats: ['image/avif', 'image/webp'],
    
    // Device breakpoints for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for smaller images (icons, thumbnails)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Quality levels - optimize for performance vs. visual quality
    qualities: [25, 50, 75, 90],
    
    // Cache optimized images for 31 days
    minimumCacheTTL: 2678400,
    
    // Allow local images from these patterns
    localPatterns: [
      {
        pathname: '/images/**',
        search: '',
      },
    ],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
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