import Link from 'next/link';

export default function AboutCta() {
  return (
    <section className="bg-sage mt-[28px] md:mt-0">

      {/* ── Mobile (below md) ── */}
      <div className="md:hidden px-[22px] py-[40px] text-center">
        <h2 className="font-serif text-[30px] leading-[1.1] font-medium text-warm-white mb-3">
          Come and see me
        </h2>
        <p className="font-sans text-[14px] leading-[1.6] mb-[22px]" style={{ color: 'rgba(250,246,240,0.88)' }}>
          I&apos;d love to welcome you to my cottage treatment room.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-warm-white text-[#3A332C] px-[32px] py-[15px] rounded-full font-sans text-[14px] font-bold hover:bg-white transition-colors"
        >
          Get in touch
        </Link>
      </div>

      {/* ── Tablet / Desktop (md+) ── */}
      <div className="hidden md:block py-[80px]">
        <div className="max-w-[1180px] mx-auto px-8 text-center">
          <h2 className="font-serif text-[36px] md:text-[50px] font-medium text-warm-white mb-4">
            Come and see me
          </h2>
          <p
            className="font-sans text-[16.5px] leading-[1.7] mb-8"
            style={{ color: 'rgba(250,246,240,0.88)' }}
          >
            I&apos;d love to welcome you. Tell me how you&apos;d like to feel and we&apos;ll find the perfect
            treatment together.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="bg-warm-white text-[#3A332C] px-[36px] py-[16px] rounded-full font-sans text-[14.5px] font-bold hover:bg-white transition-colors"
            >
              Get in touch
            </Link>
            <Link
              href="/treatments"
              className="border border-warm-white/50 text-warm-white px-[32px] py-[16px] rounded-full font-sans text-[14.5px] font-semibold hover:border-warm-white transition-colors"
            >
              Browse treatments
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
