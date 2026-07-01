import Image from 'next/image';
import Link from 'next/link';

/**
 * IntroductionSection — Meet Hayley / Welcome block (Issue #129)
 *
 * Two-column layout on tablet/desktop: arched owner photo left,
 * bio copy right. Stacks single-column on mobile with image on top.
 * Server component — no interactivity required.
 */
export default function IntroductionSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="py-16 md:py-24 bg-cream"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* ── Left column: framed image ────────────────────────────── */}
          <div className="flex-1 w-full max-w-[480px] mx-auto md:mx-0">
            {/* Arched image with overlaid badge */}
            <div className="relative rounded-t-[200px] overflow-hidden aspect-[3/4]">
              <Image
                src="/images/about/owner-of-heavenly-treatments.jpg"
                alt="Hayley, owner and lead therapist at Heavenly Treatments in Kelso"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              {/* Badge — overlaid inside the image container */}
              <div className="absolute bottom-6 left-4 z-10">
                <span className="bg-sage text-warm-white rounded-full px-5 py-2 font-sans text-xs font-semibold tracking-widest uppercase">
                  ✦ 5★ Spa Trained
                </span>
              </div>
            </div>
          </div>

          {/* ── Right column: bio text ───────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center gap-6 text-center md:text-left">
            <span className="font-sans text-[11px] uppercase tracking-widest text-taupe">
              A little about me
            </span>

            <h2
              id="about-heading"
              className="font-serif text-espresso mb-0"
            >
              Meet Hayley, your personal spa therapist
            </h2>

            <div className="flex flex-col gap-4">
              <p className="font-sans text-base text-cocoa leading-relaxed mb-0">
                I&apos;m a qualified spa therapist with years of experience
                working in 5-star establishments — now bringing that same level
                of care and expertise to my home treatment room in Kelso.
              </p>
              <p className="font-sans text-base text-cocoa leading-relaxed mb-0">
                I&apos;ve curated a menu of treatments I love, using organic and
                vegan-friendly products to nurture your mind, body, and soul.
              </p>
            </div>

            <Link
              href="/about"
              className="font-sans text-sm text-sage hover:underline w-fit mx-auto md:mx-0"
            >
              More about me →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
