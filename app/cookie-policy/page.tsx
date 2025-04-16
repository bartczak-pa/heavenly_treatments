import React from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/Layout/MainLayout';

export function generateMetadata(): Metadata {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageTitle = 'Cookie Policy | Heavenly Treatments';
  const pageDescription = 'Learn about how Heavenly Treatments uses cookies, including Google Analytics, to improve your browsing experience and our services.';
  const canonicalUrl = `${BASE_URL}/cookie-policy`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function CookiePolicyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit websites. 
              They&#39;re widely used to make websites work efficiently and provide useful information to website owners.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">How I Use Cookies</h2>
            <p>
              At Heavenly Treatments, I use cookies to understand how visitors interact with my website, 
              which helps me improve your experience and my services. I use cookies for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Essential website operation:</strong> Some cookies are essential for the basic functionality of my website.</li>
              <li><strong>Analytics and performance:</strong> I use Google Analytics to collect anonymous information about how visitors use my site.</li>
              <li><strong>Your preferences:</strong> Some cookies remember your settings and preferences for future visits.</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Google Analytics</h2>
            <p>
              I use Google Analytics to understand how visitors engage with my website. Google Analytics uses cookies to collect information about:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>How many people visit my site</li>
              <li>Which pages they view</li>
              <li>How long they stay on each page</li>
              <li>How they arrived at my site</li>
              <li>What devices they use to view my site</li>
            </ul>
            <p className="mt-4">
              This data is processed in a way that does not identify anyone. I do not allow Google to use or share my analytics data for any other purpose.
            </p>
            
            <h3 className="text-xl font-serif font-medium text-primary mt-6 mb-3">Google Analytics Cookies</h3>
            <table className="border-collapse w-full mt-4">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-border px-4 py-2 text-left">Cookie Name</th>
                  <th className="border border-border px-4 py-2 text-left">Purpose</th>
                  <th className="border border-border px-4 py-2 text-left">Expiry</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-4 py-2">_ga</td>
                  <td className="border border-border px-4 py-2">Distinguishes users</td>
                  <td className="border border-border px-4 py-2">2 years</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">_gid</td>
                  <td className="border border-border px-4 py-2">Distinguishes users</td>
                  <td className="border border-border px-4 py-2">24 hours</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">_gat</td>
                  <td className="border border-border px-4 py-2">Throttles request rate</td>
                  <td className="border border-border px-4 py-2">1 minute</td>
                </tr>
              </tbody>
            </table>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Managing and Declining Cookies</h2>
            <p>
              When you first visit my website, you&apos;ll see a banner giving you the option to accept or decline cookies.
              If you choose to decline cookies, only essential cookies will be used.
            </p>
            <p className="mt-4">
              You can also control cookies through your browser settings. Most web browsers allow you to manage your cookie preferences. 
              You can:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Delete cookies from your device</li>
              <li>Block cookies by activating settings on your browser that allow you to refuse all or some cookies</li>
              <li>Set your browser to notify you when you receive a cookie</li>
            </ul>
            <p className="mt-4">
              Please note that if you choose to decline or block all cookies, some features of my website may not function correctly.
            </p>
            
            <h3 className="text-xl font-serif font-medium text-primary mt-6 mb-3">How to Manage Cookies in Different Browsers</h3>
            <p>
              You can find information about managing cookies in different browsers here:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
              <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
            </ul>
            
            <h3 className="text-xl font-serif font-medium text-primary mt-6 mb-3">Opting Out of Google Analytics</h3>
            <p>
              You can specifically opt out of Google Analytics tracking by using the Google Analytics Opt-out Browser Add-on, 
              available at: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://tools.google.com/dlpage/gaoptout</a>
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Changes to This Cookie Policy</h2>
            <p>
              I may update this Cookie Policy from time to time. I will notify you of significant changes by posting the new 
              policy on this page and updating the &rdquo;Last updated&rdquo; date.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Contact Me</h2>
            <p>
              If you have any questions about my cookie policy, please contact me:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>By email: hayley@heavenlytreatments.co.uk</li>
              <li>By phone: 0796 031 5337</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 