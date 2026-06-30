'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu } from 'lucide-react';
import { BookingButton } from '@/components/BookingButton';
import { contactInfo } from '@/lib/data/contactInfo';
import { cn } from '@/lib/utils';

const navContactPhone = contactInfo.phone;
const navContactEmail = contactInfo.email;
const navContactTelHref = `tel:${navContactPhone.replace(/\s+/g, '')}`;

/**
 * Primary site navigation for the Sanctuary redesign.
 *
 * - Sticky, translucent cream header with blur and a wordmark lockup.
 * - Inline desktop/tablet nav with a Sage "Book Now" pill.
 * - Collapses to a hamburger at the mobile breakpoint (≤640px) that opens a
 *   full-screen Espresso overlay with Cormorant links.
 *
 * Accessibility: the overlay is a Radix Dialog, giving Esc-to-close, focus
 * trapping, and scroll-lock. All interactive targets are ≥48px.
 *
 * @component
 */

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/treatments', label: 'Treatments' },
  { href: '/contact', label: 'Contact' },
] as const;

interface WordmarkProps {
  className?: string;
}

/**
 * Returns true when `href` is the active route. The home route ("/") matches
 * exactly; section routes match the current path or any nested sub-path.
 */
function isActiveRoute(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Brand wordmark + location lockup, links to home. */
function Wordmark({ className }: WordmarkProps) {
  return (
    <Link
      href="/"
      className={cn(
        'flex flex-col leading-none transition-opacity hover:opacity-80',
        className,
      )}
    >
      <span className="font-serif text-xl font-semibold text-espresso sm:text-2xl">
        Heavenly Treatments
      </span>
      <span className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.34em] text-sage">
        with Hayleybell · Kelso
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const pathname = usePathname();

  const closeOverlay = () => setIsOverlayOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cocoa/[8%] bg-cream/[86%] backdrop-blur-[10px] supports-backdrop-filter:bg-cream/[80%]">
      <div className="mx-auto flex h-[60px] w-full max-w-7xl items-center justify-between px-4 sm:h-[73px] sm:px-6 lg:px-8">
        <Wordmark />

        {/* Desktop / tablet: inline nav + Book pill */}
        <div className="hidden items-center gap-5 sm:flex lg:gap-[38px]">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-5 lg:gap-[38px]">
              {navLinks.map((item) => {
                const active = isActiveRoute(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'inline-flex min-h-[48px] items-center text-sm font-medium transition-colors hover:text-cocoa',
                        active ? 'text-cocoa' : 'text-[#6B6157]',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <BookingButton
            context="navbar"
            size="lg"
            className="rounded-full bg-sage py-[11px] px-6 text-[13px] font-semibold text-warm-white hover:bg-sage-hover"
          >
            Book Now
          </BookingButton>
        </div>

        {/* Mobile: hamburger → full-screen Espresso overlay */}
        <div className="sm:hidden">
          <Dialog.Root open={isOverlayOpen} onOpenChange={setIsOverlayOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex size-12 items-center justify-center rounded-full text-espresso transition-colors hover:bg-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <Menu className="size-6" aria-hidden="true" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Content
                className="fixed inset-0 z-50 flex flex-col bg-espresso px-[30px] pt-[30px] pb-[34px] text-cream focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
                aria-label="Site menu"
                aria-describedby={undefined}
              >
                {/* Header row */}
                <div className="mb-10 flex items-center justify-between">
                  <Dialog.Title className="font-serif text-[22px] font-semibold text-cream">
                    Menu
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="inline-flex size-[38px] items-center justify-center rounded-full border border-white/30 text-[20px] text-cream transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
                    >
                      ✕
                    </button>
                  </Dialog.Close>
                </div>

                {/* Nav links — top-aligned, not centered */}
                <nav aria-label="Mobile primary" className="flex flex-col gap-1">
                  {navLinks.map((item) => {
                    const active = isActiveRoute(item.href, pathname);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeOverlay}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex min-h-[48px] w-full items-center border-b border-white/[12%] py-3 font-serif text-[38px] font-medium leading-tight transition-colors hover:text-clay',
                          active ? 'text-clay' : 'text-cream',
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Contact info — pushed to bottom */}
                <div className="mt-auto flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage">
                    Get in touch
                  </span>
                  <a
                    href={navContactTelHref}
                    className="text-[15px] text-cream transition-colors hover:text-clay"
                  >
                    {navContactPhone}
                  </a>
                  <a
                    href={`mailto:${navContactEmail}`}
                    className="text-[15px] text-cream/70 transition-colors hover:text-clay"
                  >
                    {navContactEmail}
                  </a>
                  <div className="mt-2 flex gap-[14px]">
                    <a
                      href="https://www.facebook.com/heavenlytreatmentswithhayleybell"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-semibold text-clay transition-colors hover:text-cream"
                    >
                      Facebook
                    </a>
                    <a
                      href="https://www.instagram.com/heavenlytreatments_hayleybell/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-semibold text-clay transition-colors hover:text-cream"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
