export default function AboutPullQuote() {
  return (
    <section className="hidden md:block bg-stone py-[90px]">
      <div className="max-w-[900px] mx-auto px-8 text-center">

        <div
          className="font-serif text-[60px] text-clay leading-0 inline-block h-[30px] mb-6"
          aria-hidden="true"
        >
          &ldquo;
        </div>

        <blockquote>
          <p className="font-serif text-[24px] md:text-[34px] leading-[1.4] italic text-espresso mb-6">
            I&apos;ve always believed that looking after yourself shouldn&apos;t feel like a luxury — it
            should feel like coming home.
          </p>
          <footer>
            <cite className="font-sans text-[13px] tracking-[0.16em] uppercase text-sage font-semibold not-italic">
              Hayley · Founder &amp; Therapist
            </cite>
          </footer>
        </blockquote>

      </div>
    </section>
  );
}
