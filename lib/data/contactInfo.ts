// Interface for Schema.org PostalAddress
interface PostalAddress {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string; // e.g., Town or City
    addressRegion?: string; // e.g., County or State
    postalCode: string;
    addressCountry: string; // e.g., GB or US
}

// Interface for Schema.org OpeningHoursSpecification
interface OpeningHoursSpecification {
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string[]; // Array of days, e.g., ["Monday", "Tuesday", ... "Sunday"]
    opens: string; // HH:MM format (e.g., "09:00")
    closes: string; // HH:MM format (e.g., "19:00")
}

// Interface for the main Contact Info
export interface ContactInfoType {
    businessName: string;
    email: string;
    phone: string;
    address: PostalAddress; 
    openingHours: OpeningHoursSpecification[];
    mapSrc?: string; // Keep optional for map link if needed separately
}

// Export the structured contact information
export const contactInfo: ContactInfoType = {
    businessName: 'Heavenly Treatments with Hayleybell',
    email: 'hayley@heavenly-treatments.co.uk',
    phone: '07960 315337',
    address: {
        '@type': 'PostalAddress',
        streetAddress: '6 Easter Softlaw Farm Cottage',
        addressLocality: 'Kelso',
        addressRegion: 'Scottish Borders',
        postalCode: 'TD5 8BJ',
        addressCountry: 'GB',
    },
    openingHours: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            opens: "09:00",
            closes: "19:00"
        }
    ],
    mapSrc: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL 
  }; 