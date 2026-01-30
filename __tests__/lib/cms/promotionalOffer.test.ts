import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getActivePromotionalOffer } from '@/lib/cms/promotionalOffer';
import { sanityClient } from '@/lib/sanity/client';
import { SanityPromotionalOffer } from '@/lib/sanity/types';

// Mock the Sanity client
vi.mock('@/lib/sanity/client', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}));

// Mock the image utility
vi.mock('@/lib/sanity/image', () => ({
  getImageUrl: vi.fn(
    () => 'https://cdn.sanity.io/images/test/production/mock-image.jpg'
  ),
}));

const mockSanityOffer: SanityPromotionalOffer = {
  _id: 'promo-1',
  title: 'Spring Special',
  description: 'Get 20% off all facials this spring!',
  image: { asset: { _ref: 'image-abc123' }, alt: 'Spring flowers' } as SanityPromotionalOffer['image'],
  ctaText: 'Book Now',
  ctaLink: '/contact',
  isActive: true,
  dismissDurationDays: 7,
  displayDelaySeconds: 3,
};

describe('getActivePromotionalOffer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a transformed PromotionalOffer when Sanity returns an active offer', async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue(mockSanityOffer as never);

    const result = await getActivePromotionalOffer();

    expect(result).toEqual({
      id: 'promo-1',
      title: 'Spring Special',
      description: 'Get 20% off all facials this spring!',
      image: 'https://cdn.sanity.io/images/test/production/mock-image.jpg',
      imageAlt: 'Spring flowers',
      ctaText: 'Book Now',
      ctaLink: '/contact',
      dismissDurationDays: 7,
      displayDelaySeconds: 3,
    });
  });

  it('returns null when Sanity returns no offer', async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue(null as never);

    const result = await getActivePromotionalOffer();

    expect(result).toBeNull();
  });

  it('returns null when Sanity fetch throws an error', async () => {
    vi.mocked(sanityClient.fetch).mockRejectedValue(new Error('Network error'));

    const result = await getActivePromotionalOffer();

    expect(result).toBeNull();
  });

  it('returns offer without image when image is not provided', async () => {
    const offerWithoutImage = { ...mockSanityOffer, image: undefined };
    vi.mocked(sanityClient.fetch).mockResolvedValue(offerWithoutImage as never);

    const result = await getActivePromotionalOffer();

    expect(result).not.toBeNull();
    expect(result!.image).toBeUndefined();
    expect(result!.imageAlt).toBeUndefined();
  });
});
