import Image from 'next/image';
import Link from 'next/link';

export default function IntroductionSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="hidden py-20 lg:block xl:py-28 bg-cream"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex gap-16 items-center xl:gap-20">

          {/* Left: portrait image with overlapping badge */}
          <div className="flex-1 relative max-w-[420px]">
            <div className="overflow-hidden relative rounded-2xl aspect-3/4">
              <Image
                src="/images/about/owner-of-heavenly-treatments.jpg"
                alt="Hayley, owner and lead therapist at Heavenly Treatments in Kelso"
                fill
                sizes="45vw"
                className="object-cover"
              />
            </div>
            {/* Badge overlaps the bottom-right corner of the image */}
            <div className="absolute bottom-[-16px] right-[-16px] bg-sage rounded-2xl px-5 py-4 text-center min-w-[110px]">
              <p className="mb-0 font-serif text-2xl leading-none text-warm-white">5★</p>
              <p className="font-sans text-warm-white text-[10px] uppercase tracking-widest mt-1 mb-0">
                Spa Trained
              </p>
            </div>
          </div>

          {/* Right: bio copy */}
          <div className="flex flex-col flex-1 gap-6">

            {/* Eyebrow */}
            <div className="flex gap-3 items-center">
              <div className="w-8 h-px bg-clay" />
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-taupe">
                Welcome
              </span>
            </div>

            <h2
              id="about-heading"
              className="font-serif text-4xl xl:text-[52px] text-espresso leading-[1.1] mb-0"
            >
              I&apos;m Hayley - a qualified spa therapist, bringing five-star care home.
            </h2>

            <div className="flex flex-col gap-4">
              <p className="mb-0 font-sans text-base leading-relaxed text-cocoa">
                After years working in five-star establishments, I&apos;ve brought that experience
                to my own treatment room. I&apos;ve always had a passion for wellness and skincare,
                and have carefully curated a menu of all my favourite treatments.
              </p>
              <p className="mb-0 font-sans text-base leading-relaxed text-cocoa">
                Each appointment begins with a brief consultation, so every treatment is
                aligned with exactly what you need.
              </p>
            </div>

            <Link
              href="/about"
              className="font-sans text-sm font-semibold underline transition-opacity text-espresso underline-offset-4 hover:opacity-70 w-fit"
            >
              More about me →
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
