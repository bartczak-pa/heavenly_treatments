import Image from 'next/image';
import Link from 'next/link';

export default function TreatmentRoomSection() {
  return (
    <section aria-labelledby="treatment-room-heading" className="relative">

      {/* Image wrapper */}
      <div className="relative h-[420px] md:h-[460px] lg:h-[560px]">
        <Image
          src="https://www.heavenly-treatments.co.uk/images/optimized/heavenly-treatments-room_1920w.webp"
          alt="The treatment room"
          fill
          sizes="100vw"
          className="object-cover"
        />

        {/* Desktop gradient: left-to-right */}
        <div
          className="hidden lg:block absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(42,37,33,0.82) 0%, rgba(42,37,33,0.5) 45%, rgba(42,37,33,0.12) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Mobile + tablet gradient: bottom-to-top */}
        <div
          className="block lg:hidden absolute inset-0"
          style={{
            background:
              'linear-gradient(0deg, rgba(42,37,33,0.88) 0%, rgba(42,37,33,0.55) 50%, rgba(42,37,33,0.1) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content overlay — bottom on mobile, centred on tablet + desktop */}
      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="mx-auto max-w-[1180px] px-[22px] md:px-8 w-full pb-[36px] md:pb-0">
          <div className="max-w-[480px]">

            {/* Eyebrow — dash hidden on mobile and tablet */}
            <div className="flex items-center gap-3 mb-4 md:mb-[22px]">
              <span className="hidden lg:block w-7 h-px bg-clay" />
              <span className="font-sans text-[10.5px] md:text-[12px] tracking-[0.22em] uppercase text-clay font-semibold">
                The Treatment Room
              </span>
            </div>

            {/* Three heading variants */}
            <h2
              id="treatment-room-heading"
              className="font-serif font-medium text-warm-white leading-[1.12] mb-5
                         text-[32px] md:text-[48px]"
            >
              <span className="md:hidden">A cosy cottage, five minutes from Kelso</span>
              <span className="hidden md:inline lg:hidden">A cosy cottage in the countryside</span>
              <span className="hidden lg:inline">A cosy cottage, nestled in the countryside</span>
            </h2>

            {/* Body copy — desktop only */}
            <p
              className="hidden lg:block font-sans text-[16.5px] leading-[1.8] mb-8"
              style={{ color: 'rgba(250,246,240,0.85)' }}
            >
              Just five minutes from the centre of Kelso, with parking right outside the door.
              Step away from the everyday and into a space made entirely for you.
            </p>

            {/* CTA — text link on mobile, pill on tablet + desktop */}
            <Link
              href="/contact"
              className="md:hidden font-sans font-semibold text-warm-white text-[14px] border-b border-clay pb-[3px] transition-opacity hover:opacity-80"
            >
              Plan your visit →
            </Link>
            <Link
              href="/contact"
              className="hidden md:inline-block font-sans font-semibold bg-warm-white text-[#3A332C] px-[32px] py-[15px] rounded-full text-[14px] hover:bg-white transition-colors"
            >
              Plan your visit →
            </Link>

          </div>
        </div>
      </div>

    </section>
  );
}
