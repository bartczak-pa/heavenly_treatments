import Link from 'next/link';

const SERVICES = [
  {
    num: '01',
    name: 'Seasonal Treatments',
    slug: 'seasonal-treatments',
    descDesktop: 'Relax and rejuvenate with a rotating range of seasonal rituals.',
    descTablet: 'Relax with a rotating range of seasonal rituals.',
  },
  {
    num: '02',
    name: 'Massages',
    slug: 'massages',
    descDesktop: 'Melt away tension with a range of therapeutic and relaxing massages.',
    descTablet: 'Therapeutic and relaxing massages.',
  },
  {
    num: '03',
    name: 'Facials',
    slug: 'facials',
    descDesktop: 'Achieve glowing, healthy skin with results-driven facial treatments.',
    descTablet: 'Glowing, healthy skin with results-driven facials.',
  },
  {
    num: '04',
    name: 'Body Treatments',
    slug: 'body-treatments',
    descDesktop: 'Nourish and pamper your body from head to toe.',
    descTablet: 'Nourish and pamper your body from head to toe.',
  },
  {
    num: '05',
    name: 'Reflexology',
    slug: 'reflexology',
    descDesktop: 'Heal from within with restorative reflexology treatments.',
    descTablet: 'Restore balance and calm through the feet.',
  },
] as const;

const MOBILE_SERVICES = [
  { num: '01', name: 'Massages', subtitle: 'Therapeutic & relaxing', slug: 'massages' },
  { num: '02', name: 'Facials', subtitle: 'Glowing, healthy skin', slug: 'facials' },
  { num: '03', name: 'Reflexology', subtitle: 'Restore your balance', slug: 'reflexology' },
] as const;

// Tablet shows 4 items (no Body Treatments), renumbered 01–04
const TABLET_SERVICES = SERVICES.filter(
  (s) => s.slug !== 'body-treatments',
).map((s, i) => ({ ...s, tabletNum: String(i + 1).padStart(2, '0') }));

const CTA_CONTENT = {
  heading: 'Not sure where to start?',
  body: "Tell me what you need and I’ll guide you to the perfect treatment.",
  link: 'Get in touch →',
  href: '/contact',
} as const;

export default function ServicesSection() {
  return (
    <section aria-labelledby="services-heading" className="py-16 md:py-24 bg-stone md:bg-cream lg:bg-stone">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-10 md:mb-14 text-center">
          <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-sage mb-4">
            <span className="sm:hidden">My Services</span>
            <span className="hidden sm:inline">Explore My Services</span>
          </p>
          <h2
            id="services-heading"
            className="font-serif text-espresso mb-0 text-4xl md:text-[44px] lg:text-[52px] leading-[1.1]"
          >
            <span className="lg:hidden">Treatments to soothe &amp; restore</span>
            <span className="hidden lg:inline">
              Treatments designed to soothe,<br />rejuvenate &amp; restore balance
            </span>
          </h2>
        </div>

        {/* ─── MOBILE: list rows ─────────────────────────── */}
        <div className="sm:hidden flex flex-col gap-3">
          {MOBILE_SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/treatments/${s.slug}`}
              className="group bg-warm-white rounded-2xl px-5 py-5 flex items-center gap-4 transition-all duration-300 ease-out active:scale-[0.98]"
            >
              <span className="font-sans text-sm text-clay w-6 shrink-0">{s.num}</span>
              <div className="flex-1">
                <p className="font-serif text-2xl text-espresso mb-0 leading-snug">{s.name}</p>
                <p className="font-sans text-sm text-taupe mb-0">{s.subtitle}</p>
              </div>
              <span className="text-sage text-base">&#8594;</span>
            </Link>
          ))}
          <Link
            href="/treatments"
            className="font-sans text-sm font-bold text-espresso text-center mt-4 block"
          >
            View all treatments &#8594;
          </Link>
        </div>

        {/* ─── TABLET: 2×2 grid + full-width CTA banner ─── */}
        <div className="hidden sm:flex lg:hidden flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {TABLET_SERVICES.map((s) => (
              <Link key={s.slug} href={`/treatments/${s.slug}`} className="group">
                <article className="bg-warm-white rounded-2xl p-6 h-full flex flex-col gap-3 transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-xl">
                  <span className="font-sans text-sm text-clay">{s.tabletNum}</span>
                  <h3 className="font-serif text-2xl text-espresso mb-0 leading-snug">{s.name}</h3>
                  <p className="font-sans text-sm text-taupe leading-relaxed flex-1 mb-0">
                    {s.descTablet}
                  </p>
                </article>
              </Link>
            ))}
          </div>
          <Link href={CTA_CONTENT.href} className="group">
            <article className="bg-sage rounded-2xl p-8 flex flex-col gap-3 transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-xl">
              <h3 className="font-serif italic text-2xl text-warm-white mb-0">{CTA_CONTENT.heading}</h3>
              <p className="font-sans text-sm text-warm-white/80 mb-0">{CTA_CONTENT.body}</p>
              <span className="font-sans text-sm font-bold text-warm-white">{CTA_CONTENT.link}</span>
            </article>
          </Link>
        </div>

        {/* ─── DESKTOP: 3-col grid with CTA tile ─────────── */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <Link key={s.slug} href={`/treatments/${s.slug}`} className="group">
              <article className="bg-warm-white rounded-2xl p-6 xl:p-8 h-full flex flex-col gap-3 transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-xl">
                <span className="font-sans text-sm text-clay">{s.num}</span>
                <h3 className="font-serif text-2xl text-espresso mb-0 leading-snug">{s.name}</h3>
                <p className="font-sans text-sm text-taupe leading-relaxed flex-1 mb-0">
                  {s.descDesktop}
                </p>
                <span className="font-sans text-sm font-semibold text-sage group-hover:underline">Discover &#8594;</span>
              </article>
            </Link>
          ))}
          <Link href={CTA_CONTENT.href} className="group">
            <article className="bg-sage rounded-2xl p-6 xl:p-8 h-full flex flex-col gap-4 transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-xl">
              <h3 className="font-serif italic text-2xl text-warm-white mb-0">{CTA_CONTENT.heading}</h3>
              <p className="font-sans text-sm text-warm-white/80 flex-1 mb-0">{CTA_CONTENT.body}</p>
              <span className="font-sans text-sm font-bold text-warm-white">{CTA_CONTENT.link}</span>
            </article>
          </Link>
        </div>

      </div>
    </section>
  );
}
