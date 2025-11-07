# components/Contact/ - Contact Components

Components for contact form, contact information display, and map integration.

## Components

### ContactForm.tsx

Contact form with validation and email submission.

**Features**:
- React Hook Form for state management
- Zod validation with user-friendly errors
- Turnstile CAPTCHA protection
- Toast notifications for feedback
- Loading state during submission
- Server submission to `/api/contact`

**Props**:
```typescript
interface ContactFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}
```

**Form Fields**:
1. **Name** - Required, 2-100 characters
2. **Email** - Required, valid email format
3. **Subject** - Required, 5-200 characters
4. **Message** - Required, 10-5000 characters
5. **CAPTCHA** - Turnstile token validation

**Usage**:
```typescript
'use client';

import { ContactForm } from '@/components/Contact/ContactForm';

export function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <ContactForm />
    </div>
  );
}
```

**Validation Schema**:
Uses `contactSchema` from `@/lib/validations/contact`:
```typescript
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
  captcha: z.string().min(1),
});
```

**Form Submission Flow**:
1. User fills form
2. Click submit
3. Client-side validation with Zod
4. CAPTCHA verification with Turnstile
5. POST to `/api/contact`
6. Toast notification on success/error
7. Reset form on success (optional redirect)

**Error Handling**:
- Field-level error messages display below inputs
- API errors show in toast notification
- Validation errors prevent submission
- Network errors with retry option

**Styling**:
- Uses shadcn/ui Form components
- TailwindCSS responsive layout
- Error states with red text
- Loading spinner during submission

### ContactInfo.tsx

Static contact information display.

**Props**:
```typescript
interface ContactInfoProps {
  variant?: 'full' | 'compact';
  showHours?: boolean;
}
```

**Displays**:
- Phone number (clickable tel: link)
- Email address (clickable mailto: link)
- Physical address
- Business hours
- Location map link

**Variants**:
- **full**: Complete contact details with hours
- **compact**: Phone and email only

**Usage**:
```typescript
import { ContactInfo } from '@/components/Contact/ContactInfo';

<ContactInfo variant="full" showHours={true} />
```

**Data Source**:
Fetches from `@/lib/data/contactInfo`:
```typescript
export const CONTACT_INFO = {
  phone: '+44 (0) 1573 224402',
  email: 'hello@heavenlytreatments.com',
  address: 'Kelso, Scottish Borders',
};

export const BUSINESS_HOURS = {
  monday: { open: '10:00', close: '18:00' },
  // ...
};
```

**Styling**:
- Responsive layout
- Icons from Lucide React
- Semantic HTML (links with tel:, mailto:)
- Clear visual hierarchy

### MapEmbed.tsx

Google Maps embed showing spa location.

**Props**:
```typescript
interface MapEmbedProps {
  width?: string | number;
  height?: string | number;
  zoom?: number;
}
```

**Features**:
- Responsive iframe embed
- Default location from `lib/data/contactInfo`
- Configurable zoom level
- Fallback for embed failures
- Touch-friendly on mobile

**Usage**:
```typescript
import { MapEmbed } from '@/components/Contact/MapEmbed';

<MapEmbed width="100%" height={400} zoom={15} />
```

**Defaults**:
```typescript
const DEFAULT_MAP_EMBED = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
```

**Responsive**:
- Mobile: Full width with reduced height
- Desktop: Larger display

## Integration Pattern

**Typical Contact Page Structure**:
```typescript
import { ContactForm } from '@/components/Contact/ContactForm';
import { ContactInfo } from '@/components/Contact/ContactInfo';
import { MapEmbed } from '@/components/Contact/MapEmbed';

export default function ContactPage() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left column: Form */}
      <div>
        <h1>Get in Touch</h1>
        <ContactForm />
      </div>
      
      {/* Right column: Info & Map */}
      <div className="space-y-8">
        <ContactInfo variant="full" showHours={true} />
        <MapEmbed height={400} />
      </div>
    </div>
  );
}
```

## API Integration

### ContactForm → `/api/contact`

**Request**:
```typescript
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Appointment Inquiry",
  "message": "I would like to book...",
  "captcha": "0.xxx"
}
```

**Response - Success**:
```typescript
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Response - Error**:
```typescript
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "fieldErrors": {
      "email": ["Invalid email address"]
    }
  }
}
```

## Turnstile CAPTCHA

**Setup**:
1. Get Turnstile site key from Cloudflare
2. Add to environment: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
3. Add secret key: `TURNSTILE_SECRET_KEY`
4. Validate in API route

**In Component**:
```typescript
import { TurnstileWidget } from '@/components/Contact/TurnstileWidget';

// Get token from Turnstile
const handleTurnstile = (token: string) => {
  form.setValue('captcha', token);
};

<Turnstile 
  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
  onSuccess={handleTurnstile}
/>
```

## Form Submission Flow

```
User Input
    ↓
Client Validation (Zod)
    ↓
CAPTCHA Verification (Turnstile)
    ↓
POST /api/contact
    ↓
Server Validation
    ↓
Send Email (Resend)
    ↓
Store in Database (optional)
    ↓
Return Success/Error
    ↓
Toast Notification
```

## Type Definitions

```typescript
// Form data type (inferred from Zod schema)
type ContactFormData = z.infer<typeof contactSchema>;

// API response
interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Contact info
interface ContactInfoData {
  phone: string;
  email: string;
  address: string;
  postcode: string;
}

interface BusinessHours {
  [day: string]: {
    open: string;
    close: string;
  } | null;
}
```

## Toast Notifications

Uses custom hook `useContactFormToast`:

```typescript
const toast = useContactFormToast();

// After successful submission
toast.success('Message sent!', 'We will reply within 24 hours');

// On error
toast.error('Failed to send', error.message);
```

## Common Tasks

### Update Form Fields
1. Open `ContactForm.tsx`
2. Update form field names/labels
3. Modify validation in `lib/validations/contact.ts`
4. Update API route to handle new fields
5. Update email template

### Change Validation Rules
1. Edit `lib/validations/contact.ts`
2. Update error messages
3. Update form component error display
4. Test validation in component

### Update Contact Details
1. Edit `lib/data/contactInfo.ts`
2. Update phone, email, address
3. Update business hours
4. Update map location/zoom

### Style Form
1. Open `ContactForm.tsx`
2. Modify TailwindCSS classes
3. Update input/label styling
4. Test on mobile

## Styling

### Form Layout
- Mobile: Single column
- Desktop: Side-by-side layout for email/name

### Inputs
- Full-width on mobile
- Consistent height and padding
- Error states with red border/text
- Focus states with outline

### Buttons
- Full-width on mobile
- Disabled state while loading
- Loading spinner
- Hover effects

### Errors
- Display below field
- Red color (#ef4444)
- Clear, user-friendly messages
- Not in-place validation (avoid confusion)

## Testing

```typescript
describe('ContactForm', () => {
  it('submits form with valid data', async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    // ... fill other fields
    
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/sent successfully/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors', async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });
});
```

## Security Considerations

- ✅ Turnstile CAPTCHA prevents spam
- ✅ Zod validation on client and server
- ✅ Rate limiting recommended on API
- ✅ Email validation ensures valid addresses
- ✅ Message length limits prevent abuse
- ✅ Never expose secret keys in client

## Email Sending

Handled by `/api/contact` route using Resend:
- Sends confirmation email to user
- Sends notification email to admin
- Uses email templates from `components/Email/`
- Proper error handling and logging
