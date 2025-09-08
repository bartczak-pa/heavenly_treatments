import OptimizedImage from '@/components/OptimizedImage';

export default function ExperienceSection() {
    return (
        <section id="experience" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
               <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary">
               Visit my Treatment Room in Kelso for a relaxing experience
              </h2>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              Take some time for you by visiting my treatment room in a cosy cottage, nestled away in the picturesque countryside of the Scottish Borders.
              </p>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              Each appointment will begin with a brief consultation to ensure the treatment is aligned with your needs.

              </p>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              I use high quality professional products in my treatments with primarily organic and natural ingredients to provide you with the best results.
              </p>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              Everything I use in the treatment room is also vegan and cruelty free. 


              </p>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              I look forward to welcoming you soon xx 
              </p>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              <OptimizedImage 
                src="heavenly-treatments-room"
                fallback="/images/about/heavenly-treatments-room.jpg" 
                alt="Relaxing treatment room at Heavenly Treatments in Kelso"
                fill
                style={{objectFit: 'cover'}}
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    )
}