export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', // Use current date or a fixed date
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster reads
  token: process.env.SANITY_API_TOKEN, // Optional: for authenticated requests
};
