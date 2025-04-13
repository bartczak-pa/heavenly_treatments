'use client';


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Turnstile from 'react-turnstile';
import { getTreatments, Treatment } from '@/lib/data/treatments';
import { ContactFormData, contactFormSchema } from '@/lib/validations/contact';
import { useContactFormToast } from '@/hooks/useContactFormToast';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { ReloadIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Toast from "@radix-ui/react-toast"; 


// Add prop for initial treatment
interface ContactFormProps {
    initialTreatment?: string;
}

export default function ContactForm({ initialTreatment }: ContactFormProps) {

  /**
   * ContactForm Component
   * 
   * A form component for handling contact and booking requests. It includes:
   * - Personal information fields (name, email, phone)
   * - Treatment selection
   * - Message and scheduling details
   * - Turnstile verification
   * - Toast notifications for feedback
   * 
   * Features:
   * - Form validation using Zod
   * - Cloudflare Turnstile integration for spam prevention
   * - Responsive design
   * - Accessible form controls
   * - Toast notifications for success/error states
   * 
   * @component
   * @example
   * ```tsx
   * // Basic usage
   * <ContactForm />
   * 
   * // With initial treatment pre-selected
   * <ContactForm initialTreatment="pumpkin-pie-pamper" />
   * ```
   * 
   * @param {ContactFormProps} props - Component props
   * @param {string} [props.initialTreatment] - Optional treatment slug to pre-select
   * 
   * @returns {JSX.Element} A contact form with validation and submission handling
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  
  // Use the custom hook for toast management
  const { toastState, setToastOpen, showToast } = useContactFormToast();
  
  const treatments: Treatment[] = getTreatments();

  // 1. Initialize Form with react-hook-form + Zod
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      email: '',
      phone: '',
      treatment: initialTreatment || '', // Use prop for default value
      message: '',
      preferredDate: '',
      preferredTime: '',
      cancellationPolicy: false,
      turnstileToken: '',
    },
  });

  // Handle Form Submission
  const onSubmit = async (data: ContactFormData) => {
    /**
     * Handles the form submission process
     * 
     * This function:
     * 1. Validates the Turnstile token
     * 2. Submits the form data to the API endpoint
     * 3. Handles success/error responses
     * 4. Manages loading states
     * 5. Provides user feedback via toast notifications
     * 
     * @param {ContactFormData} data - The validated form data
     * @returns {Promise<void>}
     * 
     * @example
     * ```tsx
     * // Form submission triggered by user
     * onSubmit(formData);
     * ```
     */
    if (!turnstileToken) {
        // Use showToast from the hook
        showToast("Verification Needed", "Please complete the human verification step.", "error");
        return;
    }
    
    setIsSubmitting(true);
    if (process.env.NODE_ENV === 'development') {
        console.log("Client: Form submitted with data:", data);
        console.log("Client: Using Turnstile token:", turnstileToken);
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }), 
      });

      const result = await response.json();
      console.log("Client: Received response from API:", result);

      if (response.ok) {
        // Use showToast from the hook
        showToast("Success", result.message || "Your message has been sent! I will get back to you as soon as possible.", "success");
        form.reset(); 
        setTurnstileToken(''); 
      } else {
        // Use showToast from the hook
        showToast("Submission Error", result.message || "An error occurred. Please try again.", "error");
        setTurnstileToken('');
      }
    } catch (err) {
      console.error('Client-side submission error:', err);
      // Use showToast from the hook
      showToast("Network Error", "Could not submit the form. Please check your connection and try again.", "error");
      setTurnstileToken('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        {/* First Name and Email Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Phone Field (Now standalone) */}
        <FormField
          control={form.control}
          name="phone" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone *</FormLabel> 
              <FormControl>
                <Input type="tel" placeholder="07123456789" {...field} />
              </FormControl>
              <FormMessage /> 
            </FormItem>
          )}
        />

        {/* Treatment Selection Field */}
        <FormField
          control={form.control}
          name="treatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment (Optional)</FormLabel>
              {/* Use Select component with react-hook-form integration */}
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a treatment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {treatments.map((treatment) => (
                    <SelectItem key={treatment.slug} value={treatment.title}>
                      {treatment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preferred Date/Time Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time (Optional)</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {/* Message Textarea Field */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please let me know of any allergies or medical conditions ie. pregnancy"
                  className="resize-none min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Cancellation Policy Checkbox Field */}
        <FormField
          control={form.control}
          name="cancellationPolicy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I accept that cancelling a confirmed booking with less than 24 hours notice will result in a 50% charge.*
                </FormLabel>
              </div>
               <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden Field for Turnstile Token Validation */}
        {/* This field exists only for react-hook-form/zod validation state */}
        {/* The actual token sent is managed by the `turnstileToken` state variable */}
        <FormField
            control={form.control}
            name="turnstileToken" 
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
        />

        {/* 5. Bot Protection with Turnstile Widget */}
        <div className="flex flex-col items-center space-y-2 my-4">
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
            theme="light"
            onVerify={(token) => {
              console.log('Client: Turnstile Verified:', token);
              setTurnstileToken(token);
              form.setValue('turnstileToken', token);
              form.clearErrors('turnstileToken');
            }}
            onError={() => {
              console.log('Client: Turnstile Error');
              setTurnstileToken('');
              form.setValue('turnstileToken', '');
              form.setError('turnstileToken', { type: 'manual', message: 'Verification failed. Please refresh or try again.' });
            }}
            onExpire={() => {
              console.log('Client: Turnstile Expired');
              setTurnstileToken('');
              form.setValue('turnstileToken', '');
              form.setError('turnstileToken', { type: 'manual', message: 'Verification expired. Please complete it again.' });
            }}
          />
           {/* Display Turnstile-specific validation error message */}
           {form.formState.errors.turnstileToken && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.turnstileToken.message}
              </p>
            )}
        </div>
        
        {/* 6. Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isSubmitting || !turnstileToken} // Disable if submitting or Turnstile not verified
        >
          {isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>

      </form>

      {/* --- Radix Toast Rendering (uses hook state) --- */}
      <Toast.Root 
        open={toastState.open} 
        onOpenChange={setToastOpen}
        className={`p-4 rounded-md shadow-lg ${toastState.variant === 'error' ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}
      >
        <Toast.Title className={`font-medium ${toastState.variant === 'error' ? 'text-red-800 dark:text-red-100' : 'text-green-800 dark:text-green-100'}`}>{toastState.title}</Toast.Title>
        <Toast.Description className={`mt-1 text-sm ${toastState.variant === 'error' ? 'text-red-700 dark:text-red-200' : 'text-green-700 dark:text-green-200'}`}>{toastState.description}</Toast.Description>
        <Toast.Close className="absolute top-1 right-1 p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
           <Cross2Icon className="h-4 w-4" />
        </Toast.Close>
      </Toast.Root>

    </Form>
  );
}