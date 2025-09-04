import React from 'react';

interface IntroductionSectionProps {
  title?: string;
  paragraphs?: string[];
  className?: string;
}

const defaultContent = {
  title: "Welcome to Heavenly Treatments",
  paragraphs: [
    "I'm Hayley, a qualified Spa Therapist with years of experience working in 5 star establishments.",
    "I'm now bringing this experience to my treatment room at home for you to enjoy.",
    "I have always had a passion for wellness and skin care and have carefully curated a treatment menu of all my favourite treatments."
  ]
};

export default function IntroductionSection({ 
  title = defaultContent.title,
  paragraphs = defaultContent.paragraphs,
  className = ""
}: IntroductionSectionProps): React.ReactElement {
  return (
    <section 
      id="introduction" 
      className={`py-16 md:py-24 bg-background ${className}`}
      role="region"
      aria-labelledby="introduction-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 
            id="introduction-heading"
            className="font-serif text-3xl md:text-4xl font-semibold text-primary"
          >
            {title}
          </h2>
          <div className="space-y-4" role="group" aria-label="Therapist introduction">
            {paragraphs.map((paragraph, index) => (
              <p 
                key={index}
                className="font-sans text-lg text-muted-foreground leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}