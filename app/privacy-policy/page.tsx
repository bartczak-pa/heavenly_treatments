import React from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/Layout/MainLayout';

export function generateMetadata(): Metadata {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageTitle = 'Privacy Policy | Heavenly Treatments';
  const pageDescription = 'Learn about how Heavenly Treatments collects, uses, and protects your personal information.';
  const canonicalUrl = `${BASE_URL}/privacy-policy`;

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

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg">Last updated: 16th April 2025</p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Introduction</h2>
            <p>
              Welcome to Heavenly Treatments. I respect your privacy and am committed to protecting your personal information. 
              This privacy policy explains how I collect, use, and safeguard your information when you use my services or visit my website.
            </p>
            <p>
              As a small business operating in the UK, I comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Who I Am</h2>
            <p>
              I am Hayley, the sole therapist and owner of Heavenly Treatments, operating from my treatment room in Kelso in the Scottish Borders.
              For privacy matters, I am both the data controller and processor of the personal information I collect.
            </p>
            <p>
              <strong>Contact details:</strong><br />
              Email: hayley@heavenlytreatments.co.uk<br />
              Phone: 0796 031 5337<br />
              Address: 6 Easter Softlaw Farm Cottage, TD5 8BJ Kelso
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Information I Collect</h2>
            
            <h3 className="text-xl font-serif font-medium text-primary mt-6 mb-3">Client Information</h3>
            <p>
              When you book a treatment, I collect personal information that may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Name and contact details (phone number, email address)</li>
              <li>Health information necessary for safe treatment (via consultation forms)</li>
              <li>Appointment history and treatment notes</li>
              <li>Payment information (though I don&apos;t store full payment card details)</li>
            </ul>
            
            <h3 className="text-xl font-serif font-medium text-primary mt-6 mb-3">Website Visitor Information</h3>
            <p>
              When you visit my website, with your consent, I may collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>IP address and browser information</li>
              <li>Pages viewed and time spent on my website</li>
              <li>Referral source (how you found my website)</li>
              <li>Device information</li>
            </ul>
            <p>
              I use Google Analytics to collect this information, which is detailed in my Cookie Policy.
            </p>
            
            <h3 className="text-xl font-serif font-medium text-primary mt-6 mb-3">Contact Form Submissions</h3>
            <p>
              When you contact me through my website form, I collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Your name and email address</li>
              <li>Your phone number (if provided)</li>
              <li>The content of your message</li>
              <li>Treatment interests (if specified)</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">How I Use Your Information</h2>
            <p>
              I use your information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>To provide treatments:</strong> Your health information helps me deliver safe, effective treatments.</li>
              <li><strong>To manage appointments:</strong> Including sending reminders and follow-ups.</li>
              <li><strong>To process payments:</strong> For services rendered.</li>
              <li><strong>To improve my services:</strong> Understanding how clients use my website helps me make it better.</li>
              <li><strong>To communicate with you:</strong> Responding to your inquiries or sending relevant information about my services.</li>
              <li><strong>To meet legal obligations:</strong> Including tax and accounting requirements.</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Legal Basis for Processing</h2>
            <p>
              Under the UK GDPR, I process your data based on the following legal grounds:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Contract:</strong> Processing necessary to fulfill my contractual obligations to you when providing treatments.</li>
              <li><strong>Legitimate interests:</strong> To improve my services and communicate with clients in ways they would reasonably expect.</li>
              <li><strong>Consent:</strong> For marketing communications and website analytics.</li>
              <li><strong>Legal obligation:</strong> To comply with legal requirements such as tax regulations.</li>
              <li><strong>Special category data:</strong> Health information is processed with your explicit consent to ensure safe treatment.</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">How Long I Keep Your Information</h2>
            <p>
              I keep your information for as long as necessary to provide my services and comply with legal obligations:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Client records with health information: 7 years after your last appointment (as recommended by insurers and healthcare guidelines)</li>
              <li>Financial records: 6 years (to comply with tax regulations)</li>
              <li>Contact form submissions: 1 year from submission</li>
              <li>Marketing preferences: Until you withdraw consent or unsubscribe</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Information Sharing</h2>
            <p>
              I respect your privacy and keep your information confidential. I do not sell your data to third parties.
              I may share your information in limited circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Service providers:</strong> Third parties who help me operate my business (such as appointment scheduling software, email provider, accounting software)</li>
              <li><strong>Legal requirements:</strong> If required by law, court order, or regulatory authority</li>
              <li><strong>Professional advisors:</strong> Such as accountants, where necessary for my business operations</li>
              <li><strong>With your consent:</strong> In other cases, I will ask for your explicit permission</li>
            </ul>
            <p>
              All service providers I use have appropriate data protection measures in place.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Information Security</h2>
            <p>
              I take appropriate measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Physical records are kept in a locked cabinet when not in use</li>
              <li>Electronic records are password protected and encrypted where possible</li>
              <li>My website uses HTTPS encryption</li>
              <li>I regularly update software and security measures</li>
              <li>I limit access to your information to only those who need it</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Your Rights</h2>
            <p>
              Under the UK GDPR, you have rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Access:</strong> You can request a copy of the information I hold about you.</li>
              <li><strong>Correction:</strong> You can ask me to correct inaccurate information.</li>
              <li><strong>Erasure:</strong> In certain circumstances, you can ask me to delete your information.</li>
              <li><strong>Restriction:</strong> You can ask me to limit how I use your information.</li>
              <li><strong>Data portability:</strong> You can request a copy of your information in a structured, digital format.</li>
              <li><strong>Objection:</strong> You can object to certain types of processing, such as direct marketing.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact me using the details provided above. I will respond to your request within one month.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Cookies and Analytics</h2>
            <p>
              My website uses cookies and similar technologies. For detailed information about how I use these,
              please see my <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a>.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Links to Other Websites</h2>
            <p>
              My website may contain links to other websites. This privacy policy only applies to my website,
              so if you click on a link to another website, you should read their privacy policy.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p>
              I may update this privacy policy from time to time. I will notify you of significant changes by posting the new 
              policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Making a Complaint</h2>
            <p>
              If you have concerns about how I handle your data, please contact me first so I can address your concerns.
            </p>
            <p>
              If you are not satisfied with my response, you have the right to complain to the Information Commissioner&apos;s Office (ICO), 
              the UK supervisory authority for data protection issues. Visit <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk/make-a-complaint/</a> or call 0303 123 1113.
            </p>
            
            <h2 className="text-2xl font-serif font-medium text-primary mt-8 mb-4">Contact Me</h2>
            <p>
              If you have any questions about this privacy policy or how I handle your information, please contact me:
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