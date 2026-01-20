/**
 * @fileoverview FAQ Accordion component for displaying frequently asked questions
 *
 * Reusable accordion component for FAQ sections on category and treatment pages.
 * Designed for SEO enhancement with structured data support.
 *
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/**
 * Interface for a single FAQ item
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Props interface for the FAQAccordion component
 */
interface FAQAccordionProps {
  /** Section title displayed above the accordion */
  title?: string;
  /** Array of FAQ items with question and answer */
  faqs: FAQItem[];
  /** Optional CSS class names */
  className?: string;
}

/**
 * FAQ Accordion Component
 *
 * Displays FAQs in an accordion format with optional title.
 * Supports single item expansion with smooth animations.
 *
 * @param props - Component props
 * @returns JSX element representing the FAQ accordion, or null if no FAQs
 *
 * @example
 * ```typescript
 * <FAQAccordion
 *   title="Massage Questions Answered"
 *   faqs={[
 *     { question: "How long is a session?", answer: "60 minutes typically." }
 *   ]}
 * />
 * ```
 */
export function FAQAccordion({
  title = 'Frequently Asked Questions',
  faqs,
  className,
}: FAQAccordionProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section
      className={cn('py-12 md:py-16', className)}
      aria-labelledby="faq-section-title"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          id="faq-section-title"
          className="font-serif text-2xl md:text-3xl font-semibold text-primary text-center mb-8"
        >
          {title}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium text-primary hover:text-primary/80">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-line">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQAccordion;
