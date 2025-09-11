'use client';

import React from 'react';
import { contactData, contactLinks } from '@/lib/data/contact';

const ContactInfo = () => {
    return (
        <section className="py-16 md:py-24 bg-background" aria-labelledby="contact-heading"> 
          <div className="container mx-auto px-4">
            <h2 
              id="contact-heading"
              className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-12"
            >
              {contactData.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-5xl mx-auto">
              {contactData.info.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-start gap-4" 
                    role="region"
                    aria-label={item.ariaLabel}
                  >
                    <Icon 
                      className="h-6 w-6 text-primary flex-shrink-0 mt-1" 
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {item.title}
                      </h3>
                      {item.details.map((detail, detailIndex) => {
                        // Handle contact details with links
                        if (item.title === "Contact") {
                          const isEmail = detail.includes("@");
                          const linkData = isEmail ? contactLinks.email : contactLinks.phone;
                          return (
                            <p key={detailIndex} className="font-sans text-muted-foreground text-sm">
                              <a 
                                href={linkData.href} 
                                className="hover:text-primary transition-colors focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                                aria-label={linkData.ariaLabel}
                              >
                                {linkData.text}
                              </a>
                            </p>
                          );
                        }
                        // Regular text for other details
                        return (
                          <p 
                            key={detailIndex} 
                            className="font-sans text-muted-foreground text-sm"
                          >
                            {detail}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
    );
};

export default ContactInfo;
