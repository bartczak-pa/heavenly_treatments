'use client';

import { Button } from "../ui/button";
import Link from "next/link";
export default function LocationAndBookingSection() {
    return (
        <section>
            <section id="location-booking" className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary">
            Book your Appointment Now
            </h2>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
            Heavenly Treatments is conveniently located about 5 minutes drive from the centre of Kelso with parking availability right outside the door.
            </p>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
            Appointments are available Monday to Sunday from 10am to 5pm, although some evenings are also available.
            </p>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
            Use the simple online form below to get in touch and I will get back to you as soon as possible with my availability.
            </p>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
            Your journey to relaxation starts here!
            </p>
             <div className="mt-8">
              <Button asChild variant="default" size="lg">
                <Link href="/contact">Contact Me & Book</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
        </section>
    )
}