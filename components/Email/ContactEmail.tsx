import * as React from 'react';
import { ContactFormData } from '@/lib/validations/contact';

// Define props, excluding the Turnstile token
interface ContactEmailProps {
  formData: Omit<ContactFormData, 'turnstileToken'>;
}

// Simple functional component for the email body
export const ContactEmail: React.FC<Readonly<ContactEmailProps>> = ({ formData }) => {
  const { firstName, email, phone, treatment, message, preferredDate, preferredTime } = formData;
  
  // Sanitize email and phone for links
  const mailHref = `mailto:${encodeURIComponent(email)}`;
  const telHref = `tel:${(phone ?? '').replace(/[^\d+]/g, '')}`;

  const emailStyles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333333',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#ffffff',
    },
    header: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px 8px 0 0',
      borderBottom: '3px solid #e9ecef',
    },
    title: {
      margin: '0 0 10px 0',
      color: '#2c3e50',
      fontSize: '24px',
    },
    subtitle: {
      margin: '0',
      color: '#7f8c8d',
      fontSize: '16px',
    },
    section: {
      padding: '20px',
      backgroundColor: '#ffffff',
    },
    sectionTitle: {
      margin: '0 0 15px 0',
      color: '#2c3e50',
      fontSize: '18px',
      borderBottom: '2px solid #3498db',
      paddingBottom: '5px',
    },
    list: {
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },
    listItem: {
      margin: '0 0 10px 0',
      padding: '8px 0',
      borderBottom: '1px solid #ecf0f1',
    },
    label: {
      fontWeight: 'bold',
      color: '#2c3e50',
      display: 'inline-block',
      minWidth: '140px',
    },
    message: {
      whiteSpace: 'pre-wrap' as const,
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '5px',
      border: '1px solid #e9ecef',
      fontSize: '14px',
      lineHeight: '1.5',
    },
    footer: {
      backgroundColor: '#ecf0f1',
      padding: '15px 20px',
      borderRadius: '0 0 8px 8px',
      textAlign: 'center' as const,
      fontSize: '12px',
      color: '#7f8c8d',
      fontStyle: 'italic',
    },
    link: {
      color: 'inherit',
      textDecoration: 'underline',
    },
  };

  return (
    <div style={emailStyles.container}>
      <div style={emailStyles.header}>
        <h1 style={emailStyles.title}>New Contact Form Submission</h1>
        <p style={emailStyles.subtitle}>You received a new inquiry from your Heavenly Treatments website.</p>
      </div>

      <div style={emailStyles.section}>
        <h2 style={emailStyles.sectionTitle}>Contact Information</h2>
        <ul style={emailStyles.list}>
          <li style={emailStyles.listItem}>
            <span style={emailStyles.label}>Name:</span> {firstName}
          </li>
          <li style={emailStyles.listItem}>
            <span style={emailStyles.label}>Email:</span>{' '}
            <a href={mailHref} style={emailStyles.link}>
              {email}
            </a>
          </li>
          {phone && (
            <li style={emailStyles.listItem}>
              <span style={emailStyles.label}>Phone:</span>{' '}
              <a href={telHref} style={emailStyles.link}>
                {phone}
              </a>
            </li>
          )}
          {treatment && (
            <li style={emailStyles.listItem}>
              <span style={emailStyles.label}>Treatment Inquiry:</span> {treatment}
            </li>
          )}
          {(preferredDate || preferredTime) && (
            <li style={emailStyles.listItem}>
              <span style={emailStyles.label}>Preferred Booking:</span> 
              {preferredDate}{preferredDate && preferredTime ? ' at ' : ''}{preferredTime}
            </li>
          )}
        </ul>
      </div>

      <div style={emailStyles.section}>
        <h2 style={emailStyles.sectionTitle}>Message</h2>
        <div style={emailStyles.message}>{message}</div>
      </div>

      <div style={emailStyles.footer}>
        This email was sent from your Heavenly Treatments website contact form.
      </div>
    </div>
  );
};

export default ContactEmail; 