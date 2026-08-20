const VALUES = [
  {
    num: '01',
    title: 'Personalised from the start',
    body: 'Every appointment begins with a brief consultation, so your treatment is aligned to exactly what you need that day.',
  },
  {
    num: '02',
    title: 'Five-star products, always',
    body: 'Everything I use is high-quality, primarily organic and natural - and always vegan and cruelty-free.',
  },
  {
    num: '03',
    title: 'A space made for you',
    body: 'No waiting rooms, no rushing - just a warm, private cottage space set aside entirely for your wellbeing.',
  },
  {
    num: '04',
    title: 'Trained to the highest level',
    body: 'Years of experience in five-star spas, brought into a setting that feels personal and unhurried.',
  },
] as const;

export default function AboutValues() {
  return (
    <section className="md:bg-stone">

      {/* ── Mobile (below md) ── */}
      <div className="md:hidden px-[22px] pt-[36px] pb-[8px]">
        <div className="text-center mb-[22px]">
          <div className="font-sans text-[11px] tracking-[0.2em] uppercase text-sage font-semibold mb-[10px]">
            What I stand for
          </div>
          <h2 className="font-serif text-[28px] leading-[1.1] font-medium text-espresso">
            Every visit, made personal
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {VALUES.map((value) => (
            <div
              key={value.num}
              className="bg-warm-white border border-cocoa/8 rounded-2xl p-[22px] flex gap-4 items-start"
            >
              <span className="font-serif text-[26px] text-clay font-semibold leading-none min-w-[32px]">
                {value.num}
              </span>
              <div>
                <h3 className="font-serif text-[20px] font-semibold text-espresso mb-[6px]">
                  {value.title}
                </h3>
                <p className="font-sans text-[13.5px] leading-[1.6] text-taupe">
                  {value.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tablet / Desktop (md+) ── */}
      <div className="hidden md:block py-[90px]">
        <div className="max-w-[1180px] mx-auto px-8">

          <div className="mb-14 text-center">
            <div className="flex gap-3 justify-center items-center mb-5">
              <span className="w-7 h-px bg-clay" aria-hidden="true" />
              <span className="font-sans text-[12px] tracking-[0.22em] uppercase text-sage font-semibold">
                What I stand for
              </span>
              <span className="w-7 h-px bg-clay" aria-hidden="true" />
            </div>
            <h2 className="font-serif text-[46px] leading-[1.1] font-medium text-espresso max-w-[560px] mx-auto">
              The little things that make every visit feel different
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {VALUES.map((value) => (
              <div
                key={value.num}
                className="bg-warm-white border border-cocoa/8 rounded-2xl p-9 flex gap-[22px] items-start"
              >
                <span className="font-serif text-[34px] text-clay font-semibold leading-none min-w-[44px]">
                  {value.num}
                </span>
                <div>
                  <h3 className="font-serif text-[26px] font-semibold text-espresso mb-[10px]">
                    {value.title}
                  </h3>
                  <p className="font-sans text-[15px] leading-[1.7] text-taupe">
                    {value.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
