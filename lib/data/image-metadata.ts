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
    blurDataURL: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACQAQCdASoIAAUAB0CWJQAAU01/LmAA8k5SgRYelMDYL4CtzQAAAA==",
    width: 6000,
    height: 4000,
    sizes: [320, 640, 1024, 1280, 1536, 1920],
    priority: false
  },
  'person_having_reflexology_treatment': {
    src: "/images/optimized/person_having_reflexology_treatment.webp",
    blurDataURL: "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAACwAQCdASoIAAUAB0CWJQBdgB6EGJGAANzXOW5xhqRbugS8eq9Dzla8U/0YAA==",
    width: 6000,
    height: 4000,
    sizes: [320, 640, 1024, 1280, 1536, 1920],
    priority: false
  },
  'young-woman-having-face-massage-relaxing-spa-salon': {
    src: "/images/optimized/young-woman-having-face-massage-relaxing-spa-salon.webp",
    blurDataURL: "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAACQAQCdASoIAAUAB0CWJQBOgBsywWgA/I35jc7+l75WC+udyUV76urGFUggAA==",
    width: 7360,
    height: 4912,
    sizes: [320, 640, 1024, 1280, 1536, 1920],
    priority: true
  },
  'woman-salon-making-beauty-treatment-with-gua-sha-stone': {
    src: "/images/optimized/woman-salon-making-beauty-treatment-with-gua-sha-stone.webp",
    blurDataURL: "data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACQAQCdASoIAAUAB0CWJQBOgBuhgKAA/o3K5B/o113I0jbUAAA=",
    width: 6720,
    height: 4480,
    sizes: [320, 640, 1024, 1280, 1536, 1920],
    priority: false
  },
  'heavenly-treatments-room': {
    src: "/images/optimized/heavenly-treatments-room.webp",
    blurDataURL: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACQAQCdASoIAAYAB0CWJQAAS4g6/wAA9WQTH2Q3zkELFa7uaAAAAA==",
    width: 2500,
    height: 1882,
    sizes: [320, 640, 1024, 1280, 1536, 1920],
    priority: false
  },
  'owner-of-heavenly-treatments': {
    src: "/images/optimized/owner-of-heavenly-treatments.webp",
    blurDataURL: "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAADQAQCdASoGAAgAB0CWJQBOgCLvytcV4ADNltKojQLO5JJPCqJUHYlHAAA=",
    width: 1095,
    height: 1454,
    sizes: [320, 640, 1024],
    priority: false
  }
};

// Cache for processed keys to avoid repeated string operations
const keyCache = new Map<string, string | null>();

// Helper function to get image metadata by src/filename/path/URL
export function getImageMetadata(src: string): ImageMetadata | undefined {
  if (!src) return undefined;
  
  // Skip external URLs, data URLs, and protocol-relative URLs
  if (/^(?:https?:|data:|\/\/)/i.test(src)) return undefined;
  
  // Check cache first
  const cachedKey = keyCache.get(src);
  if (cachedKey !== undefined) {
    return cachedKey ? imageMetadata[cachedKey] : undefined;
  }
  
  // Remove query params and hash fragments
  const clean = src.split(/[?#]/, 1)[0];
  
  // Extract basename handling both forward and back slashes
  const base = clean.split('/').pop()?.split('\\').pop() ?? clean;
  
  // Remove extension to get the key
  const key = base.includes('.') ? base.slice(0, base.lastIndexOf('.')) : base;
  
  // Cache the result (null if no metadata found)
  const hasMetadata = key in imageMetadata;
  keyCache.set(src, hasMetadata ? key : null);
  
  return hasMetadata ? imageMetadata[key] : undefined;
}

// Helper to extract filename from full path for metadata lookup
export function extractFilenameFromPath(imagePath: string): string {
  if (!imagePath) return '';
  
  // Remove query params and hash fragments
  const clean = imagePath.split(/[?#]/, 1)[0];
  
  // Extract basename handling both forward and back slashes
  const base = clean.split('/').pop()?.split('\\').pop() ?? clean;
  
  // Remove extension to get the key
  return base.includes('.') ? base.slice(0, base.lastIndexOf('.')) : base;
}
