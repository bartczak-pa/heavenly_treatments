import * as React from 'react';
import { ContactFormData } from '@/lib/validations/contact';

// Define props, excluding the Turnstile token
interface ContactEmailProps {
  formData: Omit<ContactFormData, 'turnstileToken'>;
}

// Simple functional component for the email body
// TODO: Add styling to the email
export const ContactEmail: React.FC<Readonly<ContactEmailProps>> = ({ formData }) => {
  const { firstName, email, phone, treatment, message, preferredDate, preferredTime } = formData;

  return (
    <div>
      <h1>New Contact Form Submission</h1>
      <p>You received a new contact form submission from your website.</p>
      
      <hr />

      <h2>Contact Information</h2>
      <ul>
        <li><strong>Name:</strong> {firstName}</li>
        <li><strong>Email:</strong> {email}</li>
        {phone && <li><strong>Phone:</strong> {phone}</li>}
        {treatment && <li><strong>Treatment Inquiry:</strong> {treatment}</li>}
        {(preferredDate || preferredTime) && (
          <li>
            <strong>Preferred Booking:</strong> 
            {preferredDate}{preferredDate && preferredTime ? ' at ' : ''}{preferredTime}
          </li>
        )}
      </ul>

      <hr />

      <h2>Message</h2>
      <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p> 

      <hr />
      <p style={{ fontSize: '12px', color: '#666' }}>
        This email was sent from your Heavenly Treatments website contact form.
      </p>
    </div>
  );
};

export default ContactEmail; 