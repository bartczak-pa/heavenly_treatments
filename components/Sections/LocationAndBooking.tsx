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
              Conveniently Located in Kelso
            </h2>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              Heavenly Treatments is situated in a charming cozy cottage in Kelso, easily accessible with nearby parking. My treatment room provides a private oasis where you can escape and unwind.
            </p>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              I serve clients throughout the Scottish Borders including Kelso, Jedburgh, and surrounding areas, welcoming both local residents and visitors to the region seeking quality massage and beauty treatments.
            </p>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              Appointments are available Monday to Sunday. I recommend booking in advance to secure your preferred time slot, especially for weekend appointments which tend to fill quickly.
            </p>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              Ready to experience the Heavenly Treatments difference? Book your appointment today through my simple online form or contact me directly. Your journey to relaxation and rejuvenation begins here. 
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