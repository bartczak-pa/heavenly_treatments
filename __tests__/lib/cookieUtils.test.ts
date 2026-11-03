import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  CONSENT_COOKIE_NAME,
  hasConsent,
  setConsent,
  subscribeToConsentChange,
} from '@/lib/cookieUtils';

afterEach(() => {
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
});

describe('setConsent', () => {
  it('records acceptance and tells subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToConsentChange(listener);

    setConsent(true);

    expect(hasConsent()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('records a decline and tells subscribers', () => {
    setConsent(true);
    const listener = vi.fn();
    const unsubscribe = subscribeToConsentChange(listener);

    setConsent(false);

    expect(hasConsent()).toBe(false);
    expect(document.cookie).toContain(`${CONSENT_COOKIE_NAME}=false`);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});
