import React from 'react';
import { Clock, MapPin, Smartphone } from 'lucide-react';

// Static data moved outside component to prevent recreation
const contactData = {
  title: "Get In Touch",
  info: [
    {
      icon: Clock,
      title: "Opening Hours",
      details: ["Mon to Sun: 9 AM – 7 PM"],
      ariaLabel: "Business opening hours"
    },
    {
      icon: MapPin,
      title: "Location",
      details: [
        "6 Easter Softlaw Farm Cottage",
        "TD5 8BJ Kelso"
      ],
      ariaLabel: "Business address and location"
    },
    {
      icon: Smartphone,
      title: "Contact",
      details: [
        "hayley@heavenly-treatments.co.uk",
        "07960 315 337"
      ],
      ariaLabel: "Contact information including email and phone"
    }
  ]
} as const;

// Contact links are now generated dynamically from the data to prevent drift

interface ContactInfoProps {
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ className }) => {
    return (
        <section className={`py-16 md:py-24 bg-background ${className || ''}`} aria-labelledby="contact-heading">
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
                  <section
                    key={index}
                    className="flex items-start gap-4"
                    aria-labelledby={`contact-item-${index}`}
                  >
                    <Icon
                      className="h-6 w-6 text-primary flex-shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 id={`contact-item-${index}`} className="font-semibold text-lg text-foreground mb-1">
                        {item.title}
                      </h3>
                      {item.details.map((detail, detailIndex) => {
                        // Handle contact details with links
                        if (item.title === "Contact") {
                          const isEmail = detail.includes("@");
                          const href = isEmail ? `mailto:${detail}` : `tel:${detail.replace(/\\s+/g, '')}`;
                          const ariaLabel = isEmail ? `Send email to ${detail}` : `Call ${detail}`;
                          return (
                            <p key={`contact-detail-${detailIndex}`} className="font-sans text-muted-foreground text-sm">
                              <a
                                href={href}
                                className="hover:text-primary transition-colors focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                                aria-label={ariaLabel}
                                rel="noopener noreferrer"
                              >
                                {detail}
                              </a>
                            </p>
                          );
                        }
                        // Handle address with semantic element
                        if (item.title === "Location") {
                          return (
                            <address key={`detail-${detailIndex}`} className="font-sans text-muted-foreground text-sm not-italic">
                              {detail}
                            </address>
                          );
                        }
                        // Handle opening hours with semantic element
                        if (item.title === "Opening Hours") {
                          return (
                            <time key={`detail-${detailIndex}`} className="font-sans text-muted-foreground text-sm">
                              {detail}
                            </time>
                          );
                        }
                        // Regular text for other details
                        return (
                          <p
                            key={`detail-${detailIndex}`}
                            className="font-sans text-muted-foreground text-sm"
                          >
                            {detail}
                          </p>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>
    );
};

export default ContactInfo;
