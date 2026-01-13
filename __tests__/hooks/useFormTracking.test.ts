import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormTracking } from '@/hooks/useFormTracking';

// Mock the ga4 module
vi.mock('@/lib/analytics/ga4', () => ({
  trackFormInteraction: vi.fn(),
}));

import { trackFormInteraction } from '@/lib/analytics/ga4';

describe('useFormTracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return tracking callback functions', () => {
    const { result } = renderHook(() =>
      useFormTracking({ formName: 'contact_form' })
    );

    expect(result.current.onFieldFocus).toBeInstanceOf(Function);
    expect(result.current.onFieldBlur).toBeInstanceOf(Function);
    expect(result.current.onFieldError).toBeInstanceOf(Function);
    expect(result.current.onFormSubmit).toBeInstanceOf(Function);
  });

  describe('onFieldFocus', () => {
    it('should track focus interaction', () => {
      const { result } = renderHook(() =>
        useFormTracking({ formName: 'contact_form' })
      );

      act(() => {
        result.current.onFieldFocus('email');
      });

      expect(trackFormInteraction).toHaveBeenCalledWith({
        form_name: 'contact_form',
        field_name: 'email',
        interaction_type: 'focus',
      });
    });

    it('should track focus on different fields', () => {
      const { result } = renderHook(() =>
        useFormTracking({ formName: 'contact_form' })
      );

      act(() => {
        result.current.onFieldFocus('firstName');
      });

      expect(trackFormInteraction).toHaveBeenCalledWith({
        form_name: 'contact_form',
        field_name: 'firstName',
        interaction_type: 'focus',
      });
    });
  });

  describe('onFieldBlur', () => {
    it('should track blur interaction when field has value', () => {
      const { result } = renderHook(() =>
        useFormTracking({ formName: 'contact_form' })
      );

      act(() => {
        result.current.onFieldBlur('message', true); // hasValue = true
      });

      expect(trackFormInteraction).toHaveBeenCalledWith({
        form_name: 'contact_form',
        field_name: 'message',
        interaction_type: 'blur',
      });
    });

    it('should NOT track blur interaction when field is empty', () => {
      const { result } = renderHook(() =>
        useFormTracking({ formName: 'contact_form' })
      );

      act(() => {
        result.current.onFieldBlur('message', false); // hasValue = false
      });

      expect(trackFormInteraction).not.toHaveBeenCalled();
    });
  });

  describe('onFieldError', () => {
    it('should track error interaction with message', () => {
      const { result } = renderHook(() =>
        useFormTracking({ formName: 'contact_form' })
      );

      act(() => {
        result.current.onFieldError('email', 'Invalid email format');
      });

      expect(trackFormInteraction).toHaveBeenCalledWith({
        form_name: 'contact_form',
        field_name: 'email',
        interaction_type: 'error',
        error_message: 'Invalid email format',
      });
    });

    it('should track error with empty message', () => {
      const { result } = renderHook(() =>
        useFormTracking({ formName: 'contact_form' })
      );

      act(() => {
        result.current.onFieldError('phone', '');
      });

      expect(trackFormInteraction).toHaveBeenCalledWith({
        form_name: 'contact_form',
        field_name: 'phone',
        interaction_type: 'error',
        error_message: '',
      });
    });
  });

  describe('onFormSubmit', () => {
    it('should track form submission', () => {
      const { result } = renderHook(() =>
        useFormTracking({ formName: 'contact_form' })
      );

      act(() => {
        result.current.onFormSubmit();
      });

      expect(trackFormInteraction).toHaveBeenCalledWith({
        form_name: 'contact_form',
        interaction_type: 'submit',
      });
    });
  });

  describe('form start tracking', () => {
    it('should track form start on first field focus', () => {
      const { result } = renderHook(() =>
        useFormTracking({ formName: 'booking_form' })
      );

      act(() => {
        result.current.onFieldFocus('firstName');
      });

      expect(trackFormInteraction).toHaveBeenCalledWith({
        form_name: 'booking_form',
        interaction_type: 'start',
      });

      expect(trackFormInteraction).toHaveBeenCalledWith({
        form_name: 'booking_form',
        field_name: 'firstName',
        interaction_type: 'focus',
      });
    });

    it('should NOT track form start on subsequent focuses', () => {
      const { result } = renderHook(() =>
        useFormTracking({ formName: 'booking_form' })
      );

      // First focus - should trigger start
      act(() => {
        result.current.onFieldFocus('firstName');
      });

      // Second focus - should NOT trigger start again
      act(() => {
        result.current.onFieldFocus('email');
      });

      // Should have: start, focus(firstName), focus(email)
      // Only one 'start' event
      const startCalls = vi.mocked(trackFormInteraction).mock.calls.filter(
        (call) => call[0].interaction_type === 'start'
      );

      expect(startCalls).toHaveLength(1);
    });
  });

  describe('different form names', () => {
    it('should use correct form name for all interactions', () => {
      const { result } = renderHook(() =>
        useFormTracking({ formName: 'newsletter_signup' })
      );

      act(() => {
        result.current.onFieldFocus('email');
        result.current.onFieldBlur('email', true); // hasValue = true
        result.current.onFieldError('email', 'Required');
        result.current.onFormSubmit();
      });

      const calls = vi.mocked(trackFormInteraction).mock.calls;

      // All calls should use the correct form name
      calls.forEach((call) => {
        expect(call[0].form_name).toBe('newsletter_signup');
      });
    });
  });
});
