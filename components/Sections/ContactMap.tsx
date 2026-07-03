import { contactInfo } from '@/lib/data/contactInfo';

export default function ContactMap() {
  return (
    <section className="h-[400px] w-full overflow-hidden rounded-t-3xl">
      <iframe
        src={contactInfo.mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Heavenly Treatments Location"
      />
    </section>
  );
}
