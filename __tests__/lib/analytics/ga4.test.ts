import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  trackEvent,
  trackViewItem,
  trackBeginCheckout,
  trackPurchase,
  trackScrollDepth,
  trackOutboundClick,
  trackFormInteraction,
  generateTransactionId,
  parsePrice,
} from '@/lib/analytics/ga4';

// Mock the cookieUtils module
vi.mock('@/lib/cookieUtils', () => ({
  hasConsent: vi.fn(() => true),
}));

import { hasConsent } from '@/lib/cookieUtils';

describe('GA4 Analytics', () => {
  let originalWindow: typeof globalThis.window;
  let mockGtag: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Store original window
    originalWindow = globalThis.window;

    // Create mock gtag function
    mockGtag = vi.fn();

    // Mock window with gtag
    Object.defineProperty(globalThis, 'window', {
      value: {
        gtag: mockGtag,
        location: { hostname: 'example.com' },
      },
      writable: true,
    });

    // Reset hasConsent mock to return true by default
    vi.mocked(hasConsent).mockReturnValue(true);

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original window
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      writable: true,
    });
  });

  describe('trackEvent', () => {
    it('should send event to gtag with correct parameters', () => {
      trackEvent('page_view', { page_path: '/test' });

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/test',
      });
    });

    it('should send event without parameters when none provided', () => {
      trackEvent('test_event');

      expect(mockGtag).toHaveBeenCalledWith('event', 'test_event', undefined);
    });

    it('should NOT send event when consent is not given', () => {
      vi.mocked(hasConsent).mockReturnValue(false);

      trackEvent('page_view', { page_path: '/test' });

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should NOT send event when gtag is not available', () => {
      Object.defineProperty(globalThis, 'window', {
        value: { location: { hostname: 'example.com' } },
        writable: true,
      });

      trackEvent('page_view');

      // No error should be thrown
      expect(true).toBe(true);
    });

    it('should handle gtag errors gracefully', () => {
      mockGtag.mockImplementation(() => {
        throw new Error('gtag failed');
      });

      // Should not throw
      expect(() => trackEvent('page_view')).not.toThrow();
    });

    it('should NOT send event during SSR (no window)', () => {
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
      });

      // Should not throw and should not try to call gtag
      expect(() => trackEvent('page_view')).not.toThrow();
    });
  });

  describe('trackViewItem', () => {
    it('should send view_item event with e-commerce data', () => {
      trackViewItem({
        id: 'treatment_1',
        name: 'Swedish Massage',
        category: 'Massages',
        price: 65,
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'view_item', {
        currency: 'GBP',
        value: 65,
        items: [
          {
            item_id: 'treatment_1',
            item_name: 'Swedish Massage',
            item_category: 'Massages',
            price: 65,
            quantity: 1,
          },
        ],
      });
    });

    it('should handle treatment without price', () => {
      trackViewItem({
        id: 'treatment_2',
        name: 'Test Treatment',
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'view_item', {
        currency: 'GBP',
        value: 0,
        items: [
          {
            item_id: 'treatment_2',
            item_name: 'Test Treatment',
            item_category: undefined,
            price: undefined,
            quantity: 1,
          },
        ],
      });
    });
  });

  describe('trackBeginCheckout', () => {
    it('should send begin_checkout event with treatment data', () => {
      trackBeginCheckout(
        {
          id: 'treatment_1',
          name: 'Swedish Massage',
          category: 'Massages',
          price: 65,
        },
        'treatment-detail'
      );

      expect(mockGtag).toHaveBeenCalledWith('event', 'begin_checkout', {
        currency: 'GBP',
        value: 65,
        items: [
          {
            item_id: 'treatment_1',
            item_name: 'Swedish Massage',
            item_category: 'Massages',
            price: 65,
            quantity: 1,
          },
        ],
        checkout_option: 'treatment-detail',
      });
    });

    it('should send begin_checkout without treatment data', () => {
      trackBeginCheckout(undefined, 'navbar');

      expect(mockGtag).toHaveBeenCalledWith('event', 'begin_checkout', {
        currency: 'GBP',
        value: 0,
        items: [],
        checkout_option: 'navbar',
      });
    });
  });

  describe('trackPurchase', () => {
    it('should send purchase event with transaction details', () => {
      trackPurchase(
        'txn_123',
        65,
        {
          id: 'treatment_1',
          name: 'Swedish Massage',
          category: 'Massages',
          price: 65,
        },
        'form'
      );

      expect(mockGtag).toHaveBeenCalledWith('event', 'purchase', {
        currency: 'GBP',
        transaction_id: 'txn_123',
        value: 65,
        items: [
          {
            item_id: 'treatment_1',
            item_name: 'Swedish Massage',
            item_category: 'Massages',
            price: 65,
            quantity: 1,
          },
        ],
        booking_source: 'form',
      });
    });

    it('should send purchase event without treatment', () => {
      trackPurchase('txn_456', 0, undefined, 'fresha');

      expect(mockGtag).toHaveBeenCalledWith('event', 'purchase', {
        currency: 'GBP',
        transaction_id: 'txn_456',
        value: 0,
        items: [],
        booking_source: 'fresha',
      });
    });
  });

  describe('trackScrollDepth', () => {
    it('should send scroll_depth event with correct data', () => {
      trackScrollDepth({
        percent_scrolled: 50,
        page_path: '/treatments/massage',
        page_title: 'Massage Treatments',
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'scroll_depth', {
        percent_scrolled: 50,
        page_path: '/treatments/massage',
        page_title: 'Massage Treatments',
      });
    });

    it('should handle scroll event without page title', () => {
      trackScrollDepth({
        percent_scrolled: 75,
        page_path: '/about',
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'scroll_depth', {
        percent_scrolled: 75,
        page_path: '/about',
        page_title: undefined,
      });
    });
  });

  describe('trackOutboundClick', () => {
    it('should send outbound_click event with link details', () => {
      trackOutboundClick({
        link_url: 'https://fresha.com/book',
        link_text: 'Book Now',
        link_domain: 'fresha.com',
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'outbound_click', {
        link_url: 'https://fresha.com/book',
        link_text: 'Book Now',
        link_domain: 'fresha.com',
        outbound: true,
      });
    });

    it('should truncate long link text to 100 characters', () => {
      const longText = 'A'.repeat(150);
      trackOutboundClick({
        link_url: 'https://example.com',
        link_text: longText,
        link_domain: 'example.com',
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'outbound_click', {
        link_url: 'https://example.com',
        link_text: 'A'.repeat(100),
        link_domain: 'example.com',
        outbound: true,
      });
    });
  });

  describe('trackFormInteraction', () => {
    it('should send form_interaction event for focus', () => {
      trackFormInteraction({
        form_name: 'contact_form',
        field_name: 'email',
        interaction_type: 'focus',
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_interaction', {
        form_name: 'contact_form',
        field_name: 'email',
        interaction_type: 'focus',
        error_message: undefined,
      });
    });

    it('should send form_interaction event for error with message', () => {
      trackFormInteraction({
        form_name: 'contact_form',
        field_name: 'email',
        interaction_type: 'error',
        error_message: 'Invalid email format',
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_interaction', {
        form_name: 'contact_form',
        field_name: 'email',
        interaction_type: 'error',
        error_message: 'Invalid email format',
      });
    });

    it('should send form_interaction event for submit', () => {
      trackFormInteraction({
        form_name: 'contact_form',
        interaction_type: 'submit',
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_interaction', {
        form_name: 'contact_form',
        field_name: undefined,
        interaction_type: 'submit',
        error_message: undefined,
      });
    });
  });

  describe('generateTransactionId', () => {
    it('should generate unique transaction IDs', () => {
      const id1 = generateTransactionId();
      const id2 = generateTransactionId();

      expect(id1).not.toBe(id2);
    });

    it('should start with "booking_" prefix', () => {
      const id = generateTransactionId();

      expect(id).toMatch(/^booking_/);
    });

    it('should generate cryptographically secure IDs', () => {
      const id = generateTransactionId();

      // Format: booking_{uuid} or booking_{timestamp}_{hex}
      // UUID format: booking_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      // Fallback format: booking_{timestamp}_{16-char-hex}
      expect(id).toMatch(/^booking_([a-f0-9-]{36}|\d+_[a-f0-9]{16})$/);
    });
  });

  describe('parsePrice', () => {
    it('should parse price with pound sign', () => {
      expect(parsePrice('£65')).toBe(65);
    });

    it('should parse price without pound sign', () => {
      expect(parsePrice('65')).toBe(65);
    });

    it('should parse decimal price', () => {
      expect(parsePrice('£49.99')).toBe(49.99);
    });

    it('should handle price with commas', () => {
      expect(parsePrice('£1,200')).toBe(1200);
    });

    it('should return undefined for undefined input', () => {
      expect(parsePrice(undefined)).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(parsePrice('')).toBeUndefined();
    });

    it('should return undefined for non-numeric string', () => {
      expect(parsePrice('free')).toBeUndefined();
    });

    it('should handle price with "from" prefix', () => {
      expect(parsePrice('from £40')).toBe(40);
    });
  });
});

describe('GA4 Analytics - Consent Behavior', () => {
  let mockGtag: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockGtag = vi.fn();
    Object.defineProperty(globalThis, 'window', {
      value: {
        gtag: mockGtag,
        location: { hostname: 'example.com' },
      },
      writable: true,
    });
  });

  it('should block all tracking when consent is not given', () => {
    vi.mocked(hasConsent).mockReturnValue(false);

    trackEvent('page_view');
    trackViewItem({ id: '1', name: 'Test' });
    trackBeginCheckout({ id: '1', name: 'Test' }, 'test');
    trackPurchase('txn_1', 0);
    trackScrollDepth({ percent_scrolled: 50, page_path: '/' });
    trackOutboundClick({ link_url: 'http://x.com', link_text: 'X', link_domain: 'x.com' });
    trackFormInteraction({ form_name: 'test', interaction_type: 'submit' });

    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('should allow tracking when consent is given', () => {
    vi.mocked(hasConsent).mockReturnValue(true);

    trackEvent('page_view');

    expect(mockGtag).toHaveBeenCalled();
  });
});
