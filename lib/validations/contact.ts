import { z } from 'zod';

// UK phone number regex (No +44 prefix, optional leading 0)
const ukPhoneRegex = /^0?(?:(?:1\d{9})|(?:2\d{9})|(?:3\d{9})|(?:7[1-9]\d{8}))$/;

// Schema for contact form validation
export const contactFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string()
           .regex(ukPhoneRegex, { message: "Please enter a valid UK phone number." }),
  treatment: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  cancellationPolicy: z.boolean().refine(val => val === true, {
    message: "You must accept the cancellation policy.",
  }),
  // Turnstile token - validated on server, required client-side to enable submit
  turnstileToken: z.string().min(1, { message: "Human verification failed. Please try again." }), 
});

// Type for form data inferred from the schema
export type ContactFormData = z.infer<typeof contactFormSchema>; 