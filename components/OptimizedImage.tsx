'use client';

import Image, { ImageProps, ImageLoader } from 'next/image';
import { memo, useMemo } from 'react';
import { getImageMetadata } from '@/lib/data/image-metadata';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'blurDataURL' | 'placeholder' | 'onError'> {
  /** 
   * Image source - can be a filename (e.g., 'bacial') or full path 
   * If filename provided, will automatically use optimized version
   */
  src: string;
  /** 
   * Fallback image path if optimized version not available 
   */
  fallback?: string;
  /** 
   * Optional callback for error reporting (Sentry, analytics, etc.)
   */
  onOptimizedError?: (error: Error) => void;
}

/**
 * OptimizedImage Component
 * 
 * An enhanced Next.js Image component that automatically:
 * - Uses WebP optimized images when available
 * - Provides blur placeholders for better perceived performance
 * - Applies appropriate loading priorities
 * - Falls back to original images if optimized versions unavailable
 * 
 * @component
 * @example
 * ```tsx
 * // Using filename (automatically uses optimized version)
 * <OptimizedImage 
 *   src="bacial" 
 *   alt="Facial treatment"
 *   fill
 *   priority // Above the fold
 * />
 * 
 * // Using full path (fallback to original)
 * <OptimizedImage 
 *   src="/images/treatments/massage.jpg"
 *   alt="Massage treatment" 
 *   width={400}
 *   height={300}
 *   loading="lazy" // Below the fold
 * />
 * ```
 */
const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  fallback,
  onOptimizedError,
  ...props
}) => {
  // Check if src is a filename (not a path or URL) - case insensitive
  const isFilename = !/^(?:\/|https?:|data:|\/\/)/i.test(src);
  
  // Get metadata for optimized images (robust normalizer handles paths/urls)
  const metadata = getImageMetadata(src);
  
  // Fail-closed behavior for missing metadata/fallback
  if (isFilename && !metadata && !fallback) {
    throw new Error(`OptimizedImage: no metadata for '${src}'; add entry to image-metadata.ts or provide a 'fallback'`);
  }
  
  // Determine the actual image source
  const imageSrc = metadata?.src || fallback || src;
  
  // Determine loading priority
  const shouldPriority = props.priority ?? metadata?.priority ?? false;
  
  // Memoize sorted sizes to prevent re-sorting on every render
  const sortedSizes = useMemo(() => {
    return metadata?.sizes ? [...metadata.sizes].sort((a, b) => a - b) : null;
  }, [metadata?.sizes]);
  
  // Generate responsive sizes if not provided
  const responsiveSizes = props.sizes || (sortedSizes?.length 
    ? `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`
    : undefined
  );
  
  // Custom loader for responsive variants
  const customLoader: ImageLoader | undefined = sortedSizes ? ({ width }) => {
    const candidate = sortedSizes.find(s => s >= width) ?? sortedSizes[sortedSizes.length - 1];
    return metadata!.src.replace(/\.webp$/, `_${candidate}w.webp`);
  } : undefined;

  return (
    <Image
      src={imageSrc}
      width={props.fill ? undefined : (props.width ?? metadata?.width)}
      height={props.fill ? undefined : (props.height ?? metadata?.height)}
      priority={shouldPriority}
      loading={shouldPriority ? 'eager' : (props.loading ?? 'lazy')}
      placeholder={metadata?.blurDataURL ? 'blur' : 'empty'}
      blurDataURL={metadata?.blurDataURL}
      sizes={responsiveSizes}
      {...props}
      // Use custom loader for responsive variants
      {...(customLoader && { loader: customLoader })}
      // Enhanced error handling
      onError={(_e) => {
        // Call external error reporting if provided
        if (onOptimizedError) {
          const error = new Error(`Failed to load image: ${imageSrc}`);
          onOptimizedError(error);
        }
        // Note: props.onError is not available due to Omit in interface
      }}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;