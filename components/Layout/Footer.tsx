import React from 'react';
import Link from 'next/link';
import { contactInfo } from '@/lib/data/contactInfo';

const exploreLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Me' },
  { href: '/treatments', label: 'Treatments' },
  { href: '/contact', label: 'Contact' },
] as const;

const mobileNavLinks = [
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
  },
  {
    href: 'https://www.instagram.com/heavenlytreatments_hayleybell/',
    label: 'Instagram',
  },
] as const;

const { phone, email } = contactInfo;
const telHref = `tel:${phone.replace(/\s+/g, '')}`;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-espresso text-cream/80">
      {/* ── Mobile footer — centered brand + nav row + copyright ── */}
      {/* aria-hidden: desktop section (always in DOM) is the accessible footer;
          mobile users navigate via the hamburger overlay */}
      <div aria-hidden="true" className="flex flex-col items-center gap-5 px-6 py-12 text-center md:hidden">
        <h3 className="font-serif text-[25px] font-semibold text-cream">
          Heavenly Treatments
        </h3>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {mobileNavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] text-cream/70 transition-colors hover:text-clay"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <p className="text-[12.5px] text-cream/40">
          © {year} Heavenly Treatments
        </p>
      </div>

      {/* ── Desktop footer — 3-column grid ── */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-6 pt-[70px] pb-9 lg:px-8">
          <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-[48px] border-b border-white/[12%] pb-[50px]">
            {/* Brand */}
            <div className="space-y-[14px]">
              <h3 className="font-serif text-[25px] font-semibold leading-tight text-cream">
                Heavenly Treatments
              </h3>
              <p className="max-w-[320px] text-[14.5px] leading-[1.7] text-cream/55">
                Your journey to wellness and self-care begins here. The perfect
                blend of relaxation and rejuvenation, in the Scottish Borders.
              </p>
            </div>

            {/* Explore */}
            <nav aria-label="Footer">
              <h3 className="mb-[18px] font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-sage">
                Explore
              </h3>
              <ul className="flex flex-col gap-3">
                {exploreLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[14.5px] text-cream/70 transition-colors hover:text-clay"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Connect */}
            <div>
              <h3 className="mb-[18px] font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-sage">
                Connect
              </h3>
              <div className="flex flex-col gap-3 text-[14.5px] text-cream/70">
                <a
                  href={telHref}
                  className="transition-colors hover:text-clay"
                >
                  {phone}
                </a>
                <a
                  href={`mailto:${email}`}
                  className="break-all transition-colors hover:text-clay"
                >
                  {email}
                </a>
                <div className="mt-[6px] flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Heavenly Treatments on ${social.label}`}
                      className="text-[13px] font-semibold text-clay transition-colors hover:text-cream"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row">
            <p className="text-[12.5px] text-cream/40">
              © {year} Heavenly Treatments. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-[6px] gap-y-1">
              {legalLinks.map((item, i) => (
                <React.Fragment key={item.href}>
                  {i > 0 && (
                    <span className="text-[12.5px] text-cream/30" aria-hidden="true">·</span>
                  )}
                  <Link
                    href={item.href}
                    className="text-[12.5px] text-cream/60 transition-colors hover:text-clay"
                  >
                    {item.label}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
