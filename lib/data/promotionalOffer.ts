/**
 * App-level promotional offer type (transformed from Sanity response)
 */
export interface PromotionalOffer {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  ctaText: string;
  ctaLink: string;
  dismissDurationDays: number;
  displayDelaySeconds: number;
}
