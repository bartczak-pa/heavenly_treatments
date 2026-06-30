import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { contactInfo } from '@/lib/data/contactInfo';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/treatments', label: 'Treatments' },
  { href: '/contact', label: 'Contact' },
] as const;

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
] as const;

const socialLinks = [
  {
    href: 'https://www.facebook.com/heavenlytreatmentswithhayleybell',
    label: 'Facebook',
    icon: '/icons/facebook.svg',
  },
  {
    href: 'https://www.instagram.com/heavenlytreatments_hayleybell/',
    label: 'Instagram',
    icon: '/icons/instagram.svg',
  },
] as const;

/**
 * Site footer for the Sanctuary redesign — an Espresso "dark section" with the
 * wordmark, quick links, contact details, and legal links. Contact data is
 * sourced from {@link contactInfo}.
 */
export default function Footer() {
  const { address, phone, email } = contactInfo;
  const telHref = `tel:${phone.replace(/\s+/g, '')}`;

  return (
    <footer className="bg-espresso text-cream/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-medium leading-tight text-cream">
              Heavenly Treatments
            </h3>
            <p className="text-sm uppercase tracking-[0.18em] text-cream/60">
              with Hayleybell · Kelso
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-cream/70">
              Your journey to wellness and self-care begins here — a blend of
              relaxation and rejuvenation in the Scottish Borders.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer">
            <h3 className="mb-5 font-serif text-lg font-medium leading-tight text-cream">
              Explore
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[48px] items-center text-sm text-cream/70 transition-colors hover:text-clay"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="mb-5 font-serif text-lg font-medium leading-tight text-cream">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-cream/70">
              <li>
                <address className="not-italic leading-relaxed">
                  {address.streetAddress}
                  <br />
                  {address.postalCode} {address.addressLocality}
                </address>
              </li>
              <li>
                <span className="text-cream/60">Phone: </span>
                <a
                  href={telHref}
                  className="transition-colors hover:text-clay"
                >
                  {phone}
                </a>
              </li>
              <li>
                <span className="text-cream/60">Email: </span>
                <a
                  href={`mailto:${email}`}
                  className="break-all transition-colors hover:text-clay"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-5 font-serif text-lg font-medium leading-tight text-cream">
              Follow
            </h3>
            <div className="flex flex-col gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit Heavenly Treatments on ${social.label}`}
                  className="group inline-flex w-fit items-center gap-3 transition-colors"
                >
                  <span className="rounded-lg bg-white/10 p-2 transition-colors group-hover:bg-white/20">
                    <Image
                      src={social.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="transition-transform group-hover:scale-110"
                    />
                  </span>
                  <span className="text-sm text-cream/70 transition-colors group-hover:text-clay">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-xs uppercase tracking-wide text-cream/50">
              © {new Date().getFullYear()} Heavenly Treatments. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {legalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs uppercase tracking-wide text-cream/60 transition-colors hover:text-clay"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
