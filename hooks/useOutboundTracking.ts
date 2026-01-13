'use client';

/**
 * Outbound Link Tracking Hook
 *
 * Automatically tracks clicks on external (outbound) links.
 * Attaches a global click listener that detects external links.
 *
 * @module hooks/useOutboundTracking
 */

import { useEffect } from 'react';
import { trackOutboundClick } from '@/lib/analytics/ga4';

interface OutboundTrackingOptions {
  /** Enable or disable tracking */
  enabled?: boolean;
}

/**
 * Hook to automatically track outbound link clicks in GA4
 *
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * // In a layout or global component
 * function GlobalAnalytics() {
 *   useOutboundTracking();
 *   return null;
 * }
 * ```
 */
export function useOutboundTracking(
  options: OutboundTrackingOptions = {}
): void {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Find the closest anchor element
      const link = target.closest('a');
      if (!link) {
        return;
      }

      const href = link.href;
      if (!href) {
        return;
      }

      try {
        const url = new URL(href);
        const currentHost = window.location.hostname;

        // Only track links to external domains
        if (url.hostname !== currentHost && url.hostname !== '') {
          trackOutboundClick({
            link_url: href,
            link_text: link.textContent?.trim() || undefined,
            link_domain: url.hostname,
          });
        }
      } catch {
        // Invalid URL - skip tracking
        // This can happen with javascript: or mailto: links
      }
    };

    // Add click listener to document
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [enabled]);
}
