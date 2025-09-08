/* eslint-disable */
/* prettier-ignore */
/** @generated — Auto-generated. DO NOT EDIT. */
// Auto-generated image metadata for optimization
// This file contains blur placeholders and responsive image data

export interface ImageMetadata {
  src: string;
  blurDataURL?: string;
  width: number;
  height: number;
  sizes: number[];
  priority?: boolean;
}

export const imageMetadata: Record<string, ImageMetadata> = {
  'bacial': {
    src: "/images/optimized/bacial.webp",
    blurDataURL: "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAsABUB8JZgCw7Ef5ZJMUIAA/qN61C70zJ/cpoQi4JpdHF33YZ7867kqFEN1PWoXthWbmWC9j1139fAAAA==",
    width: 6000,
    height: 4000,
    sizes: [320, 640, 1024, 1280, 1536, 1920],
    priority: false
  },
  'person_having_reflexology_treatment': {
    src: "/images/optimized/person_having_reflexology_treatment.webp",
    blurDataURL: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAQCdASoQAAsABUB8JZgC7AC3iMYZE4AA9n9gIMFwnJ+OJtT7JuLawSVXTLYnOQUw0RytDe2gDyQYm2AZLQqAQeaAb2mWWUVOAAAA",
    width: 6000,
    height: 4000,
    sizes: [320, 640, 1024, 1280, 1536, 1920],
    priority: false
  },
  'young-woman-having-face-massage-relaxing-spa-salon': {
    src: "/images/optimized/young-woman-having-face-massage-relaxing-spa-salon.webp",
    blurDataURL: "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQAgCdASoQAAsABUB8JZgCdAEfB6BK/6NgAN5e5+n/bCmizk6oM0/HdnJV70YsINnSnfOLB5RrZ5K35nK2hgWIACrtNUPo1WaA/AFpDuh/GYAA",
    width: 7360,
    height: 4912,
    sizes: [320, 640, 1024, 1280, 1536, 1920],
    priority: true
  },
  'woman-salon-making-beauty-treatment-with-gua-sha-stone': {
    src: "/images/optimized/woman-salon-making-beauty-treatment-with-gua-sha-stone.webp",
    blurDataURL: "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAAAQAgCdASoQAAsABUB8JZgCdAEVYQOOR+aAAP6NphZryQiNEOLTMEWVc4YWU1uLQP7XroqGFqVwAA==",
    width: 6720,
    height: 4480,
    sizes: [320, 640, 1024, 1280, 1536, 1920],
    priority: false
  },
  'heavenly-treatments-room': {
    src: "/images/optimized/heavenly-treatments-room.webp",
    blurDataURL: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAACwAQCdASoQAAwABUB8JZQAAaNvPOCAAP0fCOe5Jw6X5ivBKPrCC2erooSz8cQlL/HZ8p0TpzA+9Kr3wAA=",
    width: 2500,
    height: 1882,
    sizes: [320, 640, 1024, 1280, 1536, 1920],
    priority: false
  },
  'owner-of-heavenly-treatments': {
    src: "/images/optimized/owner-of-heavenly-treatments.webp",
    blurDataURL: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAQCdASoMABAABUB8JYgCdADWaHEAAPaZHYq4OMQAtqekZy8F2W/8LJ1rNmRRVS253sM75Z4a6iISp2m58FwslZ0GWqAA",
    width: 1095,
    height: 1454,
    sizes: [320, 640, 1024],
    priority: false
  }
};

// Helper function to get image metadata by filename or path
export function getImageMetadata(src: string): ImageMetadata | undefined {
  if (!src) return undefined;
  
  // Skip external URLs, data URLs, and protocol-relative URLs
  if (/^(?:https?:|data:|\/)/.test(src)) return undefined;
  
  // Extract filename from full path if needed
  const filename = src.includes('/') ? src.split('/').pop() || '' : src;
  
  // Remove extension to get the key
  const key = filename.replace(/\.[^.]+$/, '');
  return imageMetadata[key];
}

// Helper to extract filename from full path for metadata lookup
export function extractFilenameFromPath(imagePath: string): string {
  if (!imagePath) return '';
  return imagePath.split('/').pop()?.split('.')[0] || '';
}
