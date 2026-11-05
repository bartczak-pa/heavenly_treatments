import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CONSENT_COOKIE_NAME } from '@/lib/cookieUtils';

type TrackAbTest = typeof import('@/lib/analytics/trackAbTest');

function clearCookies() {
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  });
}

function giveConsent() {
  document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
}

function eventParams(gtag: ReturnType<typeof vi.fn>, name: string) {
  return gtag.mock.calls
    .filter(([command, eventName]) => command === 'event' && eventName === name)
    .map(([, , params]) => params as Record<string, unknown>);
}

describe('trackAbTest', () => {
  let gtag: ReturnType<typeof vi.fn>;
  let track: TrackAbTest;

  beforeEach(async () => {
    // Fresh module per test: the once-per-page-load fallback flag is module state
    vi.resetModules();
    track = await import('@/lib/analytics/trackAbTest');
    clearCookies();
    sessionStorage.clear();
    vi.stubEnv('NEXT_PUBLIC_AB_TEST_ENABLED', 'true');
    gtag = vi.fn();
    window.gtag = gtag;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    clearCookies();
    sessionStorage.clear();
    delete window.gtag;
  });

  describe('tryRecordParticipantGroup', () => {
    it('reports false while GA4 is not loaded, so the caller can retry', () => {
      delete window.gtag;

      expect(track.tryRecordParticipantGroup('fresha')).toBe(false);
    });

    it('records the group once per visit', () => {
      expect(track.tryRecordParticipantGroup('fresha')).toBe(true);
      expect(track.tryRecordParticipantGroup('fresha')).toBe(true);

      expect(eventParams(gtag, 'ab_test_variant_assigned')).toEqual([
        { ab_test_variant: 'fresha' },
      ]);
    });

    it('still records at most once per page load when sessionStorage is blocked', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('blocked');
      });

      track.tryRecordParticipantGroup('form');
      track.tryRecordParticipantGroup('form');
      expect(track.tryRecordParticipantGroup('form')).toBe(true);

      expect(eventParams(gtag, 'ab_test_variant_assigned')).toHaveLength(1);
    });
  });

  describe('without cookie consent', () => {
    it('sends no booking events, even with GA4 still loaded (consent withdrawn mid-visit)', () => {
      track.trackBookingButtonClick('hero', 'Swedish Massage');
      track.trackBookingRedirect('form', 'hero', 'Swedish Massage');
      track.trackBookingRequest('Swedish Massage');

      expect(gtag).not.toHaveBeenCalled();
    });
  });

  describe('Booking Button click tracking', () => {
    function trackClick() {
      track.trackBookingButtonClick('hero', 'Swedish Massage');
      track.trackBookingRedirect('form', 'hero', 'Swedish Massage');
    }

    it('labels a consented visitor as non_participant while the experiment flag is off', () => {
      vi.stubEnv('NEXT_PUBLIC_AB_TEST_ENABLED', 'false');
      giveConsent();

      trackClick();

      const clicks = eventParams(gtag, 'booking_button_clicked');
      const redirects = eventParams(gtag, 'booking_redirect');
      expect(clicks).toHaveLength(1);
      expect(redirects).toHaveLength(1);
      expect(clicks[0]).toMatchObject({ ab_test_variant: 'non_participant' });
      expect(redirects[0]).toMatchObject({ ab_test_variant: 'non_participant' });
    });

    it("attaches a Participant's Assigned Group", () => {
      giveConsent();
      document.cookie = 'ab_test_variant=user_fresha_group; path=/';

      trackClick();

      expect(eventParams(gtag, 'booking_button_clicked')[0]).toMatchObject({
        ab_test_variant: 'fresha',
        context: 'hero',
      });
      expect(eventParams(gtag, 'booking_redirect')[0]).toMatchObject({
        ab_test_variant: 'fresha',
      });
    });
  });

  describe('Booking Request tracking', () => {
    it("records a Form Group Participant's Booking Request as form", () => {
      giveConsent();
      document.cookie = 'ab_test_variant=user_form_group; path=/';

      track.trackBookingRequest('Swedish Massage');

      expect(eventParams(gtag, 'booking_form_submitted')).toEqual([
        { ab_test_variant: 'form', treatment_name: 'Swedish Massage' },
      ]);
    });

    it("records a Fresha Group Participant's Booking Request as fresha", () => {
      giveConsent();
      document.cookie = 'ab_test_variant=user_fresha_group; path=/';

      track.trackBookingRequest('Swedish Massage');

      expect(eventParams(gtag, 'booking_form_submitted')).toEqual([
        { ab_test_variant: 'fresha', treatment_name: 'Swedish Massage' },
      ]);
    });

    it('records a Booking Request as non_participant while the experiment flag is off', () => {
      vi.stubEnv('NEXT_PUBLIC_AB_TEST_ENABLED', 'false');
      giveConsent();

      track.trackBookingRequest('Swedish Massage');

      expect(eventParams(gtag, 'booking_form_submitted')).toEqual([
        { ab_test_variant: 'non_participant', treatment_name: 'Swedish Massage' },
      ]);
    });

    it('records a Booking Request with no treatment chosen as treatment_name=none', () => {
      giveConsent();
      document.cookie = 'ab_test_variant=user_fresha_group; path=/';

      track.trackBookingRequest();

      expect(eventParams(gtag, 'booking_form_submitted')).toEqual([
        { ab_test_variant: 'fresha', treatment_name: 'none' },
      ]);
    });
  });
});
