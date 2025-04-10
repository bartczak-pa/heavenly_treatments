'use client';

import React from 'react';
import { Clock, MapPin, Smartphone } from 'lucide-react';

const ContactInfo = () => {
    return (
        <section className="py-16 md:py-24 bg-background"> 
          <div className="container mx-auto px-4">
            {/* Centered Title for the section */}
            {
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-12">
              Get In Touch
            </h2> 
            }

            {/* Horizontal layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-5xl mx-auto">
              
              {/* Hours Info */}
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">Opening Hours</h3>
                  <p className="font-sans text-muted-foreground text-sm">Mon to Sun: 9 AM – 7 PM</p>
                </div>
              </div>

              {/* Location Info */}
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">Location</h3>
                  <p className="font-sans text-muted-foreground text-sm">6 Easter Softlaw Farm Cottage</p>
                  <p className="font-sans text-muted-foreground text-sm">TD5 8BJ Kelso</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-start gap-4">
                <Smartphone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">Contact</h3>
                  <p className="font-sans text-muted-foreground text-sm">
                    <a href="mailto:hayley@heavenly-treatments.co.uk" className="hover:text-primary transition-colors">
                      hayley@heavenly-treatments.co.uk
                    </a>
                  </p>
                  <p className="font-sans text-muted-foreground text-sm">
                    <a href="tel:07960315337" className="hover:text-primary transition-colors">
                      07960 315337
                    </a>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
    )
}

export default ContactInfo;
