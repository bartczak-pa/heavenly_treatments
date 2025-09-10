import { useId } from 'react';
import { cn } from '@/lib/utils';

type IntroductionSectionProps = {
  id?: string;
  className?: string;
};

const PARAGRAPH_CLASS = "font-sans text-lg text-muted-foreground leading-relaxed";

const CONTENT = {
  heading: "Welcome to Heavenly Treatments",
  paragraphs: [
    { id: "experience", text: "I'm Hayley, a qualified Spa Therapist with years of experience working in 5-star establishments." },
    { id: "treatment-room", text: "I'm bringing that experience to my home treatment room for you to enjoy." },
    { id: "passion", text: "I have always had a passion for wellness and skincare and have carefully curated a treatment menu of all my favourite treatments." }
  ]
} as const satisfies {
  heading: string;
  paragraphs: readonly { id: string; text: string }[];
};

export default function IntroductionSection({ id, className }: IntroductionSectionProps) {
  const reactId = useId();
  const sectionId = id ?? `introduction-${reactId}`;
  const headingId = `${sectionId}-heading`;
  
  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={cn("py-16 md:py-24 bg-background", className)}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <header>
            <h2 id={headingId} className="font-serif text-3xl md:text-4xl font-semibold text-primary">
              {CONTENT.heading}
            </h2>
          </header>
          <div className="space-y-4">
            {CONTENT.paragraphs.map((paragraph) => (
              <p key={paragraph.id} className={PARAGRAPH_CLASS}>
                {paragraph.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}