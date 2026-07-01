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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {STRIP_ITEMS.map((item, index) => (
          <span key={index} className="flex items-center">
            <span className="font-serif italic text-xl text-cocoa px-4">{item}</span>
            {index < STRIP_ITEMS.length - 1 && (
              <span className="text-clay">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
