/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep any existing configurations you have...
  reactStrictMode: true, // Example existing config

  // Add the rewrites configuration
  async rewrites() {
    return [
      {
        // Source path: Matches /treatments/ followed by a single slug segment
        source: '/treatments/:categorySlug',
        // Destination path: Maps to the treatments page with a query parameter
        destination: '/treatments?category=:categorySlug', 
      },
      // You can add other rewrite rules here if needed
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