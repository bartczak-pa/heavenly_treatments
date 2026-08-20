import OptimizedImage from '@/components/OptimizedImage';

export default function AboutStory() {
  return (
    <section>

      {/* ── Mobile (below md) ── */}
      <div className="md:hidden bg-stone px-[22px] py-[36px] mt-[32px]">
        <div className="font-sans text-[11px] tracking-[0.2em] uppercase text-sage font-semibold mb-[14px]">
          My story
        </div>

        <h2 className="font-serif text-[28px] leading-[1.12] font-medium text-espresso mb-4">
          Five-star training, a personal touch
        </h2>

        <p className="font-sans text-[14.5px] leading-[1.75] text-taupe mb-[14px]">
          Over the years working in five-star spas, I learned how much a truly calm, considered
          treatment can change how someone feels.
        </p>

        <p className="font-sans text-[14.5px] leading-[1.75] text-taupe">
          Every product I use is high-quality, primarily organic and natural, and always vegan
          and cruelty-free.
        </p>
      </div>

      {/* ── Tablet / Desktop (md+) ── */}
      <div className="hidden md:block max-w-[1180px] mx-auto py-[60px] lg:py-[90px] px-8">
        <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 xl:gap-16 items-center">

          {/* Left: portrait with badge */}
          <div className="relative pb-8">
            <div className="overflow-hidden relative rounded-xl aspect-4/5">
              <OptimizedImage
                src="owner-of-heavenly-treatments"
                fallback="/images/about/owner-of-heavenly-treatments.jpg"
                alt="Hayley, therapist at Heavenly Treatments"
                fill
                style={{ objectFit: 'cover' }}
                skipAutoAspectRatio
              />
            </div>

            {/* Sage badge */}
            <div className="absolute bottom-0 right-[-16px] lg:right-[-22px] bg-sage text-warm-white px-[22px] py-[16px] lg:px-[26px] lg:py-[20px] rounded-xl shadow-[0_20px_40px_-20px_rgba(110,126,96,0.8)]">
              <div className="font-serif text-[28px] lg:text-[34px] leading-none font-semibold">5★</div>
              <div className="font-sans text-[10px] lg:text-[11px] tracking-[0.14em] uppercase mt-[6px] opacity-85">
                Spa trained
              </div>
            </div>
          </div>

          {/* Right: copy */}
          <div>
            <div className="flex gap-3 items-center mb-6">
              <span className="w-7 h-px bg-clay" aria-hidden="true" />
              <span className="font-sans text-[12px] tracking-[0.22em] uppercase text-sage font-semibold">
                My story
              </span>
            </div>

            <h2 className="font-serif text-[38px] lg:text-[44px] leading-[1.12] font-medium text-espresso mb-6">
              Five-star training, a personal touch
            </h2>

            <p className="font-sans text-[16.5px] leading-[1.8] text-taupe mb-[18px]">
              I&apos;ve always had a passion for wellness and skincare. Over the years working in five-star
              spas, I learned not just technique, but how much a truly calm, considered treatment can
              change how someone feels.
            </p>

            <p className="font-sans text-[16.5px] leading-[1.8] text-taupe mb-[18px]">
              When I opened Heavenly Treatments, I carefully curated a menu of all my favourite
              treatments — the ones I&apos;ve seen make the biggest difference. Every product I use is
              high-quality, primarily organic and natural, and always vegan and cruelty-free.
            </p>

            <p className="font-sans text-[16.5px] leading-[1.8] text-taupe">
              Most of all, I wanted somewhere that feels personal. Just you, a warm welcome, and time
              set aside entirely for your wellbeing.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
