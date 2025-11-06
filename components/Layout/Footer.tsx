import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-secondary/85 text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Updated Flex Layout for Main Content */}
        <div className="flex flex-wrap justify-between gap-12 mb-16">
          {/* Company Info */}
          <div className="w-full sm:w-auto lg:flex-1 space-y-6 mb-6 lg:mb-0">
            <h3 className="text-xl font-serif font-semibold text-primary leading-tight">Heavenly Treatments</h3>
            <p className="text-sm leading-relaxed text-muted-foreground/90 max-w-xs">
              Your journey to wellness and self-care begins here. Experience the perfect blend of relaxation and rejuvenation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full sm:w-auto lg:w-auto mb-6 lg:mb-0">
            <h3 className="text-lg font-serif font-semibold text-primary mb-6 leading-tight">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground/85 hover:text-primary transition-colors duration-200 ease-out font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground/85 hover:text-primary transition-colors duration-200 ease-out font-medium">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground/85 hover:text-primary transition-colors duration-200 ease-out font-medium">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/treatments" className="text-sm text-muted-foreground/85 hover:text-primary transition-colors duration-200 ease-out font-medium">
                  Treatments
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full sm:w-auto lg:w-auto mb-6 lg:mb-0">
            <h3 className="text-lg font-serif font-semibold text-primary mb-6 leading-tight">Contact Me</h3>
            <ul className="space-y-3 text-sm text-muted-foreground/85">
              <li className="font-medium">6 Easter Softlaw Farm Cottage</li>
              <li className="font-medium">TD5 8BJ Kelso</li>
              <li>
                <span className="font-medium">Phone: </span>
                <a href="tel:07960315337" className="hover:text-primary transition-colors duration-200 ease-out">
                  0796 031 5337
                </a>
              </li>
              <li>
                <span className="font-medium">Email: </span>
                <a href="mailto:hayley@heavenly-treatments.co.uk" className="hover:text-primary transition-colors duration-200 ease-out break-all">
                  hayley@heavenly-treatments.co.uk
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Me Section */}
          <div className="w-full sm:w-auto lg:w-auto mb-6 lg:mb-0">
            <h3 className="text-lg font-serif font-semibold text-primary mb-6 leading-tight">Follow Me</h3>
            <div className="flex flex-col space-y-4">
              <a
                href="https://www.facebook.com/heavenlytreatmentswithhayleybell"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Heavenly Treatments on Facebook"
                title="Facebook"
                className="flex items-center gap-3 transition-all duration-300 ease-out hover:translate-x-1 group w-fit"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                  <Image
                    src="/icons/facebook.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="filter dark:invert text-primary group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground/85 group-hover:text-primary transition-colors duration-200">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/heavenlytreatments_hayleybell/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Heavenly Treatments on Instagram"
                title="Instagram"
                className="flex items-center gap-3 transition-all duration-300 ease-out hover:translate-x-1 group w-fit"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                  <Image
                    src="/icons/instagram.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="filter dark:invert text-primary group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground/85 group-hover:text-primary transition-colors duration-200">Instagram</span>
              </a>
            </div>
          </div>
        </div>
        {/* End Flex Layout */}


        <div className="mt-16 border-t border-border/50 pt-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">
              © {new Date().getFullYear()} Heavenly Treatments. All rights reserved.
            </p>
            {/* Legal Links Only */}
            <div className="flex gap-8">
              <Link href="/privacy-policy" className="text-xs font-medium text-muted-foreground/75 hover:text-primary transition-colors duration-200 ease-out uppercase tracking-wide">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs font-medium text-muted-foreground/75 hover:text-primary transition-colors duration-200 ease-out uppercase tracking-wide">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-xs font-medium text-muted-foreground/75 hover:text-primary transition-colors duration-200 ease-out uppercase tracking-wide">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}