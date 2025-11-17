import OptimizedImage from '@/components/OptimizedImage';
import React from 'react';

// Static content object - moved outside component to prevent recreation
const THERAPIST_CONTENT = {
  title: "Meet your therapist",
  intro: "Hi, I'm Hayley Bell, a fully qualified massage and beauty therapist bringing professional spa experiences to Kelso and the Scottish Borders.",
  sections: [
    {
      heading: "Professional Background",
      paragraphs: [
        "I began my journey into spa therapy training at the prestigious Mary Reid Spa Academy in Edinburgh in 2017/18, where I gained comprehensive qualifications in massage and beauty treatments. Over the past 7 years, I've had the privilege of working in exceptional 5-star spa environments including the renowned Sheraton Hotel One Spa and Schloss, as well as gaining valuable experience in busy salons.",
        "This diverse experience has given me insights into what truly makes a treatment special – from the ambiance and personal attention to the quality of products and techniques used. I've brought all of this knowledge together to create Heavenly Treatments, where you can enjoy luxury spa experiences in the peaceful, private setting of my cottage studio."
      ]
    },
    {
      heading: "My Treatment Philosophy",
      paragraphs: [
        "I believe that every treatment should be a holistic experience that addresses not just your physical needs, but also promotes mental relaxation and emotional wellbeing. I take time to understand your individual concerns and goals, tailoring each session to give you exactly what you need.",
        "I'm passionate about using only the finest professional-grade products and brands that I trust and believe in. Quality matters – from the oils and lotions I use to the attention to detail in creating the perfect atmosphere for your treatment."
      ]
    },
    {
      heading: "Why Kelso?",
      paragraphs: [
        "After working in high-end spas and salons, I wanted to create something more personal and intimate. My cottage spa in Kelso offers the best of both worlds – the professional expertise and product quality you'd expect from a 5-star venue, combined with the warmth, privacy, and personal attention that only a small, independent therapist can provide.",
        "The tranquil setting on the outskirts of Kelso provides the perfect escape from daily stress, allowing you to truly relax and unwind during your treatment."
      ]
    }
  ]
} as const;

interface MeetTherapistProps {
  className?: string;
}

const MeetTherapist: React.FC<MeetTherapistProps> = ({ className }) => {
    return (
        <section className={`py-16 bg-white ${className || ''}`} aria-labelledby="therapist-heading">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 id="therapist-heading" className="text-3xl font-bold mb-8 text-center">
              {THERAPIST_CONTENT.title}
            </h2>

            {/* Introduction with image */}
            <article className="flex flex-col md:flex-row gap-8 items-start mb-12">
              <div className="md:w-1/3">
                <OptimizedImage
                  src="owner-of-heavenly-treatments"
                  fallback="/images/about/owner-of-heavenly-treatments.jpg"
                  alt="Hayley Bell, qualified massage and beauty therapist in Kelso, Scottish Borders"
                  width={300}
                  height={400}
                  aspectRatio="3/4"
                  className="rounded-lg shadow-lg"
                  loading="eager"
                  priority
                />
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-gray-800 leading-relaxed mb-6 font-medium">
                  {THERAPIST_CONTENT.intro}
                </p>

                {/* Professional Background - first section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">
                    {THERAPIST_CONTENT.sections[0].heading}
                  </h3>
                  {THERAPIST_CONTENT.sections[0].paragraphs.map((paragraph, index) => (
                    <p key={`background-${index}`} className="text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>

            {/* Treatment Philosophy */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-primary mb-4">
                {THERAPIST_CONTENT.sections[1].heading}
              </h3>
              <div className="space-y-4">
                {THERAPIST_CONTENT.sections[1].paragraphs.map((paragraph, index) => (
                  <p key={`philosophy-${index}`} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Why Kelso */}
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4">
                {THERAPIST_CONTENT.sections[2].heading}
              </h3>
              <div className="space-y-4">
                {THERAPIST_CONTENT.sections[2].paragraphs.map((paragraph, index) => (
                  <p key={`kelso-${index}`} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
    )
}

export default MeetTherapist;