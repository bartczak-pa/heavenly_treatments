import { MetadataRoute } from 'next';
import { getSitemapCategories, getSitemapTreatments } from '@/lib/cms/treatments';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  if (!BASE_URL) {
    console.warn('WARN: NEXT_PUBLIC_BASE_URL environment variable is not set. Sitemap URLs will be relative.');
  }
  const baseUrlOrDefault = BASE_URL || '';

  // A single timestamp for statically-authored pages. These change on deploy,
  // not per-crawl, so one shared build date is more honest than stamping
  // `new Date()` onto every URL (which trains crawlers to ignore <lastmod>).
  const buildDate = new Date().toISOString();

  // High-value marketing pages
  const primaryRoutes = [
    '', // Homepage
    '/about',
    '/treatments',
    '/contact',
  ].map((route) => ({
    url: `${baseUrlOrDefault}${route}`,
    lastModified: buildDate,
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Legal / policy pages — indexable and footer-linked, low priority
  const legalRoutes = [
    '/privacy-policy',
    '/terms',
    '/cookie-policy',
  ].map((route) => ({
    url: `${baseUrlOrDefault}${route}`,
    lastModified: buildDate,
    changeFrequency: 'yearly' as const,
    priority: 0.2,
  }));

  // Dynamic treatment pages — real last-modified from Sanity `_updatedAt`
  const treatments = await getSitemapTreatments();
  const treatmentRoutes = treatments.map((treatment) => ({
    url: `${baseUrlOrDefault}/treatments/${treatment.categorySlug}/${treatment.slug}`,
    lastModified: treatment._updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const categories = await getSitemapCategories();
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrlOrDefault}/treatments/${category.slug}`,
    lastModified: category._updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...primaryRoutes, ...legalRoutes, ...treatmentRoutes, ...categoryRoutes];
}
