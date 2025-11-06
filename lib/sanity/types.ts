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
}
