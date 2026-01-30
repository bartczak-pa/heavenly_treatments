'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { trackEvent } from '@/lib/analytics/ga4';

interface PromotionalDialogProps {
  offer: PromotionalOffer;
}

function getStorageKey(offerId: string): string {
  return `promo_dismissed_${offerId}`;
}

function isDismissed(offerId: string, dismissDurationDays: number): boolean {
  try {
    const stored = localStorage.getItem(getStorageKey(offerId));
    if (!stored) return false;

    const { timestamp } = JSON.parse(stored);
    const dismissDurationMs = dismissDurationDays * 24 * 60 * 60 * 1000;
    return Date.now() - timestamp < dismissDurationMs;
  } catch {
    return false;
  }
}

function recordDismissal(offerId: string): void {
  localStorage.setItem(
    getStorageKey(offerId),
    JSON.stringify({ timestamp: Date.now() })
  );
}

function isExternalLink(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

export function PromotionalDialog({ offer }: PromotionalDialogProps) {
  const [open, setOpen] = useState(false);

  const handleDismiss = useCallback(() => {
    trackEvent('promo_dialog_dismiss', {
      offer_id: offer.id,
      offer_title: offer.title,
    });
    recordDismissal(offer.id);
    setOpen(false);
  }, [offer.id, offer.title]);

  useEffect(() => {
    if (isDismissed(offer.id, offer.dismissDurationDays)) return;

    const timer = setTimeout(() => {
      setOpen(true);
      trackEvent('promo_dialog_view', {
        offer_id: offer.id,
        offer_title: offer.title,
      });
    }, offer.displayDelaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [offer.id, offer.dismissDurationDays, offer.displayDelaySeconds]);

  const external = isExternalLink(offer.ctaLink);

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
              href={offer.ctaLink}
              onClick={() => {
                trackEvent('promo_dialog_cta_click', {
                  offer_id: offer.id,
                  offer_title: offer.title,
                  cta_text: offer.ctaText,
                  cta_link: offer.ctaLink,
                });
                recordDismissal(offer.id);
              }}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {offer.ctaText}
            </a>
          </Button>
          <Button variant="ghost" onClick={handleDismiss}>
            No thanks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
