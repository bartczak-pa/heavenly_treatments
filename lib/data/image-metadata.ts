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
    src: '/images/optimized/bacial.webp',
    blurDataURL: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAsABUB8JZgCw7Ef5ZJMUIAA/qN61C70zJ/cpoQi4JpdHF33YZ7867kqFEN1PWoXthWbmWC9j1139fAAAA==',
    width: 6000,
    height: 4000,
    sizes: [320, 640, 1024, 1280],
    priority: false
  },
  'person_having_reflexology_treatment': {
    src: '/images/optimized/person_having_reflexology_treatment.webp',
    blurDataURL: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAQCdASoQAAsABUB8JZgC7AC3iMYZE4AA9n9gIMFwnJ+OJtT7JuLawSVXTLYnOQUw0RytDe2gDyQYm2AZLQqAQeaAb2mWWUVOAAAA',
    width: 6000,
    height: 4000,
    sizes: [320, 640, 1024, 1280],
    priority: false
  },
  'young-woman-having-face-massage-relaxing-spa-salon': {
    src: '/images/optimized/young-woman-having-face-massage-relaxing-spa-salon.webp',
    blurDataURL: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQAgCdASoQAAsABUB8JZgCdAEfB6BK/6NgAN5e5+n/bCmizk6oM0/HdnJV70YsINnSnfOLB5RrZ5K35nK2hgWIACrtNUPo1WaA/AFpDuh/GYAA',
    width: 7360,
    height: 4912,
    sizes: [320, 640, 1024, 1280],
    priority: true
  },
  'woman-salon-making-beauty-treatment-with-gua-sha-stone': {
    src: '/images/optimized/woman-salon-making-beauty-treatment-with-gua-sha-stone.webp',
    blurDataURL: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAAAQAgCdASoQAAsABUB8JZgCdAEVYQOOR+aAAP6NphZryQiNEOLTMEWVc4YWU1uLQP7XroqGFqVwAA==',
    width: 6720,
    height: 4480,
    sizes: [320, 640, 1024, 1280],
    priority: false
  }
};

// Helper function to get image metadata by filename
export function getImageMetadata(filename: string): ImageMetadata | undefined {
  const key = filename.replace(/.[^.]+$/, ''); // Remove extension
  return imageMetadata[key];
}
