import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { BookingButton } from '@/components/BookingButton';
import { contactInfo } from '@/lib/data/contactInfo';
import { cn } from '@/lib/utils';

interface BookingCtaBandProps {
  className?: string;
}

/**
 * Reusable Sage booking call-to-action band.
 *
 * Pairs the "Your journey to relaxation starts here" CTA with a contact card
 * (address, phone, email sourced from {@link contactInfo}). Rendered site-wide
 * above the footer via MainLayout, but standalone so individual pages can
 * compose it where needed.
 *
 * @component
 */
export default function BookingCtaBand({ className }: BookingCtaBandProps) {
  const { address, phone, email } = contactInfo;
  const fullAddress = `${address.streetAddress}, ${address.addressLocality} ${address.postalCode}`;
  // Strip spaces for the tel: href while keeping the display value readable.
  const telHref = `tel:${phone.replace(/\s+/g, '')}`;

  return (
    <section
      aria-labelledby="booking-cta-heading"
      className={cn('bg-sage text-warm-white', className)}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
        {/* CTA copy */}
        <div>
          <p className="mb-3 font-sans text-sm uppercase tracking-[0.18em] text-warm-white/80">
            ✦ Book your visit
          </p>
          <h2
            id="booking-cta-heading"
            className="font-serif text-4xl font-medium leading-tight text-warm-white md:text-5xl"
          >
            Your journey to relaxation starts here
          </h2>
          <p className="mt-4 max-w-md text-warm-white/90">
            Treat yourself to a moment of calm. Book your treatment today and let
            the everyday melt away.
          </p>
          <BookingButton
            context="location-section"
            size="lg"
            className="mt-8 h-12 rounded-full bg-warm-white px-8 text-sage shadow-sm hover:bg-cream hover:text-sage-hover"
          >
            Book Now
          </BookingButton>
        </div>

        {/* Contact card */}
        <div className="rounded-2xl bg-warm-white p-8 text-cocoa shadow-md">
          <h3 className="font-serif text-2xl font-medium text-espresso">
            Get in touch
          </h3>
          <ul className="mt-6 space-y-5">
            <li className="flex items-start gap-4">
              <MapPin className="mt-0.5 size-5 flex-shrink-0 text-sage" aria-hidden="true" />
              <address className="not-italic leading-relaxed text-taupe">
                {fullAddress}
              </address>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="size-5 flex-shrink-0 text-sage" aria-hidden="true" />
              <a
                href={telHref}
                className="inline-flex min-h-[48px] items-center text-taupe transition-colors hover:text-sage"
              >
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="size-5 flex-shrink-0 text-sage" aria-hidden="true" />
              <a
                href={`mailto:${email}`}
                className="inline-flex min-h-[48px] items-center break-all text-taupe transition-colors hover:text-sage"
              >
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
