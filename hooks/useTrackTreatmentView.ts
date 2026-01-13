'use client';

/**
 * Treatment View Tracking Hook
 *
 * Tracks GA4 view_item event when a treatment detail page is viewed.
 * Fires once per page view (prevents duplicate events).
 *
 * @module hooks/useTrackTreatmentView
 */

import { useEffect, useRef } from 'react';
import {
  trackViewItem,
  parsePrice,
  type TreatmentTrackingData,
} from '@/lib/analytics/ga4';

interface TreatmentViewProps {
  /** Treatment unique identifier */
  id: string;
  /** Treatment display name */
  title: string;
  /** Treatment category slug or name */
  category?: string;
  /** Treatment price (string format like "£40") */
  price?: string;
}

/**
 * Hook to track treatment detail page views in GA4
 *
 * @param treatment - Treatment data to track
 *
 * @example
 * ```tsx
 * function TreatmentPage({ treatment }) {
 *   useTrackTreatmentView({
 *     id: treatment.id,
 *     title: treatment.title,
 *     category: treatment.category,
 *     price: treatment.price,
 *   });
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useTrackTreatmentView(treatment: TreatmentViewProps): void {
  const hasTracked = useRef(false);
  const lastTreatmentId = useRef<string | null>(null);

  useEffect(() => {
    // Reset tracking flag when treatment changes (navigation between treatments)
    if (lastTreatmentId.current !== treatment.id) {
      hasTracked.current = false;
      lastTreatmentId.current = treatment.id;
    }

    // Prevent duplicate tracking on re-renders
    if (hasTracked.current) {
      return;
    }

    // Mark as tracked
    hasTracked.current = true;

    // Transform to tracking data format
    const trackingData: TreatmentTrackingData = {
      id: treatment.id,
      name: treatment.title,
      category: treatment.category,
      price: parsePrice(treatment.price),
    };

    // Track the view_item event
    trackViewItem(trackingData);
  }, [treatment.id, treatment.title, treatment.category, treatment.price]);
}
