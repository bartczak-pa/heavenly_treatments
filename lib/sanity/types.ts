import { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Sanity response types
 */
export interface SanityTreatmentCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: SanityImageSource;
  iconName?: string;
  displayOrder?: number;
}

/**
 * Lean Sanity response for the lazy-loaded treatments accordion menu.
 * Only the fields an accordion row needs — no image asset (rows are text-only).
 */
export interface SanityTreatmentMenuItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  price: string;
  categorySlug: string;
}

export interface SanityTreatment {
  _id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  price: string;
  keyFeatures?: string[];
  image: SanityImageSource;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  freshaUrl?: string;
}
