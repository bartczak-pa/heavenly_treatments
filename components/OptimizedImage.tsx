'use client';

import Image, { ImageProps } from 'next/image';
import { memo } from 'react';
import { getImageMetadata } from '@/lib/data/image-metadata';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'blurDataURL' | 'placeholder'> {
  /** 
   * Image source - can be a filename (e.g., 'bacial') or full path 
   * If filename provided, will automatically use optimized version
   */
  src: string;
  /** 
   * Whether this image should load with priority (above the fold) 
   * Overrides metadata priority setting
   */
  priority?: boolean;
  /** 
   * Loading strategy - 'lazy' for below fold, 'eager' for above fold 
   */
  loading?: 'lazy' | 'eager';
  /** 
   * Fallback image path if optimized version not available 
   */
  fallback?: string;
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
  alt,
  priority,
  loading,
  fallback,
  sizes,
  className,
  ...props
}) => {
  // Check if src is a filename or full path
  const isFilename = !src.startsWith('/') && !src.startsWith('http');
  
  // Get metadata for optimized images
  const metadata = isFilename ? getImageMetadata(src) : null;
  
  // Determine the actual image source
  const imageSrc = metadata?.src || fallback || src;
  
  // Determine loading priority
  const shouldPriority = priority ?? metadata?.priority ?? false;
  
  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (metadata?.sizes.length 
    ? `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`
    : undefined
  );
  
  // Create srcSet for responsive images if metadata available
  const srcSet = metadata?.sizes.length 
    ? metadata.sizes.map(size => 
        `${metadata.src.replace('.webp', `_${size}w.webp`)} ${size}w`
      ).join(', ')
    : undefined;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      priority={shouldPriority}
      loading={loading || (shouldPriority ? 'eager' : 'lazy')}
      placeholder={metadata?.blurDataURL ? 'blur' : 'empty'}
      blurDataURL={metadata?.blurDataURL}
      sizes={responsiveSizes}
      className={className}
      {...props}
      // Override srcSet if we have responsive variants
      {...(srcSet && { 
        // Note: Next.js handles srcSet automatically, but we ensure our optimized versions are used
        onLoad: (e) => {
          // Set srcset after image loads to ensure our optimized versions are used
          if (srcSet && e.currentTarget instanceof HTMLImageElement) {
            e.currentTarget.srcset = srcSet;
          }
          props.onLoad?.(e);
        }
      })}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;