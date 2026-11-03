'use client';

import { useSyncExternalStore } from 'react';
import { hasConsent, subscribeToConsentChange } from '@/lib/cookieUtils';

/**
 * Whether the visitor has accepted analytics cookies.
 *
 * Re-renders when the visitor accepts or declines partway through a
 * visit. Always false during server rendering and hydration.
 */
export function useAnalyticsConsent(): boolean {
  return useSyncExternalStore(
    subscribeToConsentChange,
    hasConsent,
    () => false
  );
}
