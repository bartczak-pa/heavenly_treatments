import { MetadataRoute } from 'next';
import { getCategories, getTreatments } from '@/lib/cms/treatments';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  if (!BASE_URL) {
    console.warn('WARN: NEXT_PUBLIC_BASE_URL environment variable is not set. Sitemap URLs will be relative.');
  }
  const baseUrlOrDefault = BASE_URL || '';

  // Static pages
  const staticRoutes = [
    '', // Homepage
    '/about',
    '/treatments',
    '/contact',
  ].map((route) => ({
    url: `${baseUrlOrDefault}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic treatment pages
  const treatments = await getTreatments();
  const treatmentRoutes = treatments.map((treatment) => ({
    url: `${baseUrlOrDefault}/treatments/${treatment.category}/${treatment.slug}`,
    lastModified: new Date().toISOString(), // Consider using a date from your data if available
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));


  const categories = await getCategories();
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrlOrDefault}/treatments/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...treatmentRoutes, ...categoryRoutes];
}
