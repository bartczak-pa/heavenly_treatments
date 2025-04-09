import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Heavenly Treatments</h3>
            <p className="text-gray-400">
              Your journey to wellness and self-care begins here. Experience the perfect blend of relaxation and rejuvenation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact 
                </Link>
              </li>
              <li>
                <Link href="/treatments" className="text-gray-400 hover:text-white transition-colors">
                  Treatments
                </Link>
              </li>
            </ul>
          </div>

      

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact me</h3>
            <ul className="space-y-2 text-gray-400">
              <li>6 Easter Softlaw Farm Cottage</li>
              <li>TD5 8BJ Kelso</li>
              <li>Phone: 0796 031 5337</li>
              <li>Email: hayley@heavenlytreatments.co.uk</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Heavenly Treatments. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}