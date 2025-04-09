'use client';

import React, { useState } from 'react';
import { Label } from '@/components/UI/label';
import { Input } from '@/components/UI/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { Textarea } from '@/components/UI/textarea';
import { Button } from '@/components/UI/button';
import { Checkbox } from '@/components/UI/checkbox';


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
  
  
  // Treatment Options for the Select dropdown
  const treatmentOptions = [
    { value: 'massage', label: 'Massage' },
    { value: 'facial', label: 'Facial' },
    { value: 'reflexology', label: 'Reflexology' },
    { value: 'body treatment', label: 'Body Treatment' },
  ];

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
      const {checked} = e.target as HTMLInputElement;
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

  export default ContactForm;