import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromotionalDialog } from '@/components/Layout/PromotionalDialog';
import { PromotionalOffer } from '@/lib/data/promotionalOffer';
import { trackEvent } from '@/lib/analytics/ga4';

vi.mock('@/lib/analytics/ga4', () => ({
  trackEvent: vi.fn(),
}));

const mockTrackEvent = vi.mocked(trackEvent);

const mockOffer: PromotionalOffer = {
  id: 'promo-1',
  title: 'Spring Special',
  description: 'Get 20% off all facials this spring!',
  image: 'https://cdn.sanity.io/images/test/production/mock-image.jpg',
  imageAlt: 'Spring flowers',
  ctaText: 'Book Now',
  ctaLink: '/contact',
  dismissDurationDays: 7,
  displayDelaySeconds: 3,
};

const mockOfferExternal: PromotionalOffer = {
  ...mockOffer,
  ctaLink: 'https://example.com/book',
};

const mockOfferNoImage: PromotionalOffer = {
  ...mockOffer,
  image: undefined,
  imageAlt: undefined,
};

describe('PromotionalDialog', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    localStorage.clear();
    mockTrackEvent.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Visibility & Timing', () => {
    it('is NOT visible immediately after render', () => {
      render(<PromotionalDialog offer={mockOffer} />);

      expect(
        screen.queryByText('Spring Special')
      ).not.toBeInTheDocument();
    });

    it('becomes visible after the configured delay', async () => {
      render(<PromotionalDialog offer={mockOffer} />);

      // Not visible before delay
      expect(screen.queryByText('Spring Special')).not.toBeInTheDocument();

      // Advance past the 3-second delay
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByText('Spring Special')).toBeInTheDocument();
    });

    it('shows the offer title, description, and CTA button text', async () => {
      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByText('Spring Special')).toBeInTheDocument();
      expect(
        screen.getByText('Get 20% off all facials this spring!')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Book Now' })
      ).toBeInTheDocument();
    });
  });

  describe('Dismissal behavior', () => {
    it('hides the dialog when clicking "No thanks"', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByText('Spring Special')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /no thanks/i }));

      expect(screen.queryByText('Spring Special')).not.toBeInTheDocument();
    });

    it('records dismissal to localStorage when dismissed', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      await user.click(screen.getByRole('button', { name: /no thanks/i }));

      const stored = localStorage.getItem('promo_dismissed_promo-1');
      expect(stored).not.toBeNull();
    });

    it('does not show dialog when localStorage has a recent dismissal', async () => {
      // Set a recent dismissal (within dismissDurationDays)
      localStorage.setItem(
        'promo_dismissed_promo-1',
        JSON.stringify({ timestamp: Date.now() })
      );

      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.queryByText('Spring Special')).not.toBeInTheDocument();
    });

    it('shows dialog when localStorage dismissal has expired', async () => {
      // Set an expired dismissal (8 days ago, dismissDurationDays is 7)
      const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
      localStorage.setItem(
        'promo_dismissed_promo-1',
        JSON.stringify({ timestamp: eightDaysAgo })
      );

      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByText('Spring Special')).toBeInTheDocument();
    });
  });

  describe('Content rendering', () => {
    it('shows image when provided', async () => {
      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      const image = screen.getByRole('img', { name: 'Spring flowers' });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('mock-image')
      );
    });

    it('does not show image element when absent', async () => {
      render(<PromotionalDialog offer={mockOfferNoImage} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('CTA link has correct href', async () => {
      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      const ctaLink = screen.getByRole('link', { name: 'Book Now' });
      expect(ctaLink).toHaveAttribute('href', '/contact');
    });

    it('external links open in new tab', async () => {
      render(<PromotionalDialog offer={mockOfferExternal} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      const ctaLink = screen.getByRole('link', { name: 'Book Now' });
      expect(ctaLink).toHaveAttribute('target', '_blank');
      expect(ctaLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('internal links do NOT have target="_blank"', async () => {
      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      const ctaLink = screen.getByRole('link', { name: 'Book Now' });
      expect(ctaLink).not.toHaveAttribute('target', '_blank');
    });
  });

  describe('CTA behavior', () => {
    it('CTA button records dismissal so dialog will not reappear', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      await user.click(screen.getByRole('link', { name: 'Book Now' }));

      const stored = localStorage.getItem('promo_dismissed_promo-1');
      expect(stored).not.toBeNull();
    });
  });

  describe('GA4 event tracking', () => {
    it('fires promo_dialog_view when dialog opens after delay', async () => {
      render(<PromotionalDialog offer={mockOffer} />);

      expect(mockTrackEvent).not.toHaveBeenCalled();

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockTrackEvent).toHaveBeenCalledWith('promo_dialog_view', {
        offer_id: 'promo-1',
        offer_title: 'Spring Special',
      });
    });

    it('fires promo_dialog_cta_click when CTA is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      mockTrackEvent.mockClear();
      await user.click(screen.getByRole('link', { name: 'Book Now' }));

      expect(mockTrackEvent).toHaveBeenCalledWith('promo_dialog_cta_click', {
        offer_id: 'promo-1',
        offer_title: 'Spring Special',
        cta_text: 'Book Now',
        cta_link: '/contact',
      });
    });

    it('fires promo_dialog_dismiss when "No thanks" is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      mockTrackEvent.mockClear();
      await user.click(screen.getByRole('button', { name: /no thanks/i }));

      expect(mockTrackEvent).toHaveBeenCalledWith('promo_dialog_dismiss', {
        offer_id: 'promo-1',
        offer_title: 'Spring Special',
      });
    });

    it('does not fire promo_dialog_view when dialog is suppressed by dismissal', async () => {
      localStorage.setItem(
        'promo_dismissed_promo-1',
        JSON.stringify({ timestamp: Date.now() })
      );

      render(<PromotionalDialog offer={mockOffer} />);

      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(mockTrackEvent).not.toHaveBeenCalled();
    });
  });
});
