import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-secondary/85 text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Updated Flex Layout for Main Content */}
        <div className="flex flex-wrap justify-between gap-8 mb-12">
          {/* Company Info */}
          <div className="w-full sm:w-auto lg:flex-1 space-y-4 mb-6 lg:mb-0">
            <h3 className="text-lg font-semibold text-primary">Heavenly Treatments</h3>
            <p className="text-muted-foreground">
              Your journey to wellness and self-care begins here. Experience the perfect blend of relaxation and rejuvenation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full sm:w-auto lg:w-auto mb-6 lg:mb-0">
            <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact 
                </Link>
              </li>
              <li>
                <Link href="/treatments" className="text-muted-foreground hover:text-primary transition-colors">
                  Treatments
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full sm:w-auto lg:w-auto mb-6 lg:mb-0">
            <h3 className="text-lg font-semibold text-primary mb-4">Contact me</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>6 Easter Softlaw Farm Cottage</li>
              <li>TD5 8BJ Kelso</li>
              <li>
                Phone: <a href="tel:07960315337" className="hover:text-primary transition-colors">0796 031 5337</a>
              </li>
              <li>
                Email: <a href="mailto:hayley@heavenly-treatments.co.uk" className="hover:text-primary transition-colors">hayley@heavenly-treatments.co.uk</a>
              </li>
            </ul>
          </div>

          {/* Follow Me Section */}
          <div className="w-full sm:w-auto lg:w-auto mb-6 lg:mb-0">
            <h3 className="text-lg font-semibold text-primary mb-4">Follow Me</h3>
            <div className="flex flex-col space-y-2">
              <a 
                href="https://www.facebook.com/heavenlytreatmentswithhayleybell" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit Heavenly Treatments on Facebook"
                title="Facebook"
                className="flex items-center gap-2 transition-all duration-200 ease-in-out hover:opacity-80 hover:scale-105 w-fit"
              >
                <Image 
                  src="/icons/facebook.svg" 
                  alt=""
                  width={20}
                  height={20}
                  className="filter dark:invert" 
                />
                <span className="text-sm text-muted-foreground">Facebook</span>
              </a>
              <a 
                href="https://www.instagram.com/heavenlytreatments_hayleybell/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit Heavenly Treatments on Instagram"
                title="Instagram"
                className="flex items-center gap-2 transition-all duration-200 ease-in-out hover:opacity-80 hover:scale-105 w-fit"
              >
                <Image 
                  src="/icons/instagram.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="filter dark:invert" 
                />
                <span className="text-sm text-muted-foreground">Instagram</span>
              </a>
            </div>
          </div>
        </div>
        {/* End Flex Layout */}

        
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Heavenly Treatments. All rights reserved.
            </p>
            {/* Legal Links Only */}
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}