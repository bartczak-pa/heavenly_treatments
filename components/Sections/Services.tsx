import React from 'react';
import Link from 'next/link';
import { TreatmentCategory } from '@/lib/data/treatments';

interface ServicesSectionProps {
  categories: TreatmentCategory[];
}

/**
 * ServicesSection — numbered treatment category cards grid (Issue #129)
 *
 * Renders 5 numbered cards (01–05) for each treatment category plus
 * a Sage-green CTA tile. Hover lift/shadow on desktop; subtle clay
 * border on mobile. Server component — no client state required.
 */
const ServicesSection: React.FC<ServicesSectionProps> = ({ categories }) => {
  return (
    <section
      aria-labelledby="services-heading"
      className="py-16 md:py-24 bg-cream"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="mb-12 text-center md:text-left">
          <h2
            id="services-heading"
            className="font-serif text-espresso mb-2"
          >
            Our treatments
          </h2>
          <p className="font-sans text-base text-taupe mb-0">
            Expertly curated for your well-being
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Category cards */}
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/treatments/${category.slug}`}
              className="group"
            >
              <article className="bg-warm-white rounded-2xl p-6 flex flex-col gap-3 h-full border border-clay/30 md:border-transparent transition-all duration-300 ease-out md:hover:-translate-y-[6px] md:hover:shadow-xl">
                <span className="font-sans text-xs text-clay font-semibold tracking-widest">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-xl text-espresso mb-0 leading-snug">
                  {category.name}
                </h3>
                <p className="font-sans text-sm text-taupe leading-relaxed flex-1 mb-0">
                  {category.shortDescription}
                </p>
                <span className="font-sans text-sm text-sage font-semibold group-hover:underline">
                  Explore →
                </span>
              </article>
            </Link>
          ))}

          {/* CTA tile */}
          <Link href="/contact" className="group">
            <article className="bg-sage rounded-2xl p-6 flex flex-col gap-3 h-full justify-center items-center text-center transition-all duration-300 ease-out md:hover:-translate-y-[6px] md:hover:bg-sage-hover">
              <span className="text-2xl text-warm-white" aria-hidden="true">✦</span>
              <h3 className="font-serif text-xl text-warm-white mb-0 leading-snug">
                Not sure where to start?
              </h3>
              <p className="font-sans text-sm text-warm-white/80 mb-0">
                Get in touch and I&apos;ll help you choose the perfect treatment.
              </p>
              <span className="font-sans text-sm text-warm-white font-semibold">
                Get in touch →
              </span>
            </article>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
