'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

type LocationAndBookingSectionProps = {
  id?: string;
  className?: string;
};

const PARAGRAPH_CLASS = "font-sans text-lg text-muted-foreground leading-relaxed";

const CONTENT = {
  heading: "Book your Appointment Now",
  location: "Heavenly Treatments is conveniently located about 5 minutes drive from the centre of Kelso with parking availability right outside the door.",
  availability: "Appointments are available Monday to Sunday from 10am to 5pm, although some evenings are also available.",
  process: "Use the simple online form below to get in touch and I will get back to you as soon as possible with my availability.",
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
  id = "location-booking", 
  className 
}: LocationAndBookingSectionProps) {
  const headingId = `${id}-heading`;
  
  return (
    <section 
      id={id}
      aria-labelledby={headingId}
      className={["py-16 md:py-24 bg-primary/5", className].filter(Boolean).join(" ")}
    >
      <div className="container mx-auto px-4">
        <article className="max-w-3xl mx-auto space-y-8">
          <header className="text-center space-y-4">
            <h2 
              id={headingId}
              className="font-serif text-3xl md:text-4xl font-semibold text-primary"
            >
              {CONTENT.heading}
            </h2>
          </header>
          
          <div className="space-y-6 text-center">
            <address className="not-italic">
              <p className={PARAGRAPH_CLASS}>
                {CONTENT.location}
              </p>
            </address>
            
            <div className="space-y-4">
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
              <Link href={CONTENT.buttonHref}>{CONTENT.buttonText}</Link>
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}