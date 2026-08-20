import React from 'react';
import { BookingButton } from '@/components/BookingButton';
import { contactInfo } from '@/lib/data/contactInfo';
import { cn } from '@/lib/utils';

interface BookingCtaBandProps {
  className?: string;
}

const { address, phone, email } = contactInfo;
const fullAddress = `${address.streetAddress}, ${address.addressLocality} ${address.postalCode}`;
const telHref = `tel:${phone.replace(/\s+/g, '')}`;

export default function BookingCtaBand({ className }: BookingCtaBandProps) {
  return (
    <section
      aria-labelledby="booking-cta-heading"
      className={cn('bg-sage text-warm-white', className)}
    >
      <div className="mx-auto max-w-7xl px-[30px] py-12 text-center lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-[60px] lg:px-8 lg:py-[92px] lg:text-left">
        {/* CTA copy */}
        <div>
          <h2
            id="booking-cta-heading"
            className="font-serif text-[38px] font-medium leading-[1.08] text-warm-white lg:text-[54px]"
          >
            Your journey to relaxation starts here
          </h2>
          <p className="mx-auto mt-[14px] max-w-[440px] text-[15px] leading-[1.7] text-warm-white/88 lg:mx-0 lg:mt-[22px] lg:text-[17px] lg:leading-[1.75]">
            Appointments Monday to Sunday, 10am–5pm, with some evenings
            available. Send a message and I&apos;ll get back to you with my
            availability.
          </p>
          <BookingButton
            context="location-section"
            size="lg"
            className="mt-6 h-auto rounded-full bg-warm-white py-[15px] px-[34px] text-[14px] font-bold text-espresso hover:bg-white lg:mt-9 lg:py-[17px] lg:px-[38px] lg:text-[15px]"
          >
            Contact me &amp; book
          </BookingButton>
        </div>

        {/* Frosted-glass contact card — desktop only */}
        <div className="hidden flex-col gap-[22px] rounded-[18px] border border-warm-white/22 bg-warm-white/10 p-9 lg:flex">
          {/* Address */}
          <div className="flex items-start gap-[14px]">
            <span className="w-[22px] shrink-0 font-serif text-[18px] leading-none text-warm-white">
              ✦
            </span>
            <div>
              <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-warm-white/65">
                Find me
              </p>
              <address className="not-italic text-[15px] leading-normal text-warm-white">
                {fullAddress}
              </address>
            </div>
          </div>

          <hr className="border-warm-white/18" />

          {/* Phone */}
          <div className="flex items-start gap-[14px]">
            <span className="w-[22px] shrink-0 font-serif text-[18px] leading-none text-warm-white">
              ✦
            </span>
            <div>
              <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-warm-white/65">
                Call or message
              </p>
              <a
                href={telHref}
                className="text-[15px] leading-normal text-warm-white transition-colors hover:text-cream"
              >
                {phone}
              </a>
            </div>
          </div>

          <hr className="border-warm-white/18" />

          {/* Email */}
          <div className="flex items-start gap-[14px]">
            <span className="w-[22px] shrink-0 font-serif text-[18px] leading-none text-warm-white">
              ✦
            </span>
            <div>
              <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-warm-white/65">
                Email
              </p>
              <a
                href={`mailto:${email}`}
                className="break-all text-[15px] leading-normal text-warm-white transition-colors hover:text-cream"
              >
                {email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
