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
 * Image optimization options for advanced control
 */
export interface ImageOptimizationOptions {
  /** Image quality (1-100, default 90) */
  quality?: number;
  /** Compression algorithm (auto, jpeg, webp, png) */
  compression?: 'auto' | 'jpeg' | 'webp' | 'png';
  /** Progressive JPEG loading */
  progressive?: boolean;
  /** Whether to crop to specified dimensions */
  fit?: 'clamp' | 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  /** Device pixel ratio for responsive images (default 1) */
  dpr?: number;
}

/**
 * Get optimized image URL with advanced parameters
 *
 * Leverages Sanity CDN for:
 * - Automatic format selection (AVIF, WebP, JPEG)
 * - Intelligent compression
 * - CDN edge caching for fast delivery
 * - Request deduplication
 *
 * @param source - Sanity image source
 * @param width - Optional image width in pixels
 * @param height - Optional image height in pixels
 * @param options - Advanced optimization options
 * @returns Optimized image URL from Sanity CDN
 *
 * @example
 * ```ts
 * // Basic usage with quality
 * const url = getImageUrl(imageAsset, 800, 600);
 *
 * // Advanced usage with compression
 * const url = getImageUrl(imageAsset, 800, 600, {
 *   quality: 85,
 *   compression: 'webp',
 *   progressive: true,
 *   dpr: 2
 * });
 * ```
 */
export function getImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number,
  options: ImageOptimizationOptions | number = {}
): string {
  // Support legacy API: quality as number parameter
  const opts: ImageOptimizationOptions = typeof options === 'number'
    ? { quality: options }
    : options;

  const {
    quality = 90,
    compression = 'auto',
    fit = 'max',
    dpr = 1,
  } = opts;

  let imageBuilder = urlFor(source)
    .auto('format') // Automatically use best format (AVIF, WebP, JPEG)
    .quality(quality) // Set quality level
    .fit(fit); // Specify fit mode

  // Apply compression settings for specific formats
  if (compression !== 'auto') {
    // Note: This is a hint; Sanity will still optimize based on client capability
    switch (compression) {
      case 'webp':
        imageBuilder = imageBuilder.quality(quality);
        break;
      case 'jpeg':
        imageBuilder = imageBuilder.format('jpg').quality(quality);
        break;
      case 'png':
        imageBuilder = imageBuilder.format('png');
        break;
      default:
        break;
    }
  }

  // Note: Progressive JPEG loading is handled automatically by Sanity CDN
  // based on client capability, so we don't need explicit configuration here

  // Apply device pixel ratio for responsive images
  if (dpr > 1) {
    imageBuilder = imageBuilder.dpr(dpr);
  }

  // Apply dimensions
  if (width) {
    imageBuilder = imageBuilder.width(width);
  }

  if (height) {
    imageBuilder = imageBuilder.height(height);
  }

  return imageBuilder.url();
}

/**
 * Get responsive image srcset for multiple resolutions
 *
 * Generates srcset for responsive images with multiple pixel densities
 * and sizes, optimized for different devices.
 *
 * @param source - Sanity image source
 * @param baseWidth - Base width in pixels
 * @param baseHeight - Optional base height in pixels
 * @param quality - Image quality (default 90)
 * @returns Object with src, srcSet, and sizes properties for responsive images
 *
 * @example
 * ```ts
 * const { src, srcSet, sizes } = getResponsiveImage(imageAsset, 800);
 * return <img src={src} srcSet={srcSet} sizes={sizes} alt="..." />;
 * ```
 */
export function getResponsiveImage(
  source: SanityImageSource,
  baseWidth: number,
  baseHeight?: number,
  quality: number = 90
) {
  // Generate multiple sizes for responsive images
  const sizes = [320, 640, 1024, 1280, 1536, 1920];
  const validSizes = sizes.filter(size => size <= baseWidth * 2);

  // Create srcset entries
  const srcSetEntries = validSizes.map(size => {
    const url = getImageUrl(source, size, baseHeight ? Math.round((size / baseWidth) * baseHeight) : undefined, { quality });
    return `${url} ${size}w`;
  });

  // Base image
  const src = getImageUrl(source, baseWidth, baseHeight, { quality });

  // Media query for sizes attribute
  const sizesAttr = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return {
    src,
    srcSet: srcSetEntries.join(', '),
    sizes: sizesAttr,
  };
}
