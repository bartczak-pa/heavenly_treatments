/**
 * MarqueeStrip — scrolling service category names on a Stone background.
 *
 * Uses a CSS animation (marquee-scroll defined in globals.css) with two
 * identical copies of the item list for a seamless infinite loop.
 * Marked aria-hidden so screen readers skip purely decorative text.
 */

const MARQUEE_ITEMS = [
  'Seasonal Treatments',
  'Massages',
  'Facials',
  'Body Treatments',
  'Reflexology',
] as const;

const MarqueeDot = () => (
  <span className="mx-4 text-clay" aria-hidden="true">·</span>
);

function MarqueeItemList() {
  return (
    <>
      {MARQUEE_ITEMS.map((item, index) => (
        <span key={index} className="font-serif italic text-xl text-cocoa">
          {item}
          <MarqueeDot />
        </span>
      ))}
    </>
  );
}

export default function MarqueeStrip() {
  return (
    <div className="bg-stone py-4 overflow-hidden" aria-hidden="true">
      <div className="animate-marquee">
        {/* First copy */}
        <span className="flex items-center">
          <MarqueeItemList />
        </span>
        {/* Duplicate for seamless loop */}
        <span className="flex items-center">
          <MarqueeItemList />
        </span>
      </div>
    </div>
  );
}
