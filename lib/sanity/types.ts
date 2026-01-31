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
