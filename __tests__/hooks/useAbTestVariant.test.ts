import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAbTestVariant } from '@/hooks/useAbTestVariant';
import { notifyConsentChange } from '@/lib/cookieUtils';

const CONSENT_COOKIE = 'HeavenlyTreatmentsCookieConsent';

function clearCookies() {
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  });
}

function giveConsent() {
  document.cookie = `${CONSENT_COOKIE}=true; path=/`;
}

function eventsNamed(gtag: ReturnType<typeof vi.fn>, name: string) {
  return gtag.mock.calls.filter(
    ([command, eventName]) => command === 'event' && eventName === name
  );
}

describe('useAbTestVariant', () => {
  let gtag: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clearCookies();
    sessionStorage.clear();
    vi.stubEnv('NEXT_PUBLIC_AB_TEST_ENABLED', 'true');
    gtag = vi.fn();
    window.gtag = gtag;
  });

  afterEach(() => {
    clearCookies();
    sessionStorage.clear();
    vi.unstubAllEnvs();
    vi.useRealTimers();
    delete window.gtag;
  });

  it('keeps a visitor without consent on the Form Route and records nothing', () => {
    const { result } = renderHook(() => useAbTestVariant());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isParticipant).toBe(false);
    expect(result.current.variant).toBe('form');
    expect(gtag).not.toHaveBeenCalled();
  });

  it('records a Participant group once per visit, however many Booking Buttons mount', () => {
    giveConsent();

    const hooks = Array.from({ length: 5 }, () =>
      renderHook(() => useAbTestVariant())
    );
    // Navigating to another page re-mounts the buttons
    hooks.forEach((h) => h.unmount());
    renderHook(() => useAbTestVariant());

    const assigned = eventsNamed(gtag, 'ab_test_variant_assigned');
    expect(assigned).toHaveLength(1);
    expect(assigned[0][2]).toEqual({
      ab_test_variant: hooks[0].result.current.variant,
    });
  });

  it('sends no extra page_view', () => {
    giveConsent();

    renderHook(() => useAbTestVariant());

    expect(eventsNamed(gtag, 'page_view')).toHaveLength(0);
  });

  it('makes a visitor who accepts partway through a visit a Participant from then on', () => {
    const { result } = renderHook(() => useAbTestVariant());
    expect(result.current.isParticipant).toBe(false);

    act(() => {
      giveConsent();
      notifyConsentChange();
    });

    expect(result.current.isParticipant).toBe(true);
    expect(eventsNamed(gtag, 'ab_test_variant_assigned')).toHaveLength(1);
  });

  it('records the group once GA4 finishes loading if it was not ready yet', () => {
    vi.useFakeTimers();
    delete window.gtag;
    giveConsent();

    renderHook(() => useAbTestVariant());

    window.gtag = gtag;
    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(eventsNamed(gtag, 'ab_test_variant_assigned')).toHaveLength(1);
  });

  it('changes nothing with the experiment flag off', () => {
    vi.stubEnv('NEXT_PUBLIC_AB_TEST_ENABLED', 'false');
    giveConsent();

    const { result } = renderHook(() => useAbTestVariant());

    expect(result.current.isParticipant).toBe(false);
    expect(result.current.variant).toBe('form');
    expect(gtag).not.toHaveBeenCalled();
    expect(document.cookie).not.toContain('ab_test_variant=');
  });
});
