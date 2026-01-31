'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PromotionalOffer } from '@/lib/data/promotionalOffer';
import {
  trackEvent,
  type PromoDialogEventData,
  type PromoDialogCTAClickData,
} from '@/lib/analytics/ga4';

interface PromotionalDialogProps {
  offer: PromotionalOffer;
}

function getStorageKey(offerId: string): string {
  return `promo_dismissed_${offerId}`;
}

function isDismissed(offerId: string, dismissDurationDays: number): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(getStorageKey(offerId));
    if (!stored) return false;

    const { timestamp } = JSON.parse(stored);
    const dismissDurationMs = dismissDurationDays * 24 * 60 * 60 * 1000;
    return Date.now() - timestamp < dismissDurationMs;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[PromotionalDialog] Failed to parse dismissal data:', error);
    }
    localStorage.removeItem(getStorageKey(offerId));
    return false;
  }
}

function recordDismissal(offerId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      getStorageKey(offerId),
      JSON.stringify({ timestamp: Date.now() })
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[PromotionalDialog] Failed to write dismissal data:', error);
    }
  }
}

function isExternalLink(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/** Sanitize URL by trimming whitespace and blocking dangerous schemes (XSS via CMS injection) */
function getSafeUrl(url: string): string {
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:')
  ) {
    return '#';
  }
  return trimmed;
}

export function PromotionalDialog({ offer }: PromotionalDialogProps) {
  const [open, setOpen] = useState(false);
  const hasShown = useRef(false);
  const closedByCta = useRef(false);

  const baseEventData: PromoDialogEventData = useMemo(() => ({
    offer_id: offer.id,
    offer_title: offer.title,
  }), [offer.id, offer.title]);

  const handleDismiss = useCallback(() => {
    if (closedByCta.current) {
      closedByCta.current = false;
      setOpen(false);
      return;
    }
    trackEvent('promo_dialog_dismiss', baseEventData);
    recordDismissal(offer.id);
    setOpen(false);
  }, [offer.id, baseEventData]);

  useEffect(() => {
    if (hasShown.current) return;
    if (isDismissed(offer.id, offer.dismissDurationDays)) return;

    const timer = setTimeout(() => {
      hasShown.current = true;
      setOpen(true);
      trackEvent('promo_dialog_view', baseEventData);
    }, offer.displayDelaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [offer.id, offer.dismissDurationDays, offer.displayDelaySeconds, baseEventData]);

  const safeCtaLink = getSafeUrl(offer.ctaLink);
  const external = isExternalLink(safeCtaLink);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleDismiss();
    }}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{offer.title}</DialogTitle>
          <DialogDescription className="whitespace-pre-line">{offer.description}</DialogDescription>
        </DialogHeader>

        {offer.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image
              src={offer.image}
              alt={offer.imageAlt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 32rem"
            />
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button asChild>
            <a
              href={safeCtaLink}
              onClick={() => {
                closedByCta.current = true;
                const ctaData: PromoDialogCTAClickData = {
                  ...baseEventData,
                  cta_text: offer.ctaText,
                  cta_link: safeCtaLink,
                };
                trackEvent('promo_dialog_cta_click', ctaData);
                recordDismissal(offer.id);
              }}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {offer.ctaText}
            </a>
          </Button>
          <Button variant="ghost" onClick={handleDismiss} aria-label="Dismiss promotional offer">
            No thanks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
