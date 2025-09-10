interface IntroductionSectionProps {}

const CONTENT = {
  heading: "Welcome to Heavenly Treatments",
  paragraphs: [
    "I'm Hayley, a qualified Spa Therapist with years of experience working in 5 star establishments.",
    "I'm now bringing this experience to my treatment room at home for you to enjoy.",
    "I have always had a passion for wellness and skin care and have carefully curated a treatment menu of all my favourite treatments."
  ]
} as const;

export default function IntroductionSection({}: IntroductionSectionProps) {
  const paragraphClass = "font-sans text-lg text-muted-foreground leading-relaxed";
  
  return (
    <section id="introduction" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <header>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary">
              {CONTENT.heading}
            </h2>
          </header>
          <div className="space-y-4">
            {CONTENT.paragraphs.map((paragraph, index) => (
              <p key={index} className={paragraphClass}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}