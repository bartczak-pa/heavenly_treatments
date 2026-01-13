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

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { trackScrollDepth } from '@/lib/analytics/ga4';

/**
 * Creates a throttled version of a function that only executes
 * at most once per specified time period.
 */
function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

interface ScrollTrackingOptions {
  /** Scroll depth thresholds to track (percentage values) */
  thresholds?: number[];
  /** Enable or disable tracking */
  enabled?: boolean;
}

/**
 * Default scroll depth thresholds (percentages).
 * Uses 90% instead of 100% because users rarely scroll to the absolute bottom,
 * and 90% indicates they've consumed most of the content.
 */
const DEFAULT_THRESHOLDS = [25, 50, 75, 90];

/** Throttle delay in milliseconds for scroll events */
const SCROLL_THROTTLE_MS = 150;

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

  // Memoized scroll handler to check thresholds
  const checkScrollThresholds = useCallback(() => {
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
  }, [pathname, thresholds]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Reset tracked thresholds on route change
    trackedThresholds.current = new Set();

    // Create throttled scroll handler to limit function calls
    const throttledHandler = throttle(checkScrollThresholds, SCROLL_THROTTLE_MS);

    // Add passive scroll listener for better performance
    window.addEventListener('scroll', throttledHandler, { passive: true });

    // Check initial scroll position (for page loads with scroll position)
    checkScrollThresholds();

    return () => {
      window.removeEventListener('scroll', throttledHandler);
    };
  }, [pathname, enabled, checkScrollThresholds]);
}
