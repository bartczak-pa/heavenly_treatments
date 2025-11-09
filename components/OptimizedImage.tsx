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
  /**
   * Aspect ratio to prevent CLS (e.g., "16/9", "4/3", "1/1")
   * Reserves layout space before image loads, preventing layout shift
   */
  aspectRatio?: string;
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
  aspectRatio,
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
    const sizes = metadata?.sizes;
    if (!sizes?.length) return null;
    return [...sizes].sort((a, b) => a - b);
  }, [metadata?.sizes?.join(',')]);

  // Generate responsive sizes if not provided
  const responsiveSizes = props.sizes || (sortedSizes?.length
    ? `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`
    : undefined
  );

  // Memoize custom loader for responsive variants to prevent recreation
  const customLoader: ImageLoader | undefined = useMemo(() => {
    if (!sortedSizes || !metadata) return undefined;

    return ({ width }) => {
      const candidate = sortedSizes.find(s => s >= width) ?? sortedSizes[sortedSizes.length - 1];
      return metadata.src.replace(/\.webp$/, `_${candidate}w.webp`);
    };
  }, [sortedSizes, metadata]);

  // Determine container style for aspect ratio (prevents CLS)
  const containerStyle: React.CSSProperties = {};
  if (aspectRatio) {
    containerStyle.aspectRatio = aspectRatio;
  } else if (props.fill && metadata?.width && metadata?.height) {
    // Auto-calculate aspect ratio from metadata
    containerStyle.aspectRatio = `${metadata.width} / ${metadata.height}`;
  }

  // If we need a container (for aspect ratio), wrap the Image
  if (Object.keys(containerStyle).length > 0) {
    return (
      <div style={containerStyle} className="relative overflow-hidden w-full">
        <Image
          src={imageSrc}
          width={props.fill ? undefined : (props.width ?? metadata?.width)}
          height={props.fill ? undefined : (props.height ?? metadata?.height)}
          priority={shouldPriority}
          loading={shouldPriority ? 'eager' : (props.loading ?? 'lazy')}
          placeholder={metadata?.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={metadata?.blurDataURL}
          sizes={responsiveSizes}
          fill={props.fill}
          alt={props.alt}
          className={props.className}
          {...(props.fill && { fill: true })}
          {...(!('loader' in props) && customLoader ? { loader: customLoader } : {})}
          onError={(_e) => {
            if (onOptimizedError) {
              const error = new Error(`Failed to load image: ${imageSrc}`);
              onOptimizedError(error);
            }
          }}
        />
      </div>
    );
  }

  // No aspect ratio - render Image normally
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
      {...(!('loader' in props) && customLoader ? { loader: customLoader } : {})}
      onError={(_e) => {
        if (onOptimizedError) {
          const error = new Error(`Failed to load image: ${imageSrc}`);
          onOptimizedError(error);
        }
      }}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;