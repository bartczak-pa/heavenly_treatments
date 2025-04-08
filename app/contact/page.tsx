'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { MainLayout } from '@/app/components/layout/MainLayout';

// Define the structure for form data
interface FormData {
  name: string;
  email: string;
  phone: string;
  treatment: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  cancellationPolicy: boolean;
}

// Contact Information Data
const contactInfo = {
  email: 'hayley@heavenly-treatments.co.uk',
  phone: '07960 315337',
  address: '6 Easter Softlaw Farm Cottage, TD5 8BJ Kelso',
  hours: 'Mon to Sun: 9 AM – 7 PM',
  mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509198!2d144.9537353153164!3d-37.81627997975157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f0f0f0f%3A0x0!2sHeavenly%20Treatments!5e0!3m2!1sen!2sau!4v1616161616161!5m2!1sen!2sau" // Replace with actual map embed URL if different
};

// Treatment Options for the Select dropdown
const treatmentOptions = [
  { value: 'massage', label: 'Massage' },
  { value: 'facial', label: 'Facial' },
  { value: 'reflexology', label: 'Reflexology' },
  { value: 'body treatment', label: 'Body Treatment' },
];

// Reusable Hero Section Component
const HeroSection: React.FC<{ title: string; description: string; imageUrl: string }> = ({ title, description, imageUrl }) => (
  <section className="relative mb-12 h-[40vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover" 
        priority // Prioritize loading hero image
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
    </div>
    <div className="relative z-10 text-center text-white px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">{title}</h1>
      <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto drop-shadow-sm">
        {description}
      </p>
    </div>
  </section>
);

// Contact Form Component
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    treatment: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    cancellationPolicy: false,
  });

  // Generic handler for most input types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; //TODO: Refactor 
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Specific handler for Shadcn UI Select component
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, treatment: value }));
  };

  // Specific handler for Shadcn UI Checkbox component
  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    // Ensure checked is boolean before updating state
    if (typeof checked === 'boolean') {
      setFormData((prev) => ({ ...prev, cancellationPolicy: checked }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission logic with Resend
    console.log('Form Data Submitted:', formData);
    alert('Form submitted! Check the console for data.'); // Placeholder feedback for development
    // Consider resetting form after successful submission:
    // setFormData({ name: '', email: '', phone: '', treatment: '', preferredDate: '', preferredTime: '', message: '', cancellationPolicy: false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Grid layout for Name and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name*</Label>
          <Input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Your Name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email*</Label>
          <Input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="your.email@example.com" />
        </div>
      </div>

      {/* Phone Input */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone*</Label>
        <Input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} placeholder="07123 456789" />
      </div>

      {/* Treatment Selection */}
      <div className="space-y-2">
        <Label htmlFor="treatment">What treatments are you interested in?*</Label>
        <Select name="treatment" required value={formData.treatment} onValueChange={handleSelectChange}>
          <SelectTrigger id="treatment">
            <SelectValue placeholder="Select a treatment" />
          </SelectTrigger>
          <SelectContent>
            {treatmentOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid layout for Preferred Date and Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
        <div className="space-y-2">
          <Label htmlFor="preferredDate">Preferred Date</Label>
          <Input type="date" id="preferredDate" name="preferredDate" value={formData.preferredDate} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredTime">Preferred Time</Label>
          <Input type="time" id="preferredTime" name="preferredTime" value={formData.preferredTime} onChange={handleChange} />
        </div>
      </div>

      {/* Message Textarea */}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Any additional details or questions..." />
        <p className="text-sm text-muted-foreground">Please let us know of any allergies or medical conditions (e.g., pregnancy).</p>
      </div>

      {/* Cancellation Policy Checkbox */}
      <div className="flex items-start space-x-3"> 
        <Checkbox
          id="cancellationPolicy"
          name="cancellationPolicy"
          checked={formData.cancellationPolicy}
          onCheckedChange={handleCheckboxChange}
          required
          className="mt-1" 
        />
        <div className="grid gap-1.5 leading-none">
            <Label htmlFor="cancellationPolicy" className="text-sm font-normal">
                I accept that cancelling a confirmed booking with less than 24 hours notice will result in a 50% charge.*
            </Label>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full sm:w-auto">Send Request</Button>
    </form>
  );
};

// Contact Information Component
const ContactInfo: React.FC = () => (
  <div className="space-y-4 text-sm sm:text-base"> 
    <h3 className="text-xl font-semibold mb-3 text-primary">Contact Details</h3>
    <p><strong>Email:</strong> <a href={`mailto:${contactInfo.email}`} className="hover:underline text-foreground">{contactInfo.email}</a></p>
    <p><strong>Phone:</strong> <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:underline text-foreground">{contactInfo.phone}</a></p>
    <p><strong>Address:</strong> {contactInfo.address}</p>
    <p><strong>Hours:</strong> {contactInfo.hours}</p>
  </div>
);

// Map Embed Component
const MapEmbed: React.FC<{ src: string }> = ({ src }) => (
  <div className="relative aspect-video md:aspect-square w-full h-auto md:h-full min-h-[300px] rounded-lg overflow-hidden shadow-md border border-border"> {/* Use aspect ratio, ensure min height */}
    <iframe
      src={src}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade" 
      title="Heavenly Treatments Location Map" //TODO: Add descriptive title for accessibility
      className="absolute inset-0"
    />
  </div>
);

// Main Contact Page Component
const ContactPage: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection
        title="Get in Touch"
        description="We would love to hear from you! Please fill out the form below to inquire about bookings or ask any questions."
        imageUrl="/images/contact-hero.jpg" //TODO: Ensure this image exists in public/images
      />

      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Combined Section for Form and Map/Info */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Left Column: Form */}
          <div className="lg:order-1">
            <h2 className="text-3xl font-bold mb-6 text-primary">Booking Inquiry & Contact Form</h2>
            <ContactForm />
          </div>

          {/* Right Column: Map and Info */}
          <div className="lg:order-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">Our Location</h2>
              <MapEmbed src={contactInfo.mapSrc} />
            </div>
            <div>
              <ContactInfo />
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
