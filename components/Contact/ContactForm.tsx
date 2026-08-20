'use client';


import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Turnstile from 'react-turnstile';
import { Treatment } from '@/lib/data/treatments';
import { ContactFormData, contactFormSchema } from '@/lib/validations/contact';
import { useContactFormToast } from '@/hooks/useContactFormToast';
import { useFormTracking } from '@/hooks/useFormTracking';
import { useRouter } from 'next/navigation';

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
    treatments: Treatment[];
}

export default function ContactForm({ initialTreatment, treatments }: ContactFormProps) {

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
   * <ContactForm treatments={treatments} />
   *
   * // With initial treatment pre-selected (value must match a treatment title,
   * // since the Select options use treatment.title as their value)
   * <ContactForm initialTreatment="Signature Heavenly Facial" treatments={treatments} />
   * ```
   *
   * @param {ContactFormProps} props - Component props
   * @param {string} [props.initialTreatment] - Optional treatment title to pre-select (must match a treatment.title)
   * @param {Treatment[]} props.treatments - Array of available treatments for selection
   *
   * @returns {JSX.Element} A contact form with validation and submission handling
   */
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  // Use the custom hook for toast management
  const { toastState, setToastOpen, showToast } = useContactFormToast();

  // Use form tracking hook for GA4 analytics
  const { onFieldFocus, onFieldBlur, onFormSubmit } = useFormTracking({
    formName: 'contact_form',
  });

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

  const cancellationPolicyValue = useWatch({ control: form.control, name: 'cancellationPolicy' });

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
      if (process.env.NODE_ENV === 'development') console.log("Client: Received response from API:", result);

      if (response.ok) {
        // Track form submission success for GA4 analytics
        onFormSubmit();

        // Use showToast from the hook
        showToast("Success", result.message || "Your message has been sent! I will get back to you as soon as possible.", "success");
        form.reset();
        setTurnstileToken('');

        // Build redirect URL with treatment data for purchase tracking
        const treatmentName = data.treatment;
        const selectedTreatment = treatments.find(t => t.title === treatmentName);
        const params = new URLSearchParams();
        if (treatmentName) params.set('treatment', treatmentName);
        if (selectedTreatment?.id) params.set('treatmentId', selectedTreatment.id);
        if (selectedTreatment?.price) params.set('price', selectedTreatment.price.replace('£', ''));
        if (selectedTreatment?.category) params.set('category', selectedTreatment.category);
        params.set('source', 'form');

        const queryString = params.toString();
        router.push(`/booking-confirmation${queryString ? `?${queryString}` : ''}`);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* First Name and Email Fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-sans text-[12px] tracking-widest uppercase text-taupe font-semibold">First Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your first name"
                    className="bg-cream border-cocoa/16 rounded-[10px] px-[16px] py-[14px] font-sans text-[15px] text-espresso focus:border-sage focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                    onFocus={() => onFieldFocus('firstName')}
                    onBlur={(e) => {
                      field.onBlur();
                      onFieldBlur('firstName', !!e.target.value);
                    }}
                  />
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
                <FormLabel className="font-sans text-[12px] tracking-widest uppercase text-taupe font-semibold">Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className="bg-cream border-cocoa/16 rounded-[10px] px-[16px] py-[14px] font-sans text-[15px] text-espresso focus:border-sage focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                    onFocus={() => onFieldFocus('email')}
                    onBlur={(e) => {
                      field.onBlur();
                      onFieldBlur('email', !!e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-sans text-[12px] tracking-widest uppercase text-taupe font-semibold">Phone *</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="07123456789"
                  className="bg-cream border-cocoa/16 rounded-[10px] px-[16px] py-[14px] font-sans text-[15px] text-espresso focus:border-sage focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...field}
                  onFocus={() => onFieldFocus('phone')}
                  onBlur={(e) => {
                    field.onBlur();
                    onFieldBlur('phone', !!e.target.value);
                  }}
                />
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
              <FormLabel className="font-sans text-[12px] tracking-widest uppercase text-taupe font-semibold">Treatment (Optional)</FormLabel>
              {/* Use Select component with react-hook-form integration */}
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-cream border-cocoa/16 rounded-[10px] px-[16px] py-[14px] font-sans text-[15px] text-espresso focus:border-sage focus:ring-0 h-auto">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans text-[12px] tracking-widest uppercase text-taupe font-semibold">Preferred Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" className="bg-cream border-cocoa/16 rounded-[10px] px-[16px] py-[14px] font-sans text-[15px] text-espresso focus:border-sage focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
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
                  <FormLabel className="font-sans text-[12px] tracking-widest uppercase text-taupe font-semibold">Preferred Time (Optional)</FormLabel>
                  <FormControl>
                    <Input type="time" className="bg-cream border-cocoa/16 rounded-[10px] px-[16px] py-[14px] font-sans text-[15px] text-espresso focus:border-sage focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
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
                <FormLabel className="font-sans text-[12px] tracking-widest uppercase text-taupe font-semibold">Message *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please let me know of any allergies or medical conditions ie. pregnancy. Sorry, not currently offering treatments for male customers."
                  className="bg-cream border-cocoa/16 rounded-[10px] px-[16px] py-[14px] font-sans text-[15px] text-espresso min-h-[120px] resize-vertical focus:border-sage focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...field}
                  onFocus={() => onFieldFocus('message')}
                  onBlur={(e) => {
                    field.onBlur();
                    onFieldBlur('message', !!e.target.value);
                  }}
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
            <FormItem>
              <div
                role="button"
                tabIndex={0}
                onClick={() => field.onChange(!field.value)}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); field.onChange(!field.value); }}}
                className="flex gap-[13px] items-start cursor-pointer bg-cream border border-cocoa/12 rounded-xl px-[18px] py-[16px]"
              >
                <span
                  className={`min-w-[22px] h-[22px] rounded-[6px] mt-px flex items-center justify-center text-[14px] leading-none shrink-0 ${
                    field.value
                      ? 'bg-sage text-warm-white'
                      : 'bg-warm-white border border-cocoa/28'
                  }`} 
                >
                  {field.value && '✓'}
                </span>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="sr-only"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </FormControl>
                <span className="font-sans text-[13.5px] leading-normal text-taupe">
                  I accept that cancelling a confirmed booking with less than 24 hours&apos; notice will result in a 50% charge.{' '}
                  <span className="font-bold text-sage">✦</span>
                </span>
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
        <div className="flex flex-col items-center my-4 space-y-2">
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
          size="lg"
          disabled={isSubmitting || !turnstileToken || !cancellationPolicyValue}
          className={`w-full py-[17px] rounded-full font-sans text-[15px] font-bold tracking-[0.02em] border-none transition-colors ${
            cancellationPolicyValue && turnstileToken && !isSubmitting
              ? 'bg-sage hover:bg-sage-hover text-warm-white cursor-pointer'
              : 'bg-[#C7CBBE] text-warm-white cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send my message'
          )}
        </Button>
        {!cancellationPolicyValue && (
          <p className="font-sans text-[12.5px] text-[#A89C8C] text-center mt-[10px]">
            Please accept the cancellation policy to send.
          </p>
        )}
        <p className="font-sans text-[13px] text-[#8C8276] text-center mt-4">
          Prefer to talk? Call or text me on{' '}
          <a href="tel:07960315337" className="font-semibold transition-colors text-cocoa hover:text-sage">07960 315 337</a>
        </p>

      </form>

      {/* --- Radix Toast Rendering (uses hook state) --- */}
      <Toast.Root 
        open={toastState.open} 
        onOpenChange={setToastOpen}
        className={`p-4 rounded-md shadow-lg ${toastState.variant === 'error' ? 'bg-red-100' : 'bg-green-100'}`}
      >
        <Toast.Title className={`font-medium ${toastState.variant === 'error' ? 'text-red-800' : 'text-green-800'}`}>{toastState.title}</Toast.Title>
        <Toast.Description className={`mt-1 text-sm ${toastState.variant === 'error' ? 'text-red-700' : 'text-green-700'}`}>{toastState.description}</Toast.Description>
        <Toast.Close className="absolute top-1 right-1 p-1 text-gray-500 rounded-full hover:bg-gray-200">
           <Cross2Icon className="w-4 h-4" />
        </Toast.Close>
      </Toast.Root>

    </Form>
  );
}