import React from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/Layout/MainLayout';

export function generateMetadata(): Metadata {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageTitle = 'Terms of Service | Heavenly Treatments';
  const pageDescription = 'Terms and conditions for booking and receiving treatments with Heavenly Treatments in Kelso.';
  const canonicalUrl = `${BASE_URL}/terms`;

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

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg">Last updated: 16th April 2025</p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Introduction</h2>
            <p>
              Welcome to Heavenly Treatments. These Terms of Service outline the rules and guidelines for using my services.
              By booking or receiving treatments, you agree to these terms in full.
            </p>
            <p>
              Please read these terms carefully before making a booking. If you don&apos;t agree with any part of these terms,
              please contact me to discuss before booking a treatment.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Services Offered</h2>
            <p>
              I offer a range of massage, facial, reflexology, and spa treatments. Full descriptions of each treatment, 
              including duration and pricing, can be found on my website or by contacting me directly.
            </p>
            <p>
              While I strive to describe my services accurately, small details may change over time as I refine my treatments 
              and techniques. The core service will always match the description provided at the time of booking.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Booking Appointments</h2>
            <p>
              You can book appointments by phone, email, or through my online booking system when available.
              All bookings are subject to availability.
            </p>
            <p>
              When booking, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide accurate and complete information</li>
              <li>Arrive on time for your appointment</li>
              <li>Complete a consultation form before your first treatment</li>
              <li>Update me about any changes to your health before subsequent treatments</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Cancellation Policy</h2>
            <p>
              I understand that circumstances can change. My cancellation policy is as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Cancellations made more than 24 hours before your appointment: no charge</li>
              <li>Cancellations made less than 24 hours before your appointment: 50% of the treatment cost may be charged</li>
              <li>No-shows without any notice: full treatment cost may be charged</li>
            </ul>
            <p className="mt-4">
              If you need to cancel, please let me know as soon as possible so I can offer your slot to another client.
              I reserve the right to waive cancellation fees in exceptional circumstances.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Payment Terms</h2>
            <p>
              Payment is due at the time of treatment unless we&apos;ve agreed otherwise in advance. I accept cash 
              and bank transfers where arranged beforehand.
            </p>
            <p>
              Gift vouchers are valid for the period stated on the voucher and cannot be exchanged for cash.
              No extensions will be given unless in exceptional circumstances at my discretion.
            </p>
            <p>
              I reserve the right to change my prices. Any price changes will be clearly communicated and 
              will not affect bookings already confirmed.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Health and Safety</h2>
            <p>
              Your safety is my priority. Before your first treatment, you&apos;ll need to complete a consultation form
              disclosing relevant health information. This information is kept confidential in line with my Privacy Policy.
            </p>
            <p>
              I reserve the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Refuse treatment if I believe it would be unsafe or inappropriate for your health condition</li>
              <li>Modify treatments to accommodate health concerns</li>
              <li>Ask for a doctor&apos;s note for certain conditions before providing treatment</li>
            </ul>
            <p className="mt-4">
              Please don&apos;t book if you have an infectious illness or condition that could spread to others.
              If you arrive for an appointment with such a condition, I reserve the right to cancel your treatment for safety reasons.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Client Responsibilities</h2>
            <p>
              To get the most from your treatment and ensure a pleasant experience for all, please:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Arrive on time or a few minutes early for your appointment</li>
              <li>Maintain personal hygiene</li>
              <li>Inform me of any discomfort during treatment</li>
              <li>Disclose all relevant health information</li>
              <li>Turn off or silence mobile phones during treatments</li>
              <li>Treat the premises and equipment with respect</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Age Restrictions</h2>
            <p>
              My treatments have age restrictions:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              
              <li>All treatments are suitable for clients aged 16 and over</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Liability</h2>
            <p>
              While I take every precaution to provide safe and effective treatments:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>I cannot accept liability for reactions or side effects that occur after treatment if you&apos;ve provided inaccurate health information</li>
              <li>I cannot guarantee specific results from treatments as each person responds differently</li>
              <li>I&apos;m not liable for damage to or loss of personal belongings while on the premises</li>
            </ul>
            <p className="mt-4">
              I maintain professional liability insurance for your peace of mind.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Right to Refuse Service</h2>
            <p>
              I reserve the right to refuse service to anyone for reasons including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Inappropriate behavior or language</li>
              <li>Arriving under the influence of alcohol or drugs</li>
              <li>Repeated late cancellations or no-shows</li>
              <li>Health conditions that contraindicate treatment</li>
              <li>Requests for services outside my professional scope of practice</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Intellectual Property</h2>
            <p>
              All content on my website, including text, images, logos, and treatment descriptions, is my intellectual property
              or used with permission. You may not reproduce, distribute, or use these materials without my written consent.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Website Use</h2>
            <p>
              When using my website, you agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Use it in any way that could damage or overburden it</li>
              <li>Use it for any unlawful or fraudulent purpose</li>
              <li>Transmit any viruses, malware, or other harmful code</li>
              <li>Attempt to gain unauthorized access to my systems</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Changes to These Terms</h2>
            <p>
              I may update these terms from time to time. Significant changes will be communicated through my website
              or by email if you&apos;re a regular client. The latest version will always be available on my website.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Governing Law</h2>
            <p>
              These terms are governed by the laws of Scotland and the United Kingdom. Any disputes will be subject to the
              exclusive jurisdiction of the Scottish courts.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Severability</h2>
            <p>
              If any part of these terms is found to be unenforceable, the remaining provisions will remain in full effect.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Contact Me</h2>
            <p>
              If you have any questions about these terms, please contact me:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>By email: hayley@heavenlytreatments.co.uk</li>
              <li>By phone: 0796 031 5337</li>
              <li>By post: 6 Easter Softlaw Farm Cottage, TD5 8BJ Kelso</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 