'use client';

import React from 'react';

const contactInfo: {
    email: string;
    phone: string;
    address: string;
    hours: string;
    mapSrc: string;
} = {
    email: 'hayley@heavenly-treatments.co.uk',
    phone: '07960 315337',
    address: '6 Easter Softlaw Farm Cottage, TD5 8BJ Kelso',
    hours: 'Mon to Sun: 9 AM – 7 PM',
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2255.035262100064!2d-2.3875811231290975!3d55.583994173022155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x488765fd908eb753%3A0x244d14e23ce79ebf!2sHeavenly%20Treatments%20with%20Hayleybell!5e0!3m2!1sen!2suk!4v1744138918784!5m2!1sen!2suk" //TODO: Change placement on the Google Maps 
  }; 

  const ContactInfo: React.FC = () => (
    <div className="space-y-4 text-sm sm:text-base"> 
      <h3 className="text-xl font-semibold mb-3 text-primary">Contact Details</h3>
      <p><strong>Email:</strong> <a href={`mailto:${contactInfo.email}`} className="hover:underline text-foreground">{contactInfo.email}</a></p>
      <p><strong>Phone:</strong> <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:underline text-foreground">{contactInfo.phone}</a></p>
      <p><strong>Address:</strong> {contactInfo.address}</p>
      <p><strong>Hours:</strong> {contactInfo.hours}</p>
    </div>
  );

  export default ContactInfo; 
  export { contactInfo };