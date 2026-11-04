import { describe, it, expect, vi, afterEach } from 'vitest';
import { getBookingUrl } from '@/lib/abTesting/getBookingUrl';

const CAMPAIGN_TAGS =
  'utm_source=website&utm_medium=booking_button&utm_campaign=booking_route_test';

describe('getBookingUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('Fresha Group', () => {
    it('tags a treatment-specific Fresha link with the campaign and button context', () => {
      expect(
        getBookingUrl(
          'treatment-card',
          'fresha',
          'Swedish Massage',
          'https://www.fresha.com/book/swedish-massage'
        )
      ).toBe(
        `https://www.fresha.com/book/swedish-massage?${CAMPAIGN_TAGS}&utm_content=treatment-card`
      );
    });

    it('tags the general Fresha profile link used when the treatment has none', () => {
      vi.stubEnv(
        'NEXT_PUBLIC_FRESHA_GENERAL_URL',
        'https://www.fresha.com/a/heavenly-treatments'
      );

      expect(getBookingUrl('navbar', 'fresha')).toBe(
        `https://www.fresha.com/a/heavenly-treatments?${CAMPAIGN_TAGS}&utm_content=navbar`
      );
    });

    it('keeps query parameters and hash already on the Fresha link', () => {
      expect(
        getBookingUrl(
          'treatment-detail',
          'fresha',
          'Hot Stone Massage',
          'https://www.fresha.com/book-now/heavenly?share=true&pId=123#services'
        )
      ).toBe(
        `https://www.fresha.com/book-now/heavenly?share=true&pId=123&${CAMPAIGN_TAGS}&utm_content=treatment-detail#services`
      );
    });

    it('returns a malformed Fresha link untagged instead of throwing', () => {
      expect(
        getBookingUrl('treatment-card', 'fresha', 'Swedish Massage', 'not a url')
      ).toBe('not a url');
    });

    it('falls back to the untagged contact page when no Fresha link is configured', () => {
      vi.stubEnv('NEXT_PUBLIC_FRESHA_GENERAL_URL', '');

      expect(getBookingUrl('hero', 'fresha')).toBe('/contact');
    });
  });

  describe('Form Group', () => {
    it('sends visitors to the untagged contact form, even when a Fresha link exists', () => {
      expect(
        getBookingUrl(
          'treatment-card',
          'form',
          'Swedish Massage',
          'https://www.fresha.com/book/swedish-massage'
        )
      ).toBe('/contact?treatment=Swedish%20Massage');
      expect(getBookingUrl('navbar', 'form')).toBe('/contact');
    });
  });
});
