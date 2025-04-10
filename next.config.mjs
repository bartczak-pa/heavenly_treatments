/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep any existing configurations you have...
  reactStrictMode: true, // Example existing config

  // Add the rewrites configuration
  async rewrites() {
    return [
      {
        // Source path: Matches /treatments/ followed by any slug
        source: '/treatments/:categorySlug*',
        // Destination path: Maps to the treatments page with a query parameter
        destination: '/treatments?category=:categorySlug*', 
      },
      // You can add other rewrite rules here if needed
    ];
  },
};

// Use ES Module export syntax
export default nextConfig; 