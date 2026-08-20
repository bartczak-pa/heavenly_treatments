import { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Sanity promotional offer document type
 */
export interface SanityPromotionalOffer {
  _id: string;
  title: string;
  description: string;
  image?: SanityImageSource & { alt?: string };
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  dismissDurationDays: number;
  displayDelaySeconds: number;
}

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

/**
 * Sanity testimonial document type
 */
export interface SanityTestimonial {
  _id: string;
  name: string;
  quote: string;
  customerType?: string;
  rating?: number;
  displayOrder?: number;
}

export interface SanityTreatment {
  _id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  price: string;
  keyFeatures?: string[];
  benefits?: string[];
  whatToExpect?: Array<{ title: string; description: string }>;
  whatIsIncluded?: string[];
  goodFor?: string;
  image: SanityImageSource;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  freshaUrl?: string;
  devOnly?: boolean;
}
