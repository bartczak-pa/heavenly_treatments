import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Cookies from 'js-cookie';
import {
  assignVariantFromId,
  getVariantAssignment,
} from '@/lib/abTesting/variantAssignment';
import { getBookingUrl } from '@/lib/abTesting/getBookingUrl';
import { CONSENT_COOKIE_NAME as CONSENT_COOKIE } from '@/lib/cookieUtils';
const FRESHA_URL = 'https://www.fresha.com/book/swedish-massage';

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

function groupCookie(): string | undefined {
  return document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('ab_test_variant='))
    ?.split('=')[1];
}

function bookingUrlFor(
  treatmentTitle?: string,
  freshaUrl?: string
): string {
  return getBookingUrl(
    'treatment-card',
    getVariantAssignment().variant,
    treatmentTitle,
    freshaUrl
  );
}

describe('Booking Route Experiment assignment', () => {
  beforeEach(() => {
    clearCookies();
    vi.stubEnv('NEXT_PUBLIC_AB_TEST_ENABLED', 'true');
  });

  afterEach(() => {
    clearCookies();
    vi.unstubAllEnvs();
  });

  describe('visitor without cookie consent', () => {
    it('is not a Participant and stores no group cookie', () => {
      const assignment = getVariantAssignment();

      expect(assignment.isParticipant).toBe(false);
      expect(assignment.variant).toBe('form');
      expect(groupCookie()).toBeUndefined();
    });

    it('declined consent is treated the same as no answer', () => {
      document.cookie = `${CONSENT_COOKIE}=false; path=/`;

      expect(getVariantAssignment().isParticipant).toBe(false);
      expect(groupCookie()).toBeUndefined();
    });

    it('gets the Form Route on every Booking Button', () => {
      expect(bookingUrlFor('Swedish Massage', FRESHA_URL)).toBe(
        '/contact?treatment=Swedish%20Massage'
      );
      expect(bookingUrlFor()).toBe('/contact');
      expect(groupCookie()).toBeUndefined();
    });
  });

  describe('visitor who accepted cookies', () => {
    beforeEach(giveConsent);

    it('becomes a Participant and gets a stored group cookie', () => {
      const assignment = getVariantAssignment();

      expect(assignment.isParticipant).toBe(true);
      expect(['form', 'fresha']).toContain(assignment.variant);
      const storedId = groupCookie();
      expect(storedId).toMatch(/^user_/);
      expect(assignVariantFromId(storedId!)).toBe(assignment.variant);
    });

    it('stays in the same group on later page loads and visits', () => {
      const first = getVariantAssignment();
      const storedId = groupCookie();
      const later = getVariantAssignment();

      expect(groupCookie()).toBe(storedId);
      expect(later.variant).toBe(first.variant);
    });

    it('stores the group cookie for a year, site-wide', () => {
      const set = vi.spyOn(Cookies, 'set');

      getVariantAssignment();

      expect(set).toHaveBeenCalledWith(
        'ab_test_variant',
        expect.stringMatching(/^user_/),
        expect.objectContaining({ expires: 365, path: '/', sameSite: 'Lax' })
      );
      set.mockRestore();
    });

    it('is routed by their Assigned Group', () => {
      document.cookie = 'ab_test_variant=user_fresha_group; path=/';
      // Guard: confirm the fixture ID really lands in the Fresha Group
      expect(assignVariantFromId('user_fresha_group')).toBe('fresha');

      expect(
        bookingUrlFor('Swedish Massage', FRESHA_URL).startsWith(
          `${FRESHA_URL}?utm_source=website`
        )
      ).toBe(true);
    });
  });

  describe('experiment flag off', () => {
    beforeEach(() => {
      vi.stubEnv('NEXT_PUBLIC_AB_TEST_ENABLED', 'false');
      giveConsent();
    });

    it('stores no cookie and uses the Form Route even with consent', () => {
      expect(getVariantAssignment().isParticipant).toBe(false);
      expect(bookingUrlFor('Swedish Massage', FRESHA_URL)).toBe(
        '/contact?treatment=Swedish%20Massage'
      );
      expect(groupCookie()).toBeUndefined();
    });
  });

  describe('assignVariantFromId', () => {
    it('always gives the same group for the same ID', () => {
      expect(assignVariantFromId('user_abc')).toBe(
        assignVariantFromId('user_abc')
      );
    });

    it('splits many IDs roughly 50/50 between the two groups', () => {
      const total = 10_000;
      let fresha = 0;
      for (let i = 0; i < total; i++) {
        const id = `user_${1_700_000_000_000 + i * 7919}_${i.toString(36)}`;
        if (assignVariantFromId(id) === 'fresha') fresha++;
      }

      expect(fresha / total).toBeGreaterThan(0.45);
      expect(fresha / total).toBeLessThan(0.55);
    });
  });
});
