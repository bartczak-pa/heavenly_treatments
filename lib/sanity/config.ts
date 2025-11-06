/**
 * Sanity CMS Configuration
 *
 * Optimized for performance with CDN enabled in production.
 * CDN usage provides:
 * - Faster query response times (~50-100ms vs ~500ms)
 * - Reduced server load
 * - Better reliability with global edge caching
 * - Automatic request deduplication
 */
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-11-06', // Fixed API version for stability
  useCdn: process.env.NODE_ENV === 'production', // Enable CDN in production for optimal performance
  token: process.env.SANITY_API_TOKEN, // API token for authenticated requests (write operations)
};
