'use client';

import { useId, useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getClientBookingVariant, getBookingUrl, trackBookingClick, type BookingVariant } from '@/lib/ab-test';

type LocationAndBookingSectionProps = {
  id?: string;
  className?: string;
};

const PARAGRAPH_CLASS = "font-sans text-lg text-muted-foreground leading-relaxed";

const CONTENT = {
  heading: "Book your Appointment Now",
  location: "Heavenly Treatments is conveniently located about a 5-minute drive from the centre of Kelso, with parking available right outside the door.",
  availability: "Appointments are available Monday to Sunday from 10am to 5pm; some evenings are also available.",
  process: "Use the simple online form below to get in touch, and I will get back to you as soon as possible with my availability.",
  callToAction: "Your journey to relaxation starts here!",
  buttonText: "Contact Me & Book",
  buttonHref: "/contact"
} as const satisfies {
  heading: string;
  location: string;
  availability: string;
  process: string;
  callToAction: string;
  buttonText: string;
  buttonHref: string;
};

export default function LocationAndBookingSection({
  id,
  className
}: LocationAndBookingSectionProps) {
  const reactId = useId();
  const sectionId = id ?? `location-booking-${reactId}`;
  const headingId = `${sectionId}-heading`;

  const [bookingVariant, setBookingVariant] = useState<BookingVariant | null>(null);

  // Get A/B test variant on mount
  useEffect(() => {
    const variant = getClientBookingVariant();
    setBookingVariant(variant);
  }, []);

  // Get booking URL based on variant (no specific treatment for this CTA)
  const bookingUrl = useMemo(() => getBookingUrl(null, bookingVariant), [bookingVariant]);

  // Handle booking CTA click with tracking
  const handleBookingClick = () => {
    if (bookingVariant) {
      trackBookingClick(bookingVariant, undefined, undefined, 'location_booking_section');
    }
  };

  return (
    <section 
      id={sectionId}
      aria-labelledby={headingId}
      className={cn("py-16 md:py-24 bg-primary/5", className)}
    >
      <div className="container mx-auto px-4">
        <article className="max-w-3xl mx-auto space-y-8">
          <header className="text-center space-y-6">
            <h2
              id={headingId}
              className="font-serif text-3xl md:text-4xl font-semibold text-primary"
            >
              {CONTENT.heading}
            </h2>
          </header>

          <div className="space-y-6 text-center">
            <p className={PARAGRAPH_CLASS}>
              {CONTENT.location}
            </p>

            <div className="space-y-6">
              <p className={PARAGRAPH_CLASS}>
                {CONTENT.availability}
              </p>

              <p className={PARAGRAPH_CLASS}>
                {CONTENT.process}
              </p>

              <p className={`${PARAGRAPH_CLASS} font-medium`}>
                {CONTENT.callToAction}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Button asChild variant="default" size="lg">
              <Link href={bookingUrl} onClick={handleBookingClick}>{CONTENT.buttonText}</Link>
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}