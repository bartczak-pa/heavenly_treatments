import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

/**
 * Generate image URL from Sanity image asset
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Get optimized image URL with specified dimensions
 *
 * @param source - Sanity image source
 * @param width - Optional image width in pixels
 * @param height - Optional image height in pixels
 * @param quality - Image quality (1-100, default 90 for better quality)
 * @returns Optimized image URL from Sanity CDN
 */
export function getImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number,
  quality: number = 90
): string {
  let imageBuilder = urlFor(source)
    .auto('format')
    .fit('max')
    .quality(quality);

  if (width) {
    imageBuilder = imageBuilder.width(width);
  }

  if (height) {
    imageBuilder = imageBuilder.height(height);
  }

  return imageBuilder.url();
}
