import Link from 'next/link';

export default function BookingCtaBand() {
  return (
    <section aria-labelledby="booking-cta-heading" className="bg-sage py-[92px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4 md:gap-[60px] items-center">

          {/* Left column */}
          <div>
            <h2
              id="booking-cta-heading"
              className="font-serif text-[30px] md:text-[54px] leading-[1.08] font-medium text-warm-white mb-5"
            >
              Your journey to relaxation starts here
            </h2>

            <p
              className="font-sans text-[17px] leading-[1.75] max-w-[440px] mb-8"
              style={{ color: 'rgba(250,246,240,0.88)' }}
            >
              Appointments Monday to Sunday, 10am–5pm, with some evenings available. Send a
              message and I&apos;ll get back to you with my availability.
            </p>

            <Link
              href="/contact"
              className="inline-block w-full md:w-auto text-center bg-warm-white text-[#3A332C] px-[38px] py-[17px] rounded-full font-sans text-[15px] font-bold hover:bg-white transition-colors duration-200"
            >
              Contact me &amp; book
            </Link>
          </div>

          {/* Right column — contact info card */}
          <div
            className="rounded-[18px] p-[26px] md:p-9 mt-6 md:mt-0"
            style={{
              background: 'rgba(250,246,240,0.1)',
              border: '1px solid rgba(250,246,240,0.22)',
            }}
          >
            {/* Row 1 — Location */}
            <div className="flex gap-[14px] items-start">
              <span className="font-serif text-warm-white text-[18px] min-w-[22px] mt-px" aria-hidden="true">
                ✦
              </span>
              <div>
                <p
                  className="font-sans text-[11px] tracking-[0.16em] uppercase mb-[4px]"
                  style={{ color: 'rgba(250,246,240,0.65)' }}
                >
                  Find me
                </p>
                <p className="font-sans text-[15px] text-warm-white leading-[1.5] mb-0">
                  6 Easter Softlaw Farm Cottage, Kelso TD5 8BJ
                </p>
              </div>
            </div>

            {/* Hairline */}
            <div
              className="my-5"
              style={{ height: '1px', background: 'rgba(250,246,240,0.18)' }}
              aria-hidden="true"
            />

            {/* Row 2 — Phone */}
            <div className="flex gap-[14px] items-start">
              <span className="font-serif text-warm-white text-[18px] min-w-[22px] mt-px" aria-hidden="true">
                ✦
              </span>
              <div>
                <p
                  className="font-sans text-[11px] tracking-[0.16em] uppercase mb-[4px]"
                  style={{ color: 'rgba(250,246,240,0.65)' }}
                >
                  Call or message
                </p>
                <p className="font-sans text-[15px] text-warm-white leading-[1.5] mb-0">
                  07960 315 337
                </p>
              </div>
            </div>

            {/* Hairline */}
            <div
              className="my-5"
              style={{ height: '1px', background: 'rgba(250,246,240,0.18)' }}
              aria-hidden="true"
            />

            {/* Row 3 — Email */}
            <div className="flex gap-[14px] items-start">
              <span className="font-serif text-warm-white text-[18px] min-w-[22px] mt-px" aria-hidden="true">
                ✦
              </span>
              <div>
                <p
                  className="font-sans text-[11px] tracking-[0.16em] uppercase mb-[4px]"
                  style={{ color: 'rgba(250,246,240,0.65)' }}
                >
                  Email
                </p>
                <p className="font-sans text-[15px] text-warm-white leading-[1.5] mb-0">
                  hayley@heavenly-treatments.co.uk
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
