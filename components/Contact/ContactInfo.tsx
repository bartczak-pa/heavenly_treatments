import React, { JSX } from 'react';
import { contactInfo } from '@/lib/data/contactInfo';


/**
 * ContactInfo Component
 * 
 * A React component that displays contact information including email, phone, address, and business hours.
 * The information is sourced from the contactInfo object in the data layer.
 * 
 * @component
 * @example
 * ```tsx
 * <ContactInfo />
 * ```
 * 
 * @returns {JSX.Element} A div containing formatted contact information with clickable email and phone links
 * 
 * @remarks
 * - Uses contactInfo data from @/lib/data/contactInfo
 * - Implements responsive text sizing
 * - Includes interactive elements (mailto and tel links)
 * - Exports both the component and the contactInfo data
 */

const ContactInfo: React.FC = (): JSX.Element => (
    <div className="space-y-4 text-sm sm:text-base"> 
      <h3 className="text-xl font-semibold mb-3 text-primary">Contact Details</h3>
      <p><strong>Email:</strong> <a href={`mailto:${contactInfo.email}`} className="hover:underline text-foreground">{contactInfo.email}</a></p>
      <p><strong>Phone:</strong> <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:underline text-foreground">{contactInfo.phone}</a></p>
      <p><strong>Address:</strong> {contactInfo.address.streetAddress}, {contactInfo.address.addressLocality}, {contactInfo.address.postalCode}, {contactInfo.address.addressCountry  }</p>
      <p><strong>Hours:</strong> {`${contactInfo.openingHours[0].dayOfWeek[0]} - ${contactInfo.openingHours[0].dayOfWeek[6]}: ${contactInfo.openingHours[0].opens} - ${contactInfo.openingHours[0].closes}`}</p>
    </div>
  );

  export default ContactInfo; 
  export { contactInfo };