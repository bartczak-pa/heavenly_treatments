import { Fragment } from 'react';

const STRIP_ITEMS = [
  'Massage',
  'Facials',
  'Reflexology',
  'Body Treatments',
  'Seasonal Rituals',
] as const;

export default function MarqueeStrip() {
  return (
    <div className="hidden md:block bg-stone py-4 overflow-hidden" aria-hidden="true">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-5 md:gap-7 justify-center lg:justify-between lg:gap-0">
        {STRIP_ITEMS.map((item, index) => (
          <Fragment key={item}>
            <span className="font-serif italic text-xl text-cocoa shrink-0">
              {item}
            </span>
            {index < STRIP_ITEMS.length - 1 && (
              <span className="text-clay text-4xl leading-none shrink-0">·</span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
