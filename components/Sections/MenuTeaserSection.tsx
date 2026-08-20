import Link from 'next/link';
import { getTreatments } from '@/lib/cms/treatments';

export default async function MenuTeaserSection() {
  const treatments = await getTreatments();
  const featured = treatments.slice(0, 5);

  return (
    <section aria-labelledby="menu-teaser-heading" className="hidden lg:block bg-cream py-[100px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-[56px] items-start">

          {/* Left column */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-[22px]">
              <span className="w-7 h-px bg-clay" />
              <span className="font-sans text-[12px] tracking-[0.22em] uppercase text-sage font-semibold">
                The Menu
              </span>
            </div>

            <h2
              id="menu-teaser-heading"
              className="font-serif text-[34px] md:text-[46px] leading-[1.1] font-medium text-[#3A332C] mb-5"
            >
              A little ritual, just for you
            </h2>

            <p className="font-sans text-[16px] leading-[1.8] text-taupe mb-8">
              High-quality professional products, primarily organic and natural - and everything
              I use is vegan and cruelty-free.
            </p>

            <Link
              href="/treatments"
              className="inline-block bg-sage text-warm-white px-[30px] py-[14px] rounded-full font-sans text-[14px] font-semibold hover:bg-sage-hover transition-colors duration-200"
            >
              View full treatment list
            </Link>
          </div>

          {/* Right column — treatment list */}
          <div>
            {featured.map((treatment, index) => (
              <div
                key={treatment.id}
                className={`flex items-baseline gap-[14px] py-[18px]${
                  index < featured.length - 1
                    ? ' border-b border-[rgba(74,64,56,0.12)]'
                    : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-[23px] font-semibold text-[#3A332C] mb-0 leading-snug">
                    {treatment.title}
                  </p>
                  <p className="font-sans text-[13px] text-[#8C8276] mt-[3px] mb-0">
                    {treatment.duration}
                  </p>
                </div>
                <span className="font-serif text-[21px] text-sage font-semibold shrink-0">
                  {treatment.price}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
