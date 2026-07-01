import { getTestimonials } from '@/lib/cms/testimonials';

function TestimonialCard({ testimonial }: { testimonial: Awaited<ReturnType<typeof getTestimonials>>[number] }) {
  return (
    <div className="bg-[#F6F1EA] border border-[rgba(74,64,56,0.08)] rounded-2xl p-9">
      {/* Stars */}
      <p
        className="text-clay text-[18px] tracking-[2px] mb-[18px]"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {'★'.repeat(testimonial.rating)}
      </p>

      {/* Quote */}
      <p className="font-serif text-[21px] italic leading-normal text-cocoa mb-[26px]">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author row */}
      <div className="flex items-center gap-3">
        <div
          className="w-[42px] h-[42px] rounded-full bg-sage text-warm-white font-serif text-[20px] font-semibold flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-sans text-[14px] font-bold text-[#3A332C] mb-0">
            {testimonial.name}
          </p>
          {testimonial.customerType && (
            <p className="font-sans text-[12px] text-[#8C8276] mb-0">
              {testimonial.customerType}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();
  const featured = testimonials[testimonials.length - 1];

  return (
    <section aria-labelledby="testimonials-heading" className="bg-cream py-10 md:bg-stone md:py-[100px]">
      <div className="mx-auto max-w-[1180px] px-6 md:px-8">

        {/* Section header — desktop only */}
        <div className="hidden md:block text-center mb-14">
          <p className="font-sans text-[12px] tracking-[0.22em] uppercase text-sage font-semibold mb-4">
            Kind words
          </p>
          <h2
            id="testimonials-heading"
            className="font-serif text-[50px] leading-[1.1] font-medium text-espresso mb-0"
          >
            What my clients say
          </h2>
        </div>

        {/* Mobile: single featured card */}
        {featured && (
          <div className="md:hidden">
            <TestimonialCard testimonial={featured} />
          </div>
        )}

        {/* Tablet: 2-column grid, first 2 cards only */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
          {testimonials.slice(0, 2).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Desktop: full 3-column grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

      </div>
    </section>
  );
}
