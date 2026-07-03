import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';

export default function AboutHero() {
  return (
    <section>

      {/* ── Mobile (below md) ── */}
      <div className="md:hidden pt-[28px] px-[22px]">
        <div className="flex items-center gap-[10px] mb-4">
          <span className="w-[22px] h-px bg-clay" aria-hidden="true" />
          <span className="font-sans text-[10.5px] tracking-[0.2em] uppercase text-sage font-semibold">
            About Hayley
          </span>
        </div>

        <h1 className="font-serif text-[40px] leading-[1.02] font-medium text-espresso mb-4 tracking-[-0.01em]">
          Hi, I&apos;m Hayley
        </h1>

        <p className="font-sans text-[15.5px] leading-[1.7] text-taupe mb-[22px]">
          A qualified spa therapist with a passion for wellness and skincare — and the face
          behind every treatment.
        </p>

        <div
          className="relative w-full overflow-hidden shadow-[0_24px_44px_-26px_rgba(74,64,56,0.45)]"
          style={{ height: '280px', borderRadius: '160px 160px 14px 14px' }}
        >
          <OptimizedImage
            src="owner-of-heavenly-treatments"
            fallback="/images/about/owner-of-heavenly-treatments.jpg"
            alt="Hayley, therapist at Heavenly Treatments"
            fill
            style={{ objectFit: 'cover' }}
            skipAutoAspectRatio
            priority
          />
        </div>
      </div>

      {/* ── Tablet / Desktop (md+) ── */}
      <div className="hidden md:block max-w-[1180px] mx-auto py-12 lg:py-16 px-8 overflow-hidden">
        <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 xl:gap-16 items-center">

          {/* Left: text */}
          <div>
            <div className="flex gap-3 items-center mb-6">
              <span className="w-7 h-px bg-clay" aria-hidden="true" />
              <span className="font-sans text-[12px] tracking-[0.22em] uppercase text-sage font-semibold">
                About Hayley
              </span>
            </div>

            <h1 className="font-serif text-[42px] lg:text-[52px] xl:text-[70px] leading-[1.02] font-medium text-espresso mb-6">
              Hi, I&apos;m Hayley — lovely to meet you
            </h1>

            <p className="font-sans text-[14.5px] lg:text-[15.5px] xl:text-[17.5px] leading-[1.7] text-taupe mb-6">
              I&apos;m a qualified spa therapist with a passion for wellness and skincare, and the face
              behind every treatment at Heavenly Treatments.
            </p>

            <p className="font-sans text-[14px] lg:text-[15px] xl:text-[16px] leading-[1.8] text-taupe mb-8">
              After years working in five-star establishments, I decided to bring that same level of
              care into a space of my own — calmer, more personal, and entirely focused on you.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <Link
                href="/contact"
                className="bg-sage text-warm-white px-[34px] py-[16px] rounded-full font-sans text-[14.5px] font-semibold hover:bg-sage-hover transition-colors"
              >
                Get in touch
              </Link>
              <Link
                href="/treatments"
                className="font-sans text-[14.5px] font-semibold text-cocoa border-b-[1.5px] border-clay pb-[3px]"
              >
                See treatments →
              </Link>
            </div>
          </div>

          {/* Right: portrait */}
          <div className="relative">
            <div
              className="absolute top-[-20px] left-[-20px] w-[120px] h-[120px] border border-clay rounded-full opacity-50"
              aria-hidden="true"
            />
            <div
              className="relative aspect-4/5 overflow-hidden shadow-[0_30px_60px_-30px_rgba(74,64,56,0.45)]"
              style={{ borderRadius: '260px 260px 14px 14px' }}
            >
              <OptimizedImage
                src="owner-of-heavenly-treatments"
                fallback="/images/about/owner-of-heavenly-treatments.jpg"
                alt="Hayley, therapist at Heavenly Treatments"
                fill
                style={{ objectFit: 'cover' }}
                skipAutoAspectRatio
                priority
              />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
