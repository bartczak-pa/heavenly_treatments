import { sanityClient } from '@/lib/sanity/client';
import {
  allCategoriesQuery,
  allTreatmentsQuery,
  treatmentBySlugQuery,
  treatmentsByCategoryQuery,
  allTreatmentSlugsQuery,
  categoryBySlugQuery,
} from '@/lib/sanity/queries';
import { getImageUrl } from '@/lib/sanity/image';
import {
  SanityTreatment,
  SanityTreatmentCategory,
} from '@/lib/sanity/types';
import {
  Treatment,
  TreatmentCategory,
  TreatmentCategorySlug,
} from '@/lib/data/treatments';

/**
 * Transform Sanity category to app category format
 */
function transformCategory(
  sanityCategory: SanityTreatmentCategory
): TreatmentCategory {
  return {
    id: sanityCategory._id,
    slug: sanityCategory.slug as TreatmentCategorySlug,
    name: sanityCategory.name,
    description: sanityCategory.description,
    shortDescription: sanityCategory.shortDescription,
    image: getImageUrl(sanityCategory.image, 800, undefined, 90),
    iconName: sanityCategory.iconName,
  };
}

/**
 * Transform Sanity treatment to app treatment format
 */
function transformTreatment(sanityTreatment: SanityTreatment): Treatment {
  return {
    id: sanityTreatment._id,
    title: sanityTreatment.title,
    slug: sanityTreatment.slug,
    description: sanityTreatment.description,
    duration: sanityTreatment.duration,
    price: sanityTreatment.price,
    keyFeatures: sanityTreatment.keyFeatures,
    image: getImageUrl(sanityTreatment.image, 1000, undefined, 90),
    imageWidth: 1000,
    imageHeight: 667,
    category: sanityTreatment.category.slug as TreatmentCategorySlug,
  };
}

/**
 * Fetch all treatment categories from Sanity
 */
export async function getCategories(): Promise<TreatmentCategory[]> {
  try {
    const categories =
      await sanityClient.fetch<SanityTreatmentCategory[]>(allCategoriesQuery);
    return categories.map(transformCategory);
  } catch (error) {
    console.error('Error fetching categories from Sanity:', error);
    return [];
  }
}

/**
 * Fetch a single category by slug from Sanity
 */
export async function getCategoryBySlug(
  slug: string
): Promise<TreatmentCategory | null> {
  try {
    const category = await sanityClient.fetch<SanityTreatmentCategory>(
      categoryBySlugQuery,
      { slug }
    );
    return category ? transformCategory(category) : null;
  } catch (error) {
    console.error('Error fetching category from Sanity:', error);
    return null;
  }
}

/**
 * Fetch all treatments from Sanity
 */
export async function getTreatments(): Promise<Treatment[]> {
  try {
    const treatments =
      await sanityClient.fetch<SanityTreatment[]>(allTreatmentsQuery);
    return treatments.map(transformTreatment);
  } catch (error) {
    console.error('Error fetching treatments from Sanity:', error);
    return [];
  }
}

/**
 * Fetch a single treatment by slug from Sanity
 */
export async function getTreatmentBySlug(
  slug: string
): Promise<Treatment | undefined> {
  try {
    const treatment = await sanityClient.fetch<SanityTreatment>(
      treatmentBySlugQuery,
      { slug }
    );
    return treatment ? transformTreatment(treatment) : undefined;
  } catch (error) {
    console.error('Error fetching treatment from Sanity:', error);
    return undefined;
  }
}

/**
 * Fetch treatments by category slug from Sanity
 */
export async function getTreatmentsByCategory(
  categorySlug: TreatmentCategorySlug
): Promise<Treatment[]> {
  try {
    const treatments = await sanityClient.fetch<SanityTreatment[]>(
      treatmentsByCategoryQuery,
      { categorySlug }
    );
    return treatments.map(transformTreatment);
  } catch (error) {
    console.error('Error fetching treatments by category from Sanity:', error);
    return [];
  }
}

/**
 * Get all treatment slugs for static path generation
 */
export async function getAllTreatmentSlugs(): Promise<
  Array<{ slug: string; categorySlug: string }>
> {
  try {
    return await sanityClient.fetch(allTreatmentSlugsQuery);
  } catch (error) {
    console.error('Error fetching treatment slugs from Sanity:', error);
    return [];
  }
}

/**
 * Construct the URL path for a treatment
 */
export function getTreatmentPath(
  treatment: Pick<Treatment, 'category' | 'slug'>
): string {
  return `/treatments/${treatment.category}/${treatment.slug}`;
}
