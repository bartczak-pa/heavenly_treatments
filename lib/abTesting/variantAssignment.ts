/**
 * A/B Test Variant Assignment
 *
 * Handles 50/50 traffic split using consistent hashing.
 * User assignment is persisted via cookie to ensure consistent variant across sessions.
 */

type ABTestVariant = 'fresha' | 'form';

const VARIANT_COOKIE_NAME = 'ab_test_variant';
const VARIANT_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Simple hash function for consistent assignment
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get user identifier (from cookie or generate new one)
 */
function getUserId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // Try to get from existing cookie
  const cookies = document.cookie.split(';').map((c) => c.trim());
  const variantCookie = cookies.find((c) =>
    c.startsWith(VARIANT_COOKIE_NAME + '=')
  );

  if (variantCookie) {
    const value = variantCookie.split('=')[1];
    if (value.startsWith('user_')) {
      return value;
    }
  }

  // Generate new user ID
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Assign variant based on user ID
 */
function assignVariantFromId(userId: string): ABTestVariant {
  const hash = simpleHash(userId);
  return hash % 2 === 0 ? 'form' : 'fresha';
}

/**
 * Get or create variant assignment
 */
export function getVariantAssignment(): {
  variant: ABTestVariant;
  userId: string;
  cohort: 'control' | 'test';
} {
  if (typeof window === 'undefined') {
    return { variant: 'form', userId: '', cohort: 'control' };
  }

  const userId = getUserId();
  const variant = assignVariantFromId(userId);

  // Set cookie if not already set
  if (!document.cookie.includes(VARIANT_COOKIE_NAME + '=')) {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + VARIANT_COOKIE_MAX_AGE);
    document.cookie = `${VARIANT_COOKIE_NAME}=${userId}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }

  return {
    variant,
    userId,
    cohort: variant === 'form' ? 'control' : 'test',
  };
}

/**
 * Check if A/B test is enabled via environment variable
 */
export function isABTestEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AB_TEST_ENABLED === 'true';
}
