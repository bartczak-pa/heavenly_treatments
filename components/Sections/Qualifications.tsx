import React from 'react';
import { Award, ShieldCheck, GraduationCap } from 'lucide-react';

// Static qualifications data - UPDATE WITH YOUR ACTUAL QUALIFICATIONS
const QUALIFICATIONS_DATA = {
  title: "Qualifications & Professional Standards",
  intro: "Fully trained and insured, I maintain the highest professional standards in all treatments.",
  categories: [
    {
      icon: GraduationCap,
      title: "Professional Training",
      items: [
        "Diploma in Beauty Therapy - Mary Reid Spa Academy, Edinburgh (2017/18)",
        "Advanced Massage Therapy Certification",
        "Specialist Facial Treatments Training",
        "Hot Stone Massage Qualification",
        // Add more specific qualifications here
      ]
    },
    {
      icon: Award,
      title: "Professional Memberships",
      items: [
        "Fully insured professional therapist",
        "Ongoing professional development and training",
        // Add actual memberships like "Member of BABTAC" or "FHT Member" etc.
      ]
    },
    {
      icon: ShieldCheck,
      title: "Health & Safety",
      items: [
        "Full Public Liability Insurance",
        "Professional Indemnity Insurance",
        "Hygiene & Sanitation Certification",
        "First Aid Certified",
        "Enhanced DBS Check",
      ]
    }
  ]
} as const;

interface QualificationsProps {
  className?: string;
}

const Qualifications: React.FC<QualificationsProps> = ({ className = "" }) => {
  return (
    <section
      className={`py-16 bg-secondary/30 ${className}`}
      aria-labelledby="qualifications-heading"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 id="qualifications-heading" className="text-3xl font-bold mb-4 text-center">
          {QUALIFICATIONS_DATA.title}
        </h2>
        <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
          {QUALIFICATIONS_DATA.intro}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {QUALIFICATIONS_DATA.categories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div
                key={categoryIndex}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {category.title}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-primary mt-1 flex-shrink-0">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white border-l-4 border-primary p-6 rounded-r-lg shadow-sm">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="text-primary">Experience You Can Trust:</strong> With over 7 years of experience working in prestigious 5-star spas including the Sheraton Hotel One Spa and Schloss, I bring professional expertise and a commitment to excellence to every treatment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Qualifications;
