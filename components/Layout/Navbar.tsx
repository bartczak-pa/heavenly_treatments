'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { BookingButton } from '@/components/BookingButton';
import { cn } from '@/lib/utils';

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
      <span className="font-serif text-xl font-medium text-espresso sm:text-2xl">
        Heavenly Treatments
      </span>
      <span className="mt-1 font-sans text-[11px] uppercase tracking-[0.18em] text-taupe">
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
    <header className="sticky top-0 z-50 w-full border-b border-clay/30 bg-cream/80 backdrop-blur-md supports-backdrop-filter:bg-cream/70">
      <div className="mx-auto flex h-[60px] w-full max-w-7xl items-center justify-between px-4 sm:h-[73px] sm:px-6 lg:px-8">
        <Wordmark />

        {/* Desktop / tablet: inline nav + Book pill (condensed spacing at tablet) */}
        <div className="hidden items-center gap-5 sm:flex lg:gap-8">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-4 lg:gap-7">
              {navLinks.map((item) => {
                const active = isActiveRoute(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'inline-flex min-h-[48px] items-center text-sm font-medium transition-colors hover:text-sage',
                        active ? 'text-sage' : 'text-cocoa',
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
            className="h-12 rounded-full bg-sage px-6 text-warm-white shadow-sm hover:bg-sage-hover"
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
                className="fixed inset-0 z-50 flex flex-col bg-espresso text-cream focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
                aria-label="Site menu"
                aria-describedby={undefined}
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>

                <div className="flex h-[60px] items-center justify-between px-4">
                  <span className="font-serif text-xl font-medium text-cream">
                    Heavenly Treatments
                  </span>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="inline-flex size-12 items-center justify-center rounded-full text-cream transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
                    >
                      <X className="size-6" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav
                  aria-label="Mobile primary"
                  className="flex flex-1 flex-col items-center justify-center gap-2"
                >
                  {navLinks.map((item) => {
                    const active = isActiveRoute(item.href, pathname);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeOverlay}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex min-h-[48px] items-center py-3 font-serif text-[38px] font-medium leading-tight transition-colors hover:text-clay',
                          active ? 'text-clay' : 'text-cream',
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  <BookingButton
                    context="navbar"
                    size="lg"
                    onClick={closeOverlay}
                    className="mt-8 h-12 rounded-full bg-cream px-8 text-espresso shadow-sm hover:bg-warm-white"
                  >
                    Book Now
                  </BookingButton>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
