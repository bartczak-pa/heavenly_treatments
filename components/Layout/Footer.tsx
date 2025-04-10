import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary/85 text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Heavenly Treatments</h3>
            <p className="text-muted-foreground">
              Your journey to wellness and self-care begins here. Experience the perfect blend of relaxation and rejuvenation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
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
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Contact me</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>6 Easter Softlaw Farm Cottage</li>
              <li>TD5 8BJ Kelso</li>
              <li>
                Phone: <a href="tel:07960315337" className="hover:text-primary transition-colors">0796 031 5337</a>
              </li>
              <li>
                Email: <a href="mailto:hayley@heavenlytreatments.co.uk" className="hover:text-primary transition-colors">hayley@heavenlytreatments.co.uk</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Heavenly Treatments. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}