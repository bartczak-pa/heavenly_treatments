'use client';

/**
 * Form Interaction Tracking Hook
 *
 * Tracks form field interactions for GA4 analytics.
 * Provides callbacks for tracking focus, blur, errors, and submission.
 *
 * @module hooks/useFormTracking
 */

import { useRef, useCallback } from 'react';
import { trackFormInteraction } from '@/lib/analytics/ga4';

interface FormTrackingOptions {
  /** Name of the form being tracked */
  formName: string;
  /** Enable or disable tracking */
  enabled?: boolean;
}

interface FormTrackingReturn {
  /** Call when a field receives focus */
  onFieldFocus: (fieldName: string) => void;
  /** Call when a field loses focus */
  onFieldBlur: (fieldName: string, hasValue: boolean) => void;
  /** Call when a field has a validation error */
  onFieldError: (fieldName: string, errorMessage: string) => void;
  /** Call when form is submitted successfully */
  onFormSubmit: () => void;
}

/**
 * Hook to track form field interactions in GA4
 *
 * @param options - Configuration options
 * @returns Object with tracking callback functions
 *
 * @example
 * ```tsx
 * function ContactForm() {
 *   const { onFieldFocus, onFieldBlur, onFieldError, onFormSubmit } =
 *     useFormTracking({ formName: 'contact_form' });
 *
 *   return (
 *     <form onSubmit={(e) => { handleSubmit(); onFormSubmit(); }}>
 *       <input
 *         name="email"
 *         onFocus={() => onFieldFocus('email')}
 *         onBlur={(e) => onFieldBlur('email', !!e.target.value)}
 *       />
 *     </form>
 *   );
 * }
 * ```
 */
export function useFormTracking(
  options: FormTrackingOptions
): FormTrackingReturn {
  const { formName, enabled = true } = options;
  const hasStarted = useRef(false);

  /**
   * Track when a field receives focus
   * Also tracks form_start on first field interaction
   */
  const onFieldFocus = useCallback(
    (fieldName: string) => {
      if (!enabled) return;

      // Track form start on first field interaction
      if (!hasStarted.current) {
        hasStarted.current = true;
        trackFormInteraction({
          form_name: formName,
          interaction_type: 'start',
        });
      }

      trackFormInteraction({
        form_name: formName,
        field_name: fieldName,
        interaction_type: 'focus',
      });
    },
    [formName, enabled]
  );

  /**
   * Track when a field loses focus (blur)
   * Only tracks if the field has a value (field completion)
   */
  const onFieldBlur = useCallback(
    (fieldName: string, hasValue: boolean) => {
      if (!enabled) return;

      // Only track blur if field has value (indicates completion)
      if (hasValue) {
        trackFormInteraction({
          form_name: formName,
          field_name: fieldName,
          interaction_type: 'blur',
        });
      }
    },
    [formName, enabled]
  );

  /**
   * Track validation errors on a field
   */
  const onFieldError = useCallback(
    (fieldName: string, errorMessage: string) => {
      if (!enabled) return;

      trackFormInteraction({
        form_name: formName,
        field_name: fieldName,
        interaction_type: 'error',
        error_message: errorMessage,
      });
    },
    [formName, enabled]
  );

  /**
   * Track successful form submission
   */
  const onFormSubmit = useCallback(() => {
    if (!enabled) return;

    trackFormInteraction({
      form_name: formName,
      interaction_type: 'submit',
    });
  }, [formName, enabled]);

  return {
    onFieldFocus,
    onFieldBlur,
    onFieldError,
    onFormSubmit,
  };
}
