'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchCategoryTreatmentMenu } from '@/app/treatments/actions';
import type { TreatmentCategory, TreatmentMenuItem } from '@/lib/data/treatments';

interface TreatmentsAccordionProps {
  categories: TreatmentCategory[];
}

function SkeletonRows() {
  return (
    <div className="px-5 pb-2 sm:px-7 sm:pb-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="py-4 sm:py-5 border-t border-[rgba(74,64,56,0.1)]">
          <div className="flex gap-6 justify-between animate-pulse">
            <div className="flex-1 space-y-2">
              <div className="w-44 h-6 rounded bg-stone" />
              <div className="w-20 h-3 rounded bg-stone" />
              <div className="mt-1 w-64 h-4 rounded bg-stone" />
            </div>
            <div className="flex flex-col gap-2 items-end shrink-0">
              <div className="w-12 h-6 rounded bg-stone" />
              <div className="w-20 h-3 rounded bg-stone" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TreatmentsAccordion({ categories }: TreatmentsAccordionProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, TreatmentMenuItem[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function handleToggle(slug: string) {
    // Close if same panel is open
    if (openSlug === slug) {
      setOpenSlug(null);
      return;
    }

    // Open panel immediately — also start loading if not cached/in-flight
    setOpenSlug(slug);

    if (cache[slug] !== undefined || loading[slug]) return;

    setLoading((prev) => ({ ...prev, [slug]: true }));
    try {
      const treatments = await fetchCategoryTreatmentMenu(slug);
      setCache((prev) => ({ ...prev, [slug]: treatments }));
    } finally {
      setLoading((prev) => ({ ...prev, [slug]: false }));
    }
  }

  return (
    <section
      aria-label="Treatment categories"
      className="max-w-[1180px] mx-auto px-[18px] sm:px-8 pt-[22px] sm:pt-[70px] pb-2 sm:pb-[30px]"
    >
      {categories.map((category) => {
        const isOpen = openSlug === category.slug;
        const panelId = `accordion-panel-${category.slug}`;
        const headerId = `accordion-header-${category.slug}`;
        const treatments = cache[category.slug];
        const isLoading = loading[category.slug] ?? false;

        return (
          <div
            key={category.id}
            className="mb-3 sm:mb-4 bg-warm-white border border-[rgba(74,64,56,0.08)] rounded-2xl overflow-hidden"
          >
            {/* Accordion trigger — entire header row is the interactive button */}
            <button
              id={headerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => { void handleToggle(category.slug); }}
              className="w-full flex items-center gap-3 sm:gap-[18px] px-5 py-[18px] sm:px-7 sm:py-6 cursor-pointer text-left"
            >
              {/* Mobile: name, fills remaining space */}
              <div className="flex-1 min-w-0 sm:hidden">
                <span className="font-serif text-[22px] font-semibold text-[#3A332C] leading-tight block">
                  {category.name}
                </span>
              </div>

              {/* sm+ (tablet/desktop): name inline */}
              <span className="hidden sm:block font-serif text-[30px] font-semibold text-[#3A332C] leading-tight whitespace-nowrap">
                {category.name}
              </span>

              {/* Blurb: tablet/desktop only, fills remaining space */}
              <span className="hidden sm:block flex-1 text-[13.5px] text-[#8C8276] leading-snug">
                {category.shortDescription}
              </span>

              {/* Toggle indicator — aria-hidden since button already has aria-expanded */}
              <span
                aria-hidden="true"
                className={
                  isOpen
                    ? 'flex justify-center items-center leading-none rounded-full select-none w-[30px] h-[30px] sm:w-8 sm:h-8 bg-sage text-warm-white text-[21px] shrink-0'
                    : 'flex justify-center items-center leading-none rounded-full border select-none w-[30px] h-[30px] sm:w-8 sm:h-8 border-clay text-sage text-[19px] shrink-0'
                }
              >
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {/* Expanded panel */}
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
              >
                {isLoading ? (
                  <SkeletonRows />
                ) : treatments && treatments.length > 0 ? (
                  <div className="px-5 pb-2 sm:px-7 sm:pb-3">
                    {treatments.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="block sm:flex sm:justify-between sm:items-start sm:gap-6 py-4 sm:py-5 sm:px-2 border-t border-[rgba(74,64,56,0.1)] hover:bg-cream transition-colors duration-200"
                      >
                        {/* Left: name (+ mobile price), duration, description */}
                        <div className="flex-1 min-w-0">
                          {/* Mobile: name + price on same baseline row */}
                          <div className="flex gap-3 justify-between items-baseline sm:block">
                            <p className="font-serif text-[20px] sm:text-[23px] font-semibold text-[#3A332C] mb-0 sm:mb-[5px] leading-snug">
                              {item.name}
                            </p>
                            {/* Price shown inline with name on mobile only */}
                            <span className="sm:hidden font-serif text-[18px] text-sage font-semibold whitespace-nowrap shrink-0">
                              {item.price}
                            </span>
                          </div>
                          <p className="text-[10.5px] sm:text-[11.5px] tracking-widest sm:tracking-[0.12em] uppercase text-sage font-semibold mb-[6px] sm:mb-[9px]">
                            {item.durationLabel}
                          </p>
                          <p className="text-[13px] sm:text-[14px] leading-[1.55] sm:leading-[1.6] text-taupe max-w-[460px]">
                            {item.shortDescription}
                          </p>
                        </div>

                        {/* Right: price (tablet/desktop) + "View details" (desktop only) */}
                        <div className="hidden flex-col gap-1 items-end sm:flex shrink-0">
                          <span className="font-serif text-[22px] text-sage font-semibold whitespace-nowrap">
                            {item.price}
                          </span>
                          <span className="hidden lg:block text-[12px] font-bold tracking-[0.04em] text-cocoa whitespace-nowrap">
                            View details →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="px-5 sm:px-7 pb-5 text-[14px] text-taupe">
                    No treatments found in this category.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
