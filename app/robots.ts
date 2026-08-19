import { MetadataRoute } from 'next';

/**
 * Generates robots.txt for search engine crawlers.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  // Use fallback to maintain consistency with other files in the codebase
  // (app/page.tsx, app/treatments/[categorySlug]/page.tsx, lib/jsonLsUtils.ts)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.heavenly-treatments.co.uk';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
