'use client';

import { useEffect, useState } from 'react';
import {
  getVariantAssignment,
  type ABTestVariant,
} from '@/lib/abTesting/variantAssignment';
import { tryRecordParticipantGroup } from '@/lib/analytics/trackAbTest';
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent';

interface AbTestVariantState {
  variant: ABTestVariant;
  /** True when the visitor consented and the experiment is running */
  isParticipant: boolean;
  isLoading: boolean;
}

/** How often, and for how long, to wait for GA4 to finish loading */
const GA_RETRY_INTERVAL_MS = 500;
const GA_RETRY_ATTEMPTS = 20;

/**
 * The visitor's Booking Route Experiment group.
 *
 * Non-Participants (no consent, or experiment off) always get the Form
 * Route. A visitor who accepts cookies partway through a visit becomes a
 * Participant straight away. A Participant's group is recorded in GA4 at
 * most once per visit. Hydration-safe: `isLoading` is true until mounted.
 */
export function useAbTestVariant(): AbTestVariantState {
  const consent = useAnalyticsConsent();
  const [state, setState] = useState<AbTestVariantState>({
    variant: 'form',
    isParticipant: false,
    isLoading: true,
  });

  useEffect(() => {
    // Re-runs when the visitor answers the cookie banner (`consent`);
    // getVariantAssignment reads the consent cookie itself.
    const { variant, isParticipant } = getVariantAssignment();
    setState({ variant, isParticipant, isLoading: false });

    if (!isParticipant || tryRecordParticipantGroup(variant)) {
      return;
    }

    // GA4 loads after the page becomes interactive: retry briefly
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (
        tryRecordParticipantGroup(variant) ||
        attempts >= GA_RETRY_ATTEMPTS
      ) {
        clearInterval(timer);
      }
    }, GA_RETRY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [consent]);

  return state;
}
