/**
 * Booking Route Experiment: group assignment
 *
 * Only visitors who have accepted analytics cookies are Participants.
 * A Participant is placed in the Form Group or the Fresha Group (50/50,
 * by consistent hashing of a random ID) and the ID is stored in a cookie
 * so they keep the same Assigned Group on later visits.
 *
 * Everyone else (no consent, or the experiment flag off) gets the Form
 * Route and no cookie is stored for them.
 */

import Cookies from 'js-cookie';
import { getCookie, hasConsent } from '@/lib/cookieUtils';

export type ABTestVariant = 'fresha' | 'form';

export interface VariantAssignment {
  variant: ABTestVariant;
  /** True when the visitor consented and the experiment is running */
  isParticipant: boolean;
}

const VARIANT_COOKIE_NAME = 'ab_test_variant';
const VARIANT_COOKIE_EXPIRY_DAYS = 365;

const NON_PARTICIPANT: VariantAssignment = {
  variant: 'form',
  isParticipant: false,
};

/**
 * Simple hash function for consistent assignment
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Map an experiment ID to its Assigned Group (deterministic, ~50/50)
 */
export function assignVariantFromId(userId: string): ABTestVariant {
  const hash = simpleHash(userId);
  return hash % 2 === 0 ? 'form' : 'fresha';
}

/**
 * Check if the experiment is enabled via environment variable
 */
export function isABTestEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AB_TEST_ENABLED === 'true';
}

/**
 * Get the visitor's Assigned Group, creating and storing one for a new
 * Participant. Non-Participants always get the Form Route and never get
 * a cookie.
 */
export function getVariantAssignment(): VariantAssignment {
  if (typeof window === 'undefined' || !isABTestEnabled() || !hasConsent()) {
    return NON_PARTICIPANT;
  }

  const stored = getCookie(VARIANT_COOKIE_NAME);
  const userId = stored?.startsWith('user_') ? stored : generateUserId();

  if (userId !== stored) {
    Cookies.set(VARIANT_COOKIE_NAME, userId, {
      expires: VARIANT_COOKIE_EXPIRY_DAYS,
      path: '/',
      sameSite: 'Lax',
    });
  }

  return {
    variant: assignVariantFromId(userId),
    isParticipant: true,
  };
}
