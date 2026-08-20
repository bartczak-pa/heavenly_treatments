import { sanityClient } from '@/lib/sanity/client';
import { allTestimonialsQuery } from '@/lib/sanity/queries';
import { SanityTestimonial } from '@/lib/sanity/types';

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  customerType?: string;
  rating: number;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const items = await sanityClient.fetch<SanityTestimonial[]>(allTestimonialsQuery);
    const mapped = (items ?? []).map((t) => ({
      id: t._id,
      name: t.name,
      quote: t.quote,
      customerType: t.customerType,
      rating: t.rating ?? 5,
    }));
    return mapped.length > 0 ? mapped : FALLBACK_TESTIMONIALS;
  } catch (error) {
    console.error('Error fetching testimonials from Sanity:', error);
    return FALLBACK_TESTIMONIALS;
  }
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Lucy',
    quote:
      'Felt very relaxed after a full body massage and can highly recommend her. Her treatment room is so cosy and peaceful.',
    customerType: 'New client',
    rating: 5,
  },
  {
    id: '2',
    name: 'Lauren',
    quote:
      'The best, most relaxing massage. She is great at what she does and has a beautiful treatment room that smells divine.',
    customerType: 'Regular client',
    rating: 5,
  },
  {
    id: '3',
    name: 'Selena',
    quote:
      '90 minutes of bliss. I felt like I was in a luxury spa — so many thoughtful touches.',
    customerType: 'Visiting Kelso',
    rating: 5,
  },
];
