import OptimizedImage from '@/components/OptimizedImage';
import React from 'react';

// Static content object - moved outside component to prevent recreation
const THERAPIST_CONTENT = {
  title: "Meet your therapist",
  paragraphs: [
    "I began my journey into spa therapy training at the prestigious Mary Reid Spa Academy in Edinburgh in 2007. I gained further experience working in 5 star spas such as the Sheraton Hotel One Spa and Schloss as well as busy salons.",
    "I am now using all this experience to bring you the best possible treatments using brands and products I am passionate about."
  ]
} as const;

interface MeetTherapistProps {
  className?: string;
}

const MeetTherapist: React.FC<MeetTherapistProps> = ({ className }) => {
    return (
        <section className={`py-16 bg-white ${className || ''}`} aria-labelledby="therapist-heading">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 id="therapist-heading" className="text-3xl font-bold mb-8">
              {THERAPIST_CONTENT.title}
            </h2>
            <article className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <OptimizedImage
                  src="owner-of-heavenly-treatments"
                  fallback="/images/about/owner-of-heavenly-treatments.jpg"
                  alt="Owner of Heavenly Treatments spa"
                  width={300}
                  height={400}
                  className="rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
              <div className="md:w-2/3 space-y-4">
                {THERAPIST_CONTENT.paragraphs.map((paragraph, index) => (
                  <p key={`therapist-paragraph-${index}`} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          </div>
        </section>
    )
}

export default MeetTherapist;