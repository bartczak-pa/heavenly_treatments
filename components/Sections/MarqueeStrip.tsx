const STRIP_ITEMS = [
  'Massage',
  'Facials',
  'Reflexology',
  'Body Treatments',
  'Seasonal Rituals',
] as const;

export default function MarqueeStrip() {
  return (
    <div className="hidden md:flex bg-stone py-4 items-center justify-center gap-0 overflow-hidden" aria-hidden="true">
      {STRIP_ITEMS.map((item, index) => (
        <span key={index} className="flex items-center">
          <span className="font-serif italic text-xl text-cocoa px-4">{item}</span>
          {index < STRIP_ITEMS.length - 1 && (
            <span className="text-clay">·</span>
          )}
        </span>
      ))}
    </div>
  );
}
