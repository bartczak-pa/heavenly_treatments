import { Clock, MapPin, Smartphone, LucideIcon } from 'lucide-react';

export interface ContactInfo {
  icon: LucideIcon;
  title: string;
  details: string[];
  ariaLabel: string;
}

export interface ContactData {
  title: string;
  info: ContactInfo[];
}

export const contactData: ContactData = {
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
};

export const contactLinks = {
  email: {
    href: "mailto:hayley@heavenly-treatments.co.uk",
    text: "hayley@heavenly-treatments.co.uk",
    ariaLabel: "Send email to Hayley"
  },
  phone: {
    href: "tel:07960315337",
    text: "07960 315 337",
    ariaLabel: "Call Hayley at 07960 315337"
  }
};