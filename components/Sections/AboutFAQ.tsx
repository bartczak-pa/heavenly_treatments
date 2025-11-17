'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// FAQ data for About page
const FAQ_DATA = {
  title: "Frequently Asked Questions",
  questions: [
    {
      question: "What are your qualifications and experience?",
      answer: "I completed my professional training at the prestigious Mary Reid Spa Academy in Edinburgh in 2017/18, gaining comprehensive qualifications in massage and beauty therapy. Since then, I've worked in exceptional 5-star spa environments including the Sheraton Hotel One Spa and Schloss, bringing over 7 years of professional experience to my practice. I'm fully insured and committed to ongoing professional development to ensure I'm offering the latest techniques and best practices."
    },
    {
      question: "Where is the cottage spa located?",
      answer: "My studio is located at 6 Easter Softlaw Farm Cottage, on the peaceful outskirts of Kelso in the Scottish Borders (TD5 8BJ). The rural setting provides a tranquil escape while being just minutes from Kelso town center. Free parking is available right at the cottage, making it easy and convenient to visit."
    },
    {
      question: "What should I expect during my first visit?",
      answer: "When you arrive, you'll be warmly welcomed into a peaceful, private treatment space. We'll start with a brief consultation to understand your needs and any concerns. You'll have access to changing facilities and storage for your belongings. During your treatment, you can relax in a professional therapy room with soothing aromatherapy, gentle music, and premium products. Complimentary refreshments are provided, and fresh linens and strict hygiene protocols are maintained for every client."
    },
    {
      question: "What products do you use?",
      answer: "I'm passionate about using only professional-grade products and brands that I trust and believe in. Having worked in 5-star spas, I know the difference that quality products make to your treatment experience and results. I carefully select products based on their effectiveness, quality ingredients, and suitability for different skin types and treatment needs."
    },
    {
      question: "Is parking available?",
      answer: "Yes! Free, convenient parking is available right at the cottage. There's no need to worry about finding parking or paying for parking meters – you can simply arrive, park, and relax."
    },
    {
      question: "How do I book an appointment?",
      answer: "You can easily book your appointment online through my Calendly booking system, which shows real-time availability. Alternatively, you can contact me directly via email at hayley@heavenly-treatments.co.uk or call 07960 315 337. I'm open Monday to Sunday, 9 AM – 7 PM."
    },
    {
      question: "Do you offer gift vouchers?",
      answer: "Yes! Gift vouchers make wonderful presents for birthdays, anniversaries, or any special occasion. Contact me to arrange a gift voucher for a specific treatment or monetary value."
    },
    {
      question: "What makes your cottage spa different from a salon?",
      answer: "My cottage spa combines the professional expertise and premium products you'd expect from a 5-star spa with the warmth, privacy, and personalized attention of an independent therapist. You'll enjoy complete privacy in a peaceful, dedicated treatment space – no busy salon noise or distractions. Every treatment is tailored to your individual needs, and you'll receive my undivided professional attention throughout your visit."
    }
  ]
} as const;

interface AboutFAQProps {
  className?: string;
}

const AboutFAQ: React.FC<AboutFAQProps> = ({ className = "" }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className={`py-16 bg-white ${className}`}
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 id="faq-heading" className="text-3xl font-bold mb-12 text-center">
          {FAQ_DATA.title}
        </h2>

        <div className="space-y-4">
          {FAQ_DATA.questions.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-semibold text-foreground pr-8">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                  )}
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-6 py-4 bg-gray-50 border-t border-gray-200"
                  >
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4">
            Have more questions? I&apos;d be happy to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:hayley@heavenly-treatments.co.uk"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              hayley@heavenly-treatments.co.uk
            </a>
            <span className="hidden sm:inline text-gray-400">•</span>
            <a
              href="tel:07960315337"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              07960 315 337
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFAQ;
