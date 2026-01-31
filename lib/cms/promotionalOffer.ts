import { sanityClient } from '@/lib/sanity/client';
import { activePromotionalOfferQuery } from '@/lib/sanity/queries';
import { getImageUrl } from '@/lib/sanity/image';
import { SanityPromotionalOffer } from '@/lib/sanity/types';
import { PromotionalOffer } from '@/lib/data/promotionalOffer';

/** Max width for promotional dialog images (matches sizes prop: 640px mobile breakpoint) */
const PROMO_IMAGE_WIDTH = 640;

/** Tiny image width for blur placeholder */
const PROMO_BLUR_WIDTH = 20;

/**
 * Transform Sanity promotional offer to app format
 */
function transformPromotionalOffer(
  sanityOffer: SanityPromotionalOffer
): PromotionalOffer {
  return {
    id: sanityOffer._id,
    title: sanityOffer.title,
    description: sanityOffer.description,
    image: sanityOffer.image
      ? getImageUrl(sanityOffer.image, PROMO_IMAGE_WIDTH, undefined, 90)
      : undefined,
    imageAlt: sanityOffer.image?.alt ?? undefined,
    imageBlurDataURL: sanityOffer.image
      ? getImageUrl(sanityOffer.image, PROMO_BLUR_WIDTH, undefined, 30)
      : undefined,
    ctaText: sanityOffer.ctaText,
    ctaLink: sanityOffer.ctaLink,
    dismissDurationDays: sanityOffer.dismissDurationDays,
    displayDelaySeconds: sanityOffer.displayDelaySeconds,
  };
}

/**
 * Fetch the currently active promotional offer from Sanity
 * Returns null if no active offer exists or on error
 */
export async function getActivePromotionalOffer(): Promise<PromotionalOffer | null> {
  try {
    const offer =
      await sanityClient.fetch<SanityPromotionalOffer | null>(
        activePromotionalOfferQuery,
        {},
        { next: { revalidate: 3600, tags: ['promotional-offer'] } }
      );
    return offer ? transformPromotionalOffer(offer) : null;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Sanity] Failed to fetch promotional offer: ${message}`);
    return null;
  }
}
