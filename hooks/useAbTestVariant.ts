'use client';

import { useEffect, useState } from 'react';
import {
  getVariantAssignment,
  isABTestEnabled,
} from '@/lib/abTesting/variantAssignment';
import { trackVariantAssignment } from '@/lib/analytics/trackAbTest';

type Variant = 'fresha' | 'form';

interface VariantAssignment {
  variant: Variant;
  cohort: 'control' | 'test';
  isLoading: boolean;
}

/**
 * Hook for accessing the user's A/B test variant assignment
 *
 * Returns the variant assignment and tracks the assignment in analytics
 * Handles hydration safely
 */
export function useAbTestVariant(): VariantAssignment {
  const [assignment, setAssignment] = useState<VariantAssignment>({
    variant: 'form',
    cohort: 'control',
    isLoading: true,
  });

  useEffect(() => {
    if (!isABTestEnabled()) {
      setAssignment({
        variant: 'form',
        cohort: 'control',
        isLoading: false,
      });
      return;
    }

    const { variant, cohort } = getVariantAssignment();

    setAssignment({
      variant,
      cohort,
      isLoading: false,
    });

    // Track variant assignment once
    trackVariantAssignment();
  }, []);

  return assignment;
}
