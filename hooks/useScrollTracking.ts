'use client';

/**
 * Scroll Depth Tracking Hook
 *
 * Tracks GA4 scroll_depth events at configurable milestones.
 * Uses passive scroll listeners for performance.
 * Fires once per threshold per page view.
 *
 * @module hooks/useScrollTracking
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackScrollDepth } from '@/lib/analytics/ga4';

interface ScrollTrackingOptions {
  /** Scroll depth thresholds to track (percentage values) */
  thresholds?: number[];
  /** Enable or disable tracking */
  enabled?: boolean;
}

const DEFAULT_THRESHOLDS = [25, 50, 75, 90];

/**
 * Hook to track scroll depth milestones in GA4
 *
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * function LongContentPage() {
 *   // Track at default milestones (25%, 50%, 75%, 90%)
 *   useScrollTracking();
 *
 *   return <div>...</div>;
 * }
 *
 * // Or with custom thresholds
 * function CustomPage() {
 *   useScrollTracking({ thresholds: [50, 100], enabled: true });
 *   return <div>...</div>;
 * }
 * ```
 */
export function useScrollTracking(options: ScrollTrackingOptions = {}): void {
  const { thresholds = DEFAULT_THRESHOLDS, enabled = true } = options;
  const pathname = usePathname();
  const trackedThresholds = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Reset tracked thresholds on route change
    trackedThresholds.current = new Set();

    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      // Avoid division by zero for short pages
      if (scrollHeight <= 0) {
        return;
      }

      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      thresholds.forEach((threshold) => {
        // Check if we've passed this threshold and haven't tracked it yet
        if (
          scrollPercent >= threshold &&
          !trackedThresholds.current.has(threshold)
        ) {
          // Mark as tracked
          trackedThresholds.current.add(threshold);

          // Track the scroll depth event
          trackScrollDepth({
            percent_scrolled: threshold,
            page_path: pathname,
            page_title: document.title,
          });
        }
      });
    };

    // Add passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position (for page loads with scroll position)
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, thresholds, enabled]);
}
