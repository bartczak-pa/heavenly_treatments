'use client';

import Image from 'next/image';

export default function ExperienceSection() {
    return (
        <section id="experience" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
               <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary">
                 Your Sanctuary for Relaxation in Kelso
              </h2>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                From the moment you enter my treatment room, you&apos;ll feel the stresses of everyday life begin to melt away. I&apos;ve created a peaceful environment where soft lighting, calming music, and subtle aromatherapy work together to enhance your treatment experience.
              </p>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                Each visit begins with a warm welcome and a brief consultation, ensuring your treatment is perfectly aligned with your current needs. Throughout your session, your comfort is my priority—with adjustable heating, proper draping, and attention to pressure preferences.
              </p>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                I use only premium-quality products selected for their effectiveness and natural ingredients. After your treatment, you&apos;ll be offered refreshment and given time to slowly transition back to your day, carrying the benefits of your treatment with you.
              </p>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                Many of my clients describe their time at Heavenly Treatments as a transformative experience—not just a beauty treatment, but a genuine investment in their wellbeing and self-care.
              </p>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              <Image 
                src="/images/about/heavenly-treatments-room.jpg" 
                alt="Relaxing treatment room at Heavenly Treatments in Kelso"
                fill
                style={{objectFit: 'cover'}}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
    )
}