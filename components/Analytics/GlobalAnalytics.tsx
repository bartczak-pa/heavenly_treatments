'use client';

/**
 * Global Analytics Component
 *
 * Provides site-wide analytics tracking for outbound links.
 * Should be included in the root layout to enable global tracking.
 *
 * @module components/Analytics/GlobalAnalytics
 */

import { useOutboundTracking } from '@/hooks/useOutboundTracking';

/**
 * Global analytics wrapper that enables site-wide tracking features.
 *
 * Currently includes:
 * - Outbound link tracking (automatic detection of external links)
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * import { GlobalAnalytics } from '@/components/Analytics/GlobalAnalytics';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <GlobalAnalytics />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function GlobalAnalytics() {
  // Enable global outbound link tracking
  useOutboundTracking();

  // This component renders nothing - it only provides tracking functionality
  return null;
}
