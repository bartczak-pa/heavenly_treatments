'use client';

/**
 * Treatment View Tracker Component
 *
 * Client component that tracks treatment detail page views in GA4.
 * Used as a wrapper in server components to enable view_item tracking.
 *
 * @module components/Analytics/TreatmentViewTracker
 */

import { useTrackTreatmentView } from '@/hooks/useTrackTreatmentView';
import { useScrollTracking } from '@/hooks/useScrollTracking';

interface TreatmentViewTrackerProps {
  /** Treatment unique identifier (Sanity document ID) */
  treatmentId: string;
  /** Treatment display name */
  treatmentName: string;
  /** Treatment category name */
  treatmentCategory?: string;
  /** Treatment price (string format like "£40") */
  treatmentPrice?: string;
  /** Enable scroll tracking on treatment pages */
  enableScrollTracking?: boolean;
}

/**
 * Client component for tracking treatment page views.
 *
 * This component should be included in treatment detail pages to track:
 * - view_item event (when page loads)
 * - scroll_depth events (optional, at 25%, 50%, 75%, 90%)
 *
 * @example
 * ```tsx
 * // In app/treatments/[categorySlug]/[treatmentSlug]/page.tsx
 * export default async function TreatmentDetailPage({ params }) {
 *   const treatment = await getTreatmentBySlug(params.treatmentSlug);
 *
 *   return (
 *     <>
 *       <TreatmentViewTracker
 *         treatmentId={treatment.id}
 *         treatmentName={treatment.title}
 *         treatmentCategory={treatment.category}
 *         treatmentPrice={treatment.price}
 *       />
 *       {/* Rest of page content *\/}
 *     </>
 *   );
 * }
 * ```
 */
export function TreatmentViewTracker({
  treatmentId,
  treatmentName,
  treatmentCategory,
  treatmentPrice,
  enableScrollTracking = true,
}: TreatmentViewTrackerProps) {
  // Track view_item event on mount
  useTrackTreatmentView({
    id: treatmentId,
    title: treatmentName,
    category: treatmentCategory,
    price: treatmentPrice,
  });

  // Optionally track scroll depth on treatment pages
  useScrollTracking({ enabled: enableScrollTracking });

  // This component renders nothing - it only provides tracking functionality
  return null;
}
