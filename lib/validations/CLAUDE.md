# lib/validations/ - Zod Validation Schemas

Form validation schemas using Zod for runtime type checking and error messages.

## Pattern

Each file exports a Zod schema with:
- Clear field validation rules
- User-friendly error messages
- TypeScript type inference with `z.infer`

```typescript
import { z } from 'zod';

// Define schema
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  // ...
});

// Infer TypeScript type
export type ContactFormData = z.infer<typeof contactSchema>;
```

## Files

### contact.ts - Contact Form Validation

Validates contact form submissions:

```typescript
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  
  email: z.string()
    .email('Please enter a valid email address')
    .lowercase()
    .trim(),
  
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
  
  captcha: z.string()
    .min(1, 'Please complete the CAPTCHA verification'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

## Usage in Forms

### With React Hook Form

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validations/contact';

export function ContactForm() {
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      captcha: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Data is guaranteed to match schema at this point
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Handle response
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} />
      {form.formState.errors.name && (
        <span>{form.formState.errors.name.message}</span>
      )}
      {/* Other fields */}
      <button type="submit">Send</button>
    </form>
  );
}
```

### In API Routes

```typescript
import { contactSchema } from '@/lib/validations/contact';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = contactSchema.parse(data);
    
    // Data is now type-safe and validated
    await sendEmail(validated);
    
    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { errors: error.flatten() },
        { status: 400 }
      );
    }
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Zod Common Validators

### Strings
```typescript
z.string()
  .min(length, 'Error message')
  .max(length, 'Error message')
  .email('Invalid email')
  .url('Invalid URL')
  .regex(/pattern/, 'Error message')
  .trim()
  .lowercase()
  .uppercase()
```

### Numbers
```typescript
z.number()
  .min(value, 'Error message')
  .max(value, 'Error message')
  .int('Must be integer')
  .positive('Must be positive')
```

### Arrays
```typescript
z.array(z.string())
  .min(1, 'At least one item required')
  .max(10, 'Maximum 10 items allowed')
```

### Refinements (Custom Validation)
```typescript
z.object({
  password: z.string(),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords must match',
    path: ['confirmPassword'], // Focus on this field
  }
)
```

### Conditionals
```typescript
z.object({
  type: z.enum(['email', 'phone']),
  value: z.string()
    .refine(
      (val) => {
        // Custom validation based on type
        return true;
      },
      'Invalid value'
    ),
})
```

## Error Handling

### Parse vs SafeParse
```typescript
// .parse() throws on error
try {
  const data = schema.parse(input);
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation error
  }
}

// .safeParse() returns result object
const result = schema.safeParse(input);
if (!result.success) {
  console.log(result.error.flatten());
  // Handle errors
} else {
  console.log(result.data); // Type-safe data
}
```

### Error Format
```typescript
const result = schema.safeParse(input);

if (!result.success) {
  // Flatten structure for easy access
  const errors = result.error.flatten();
  // errors.fieldErrors.email[0] => "Invalid email"
  
  // Or use formErrors for non-field errors
  result.error.formErrors;
}
```

## Testing Validations

```typescript
import { contactSchema } from '@/lib/validations/contact';

describe('contactSchema', () => {
  describe('email field', () => {
    it('accepts valid emails', () => {
      expect(() => 
        contactSchema.parse({ 
          email: 'test@example.com',
          // ... other fields
        })
      ).not.toThrow();
    });

    it('rejects invalid emails', () => {
      const result = contactSchema.safeParse({ 
        email: 'invalid-email',
        // ... other fields
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it('requires email field', () => {
      const result = contactSchema.safeParse({
        // email missing
        // ... other fields
      });
      expect(result.success).toBe(false);
    });
  });

  it('strips whitespace', () => {
    const result = contactSchema.safeParse({
      email: '  test@example.com  ',
      // ... other fields
    });
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });
});
```

## Best Practices

### ✅ Do
- Include helpful error messages for users
- Use `.trim()` and `.lowercase()` for data normalization
- Test all validation rules
- Use `.refine()` for complex validation
- Type-check with `z.infer` after schema definition
- Keep schemas close to where they're used

### ❌ Don't
- Use overly strict patterns (complex regex)
- Skip testing validation edge cases
- Leave generic error messages like "Invalid"
- Mix validation and transformation concerns
- Create circular schema dependencies

## Adding New Validations

1. Create file in `lib/validations/[name].ts`
2. Define Zod schema with descriptive field names
3. Add helpful error messages
4. Export TypeScript type with `z.infer`
5. Add unit tests
6. Import `{ zodResolver }` in form component
7. Use with `useForm` from React Hook Form

## Reusable Field Schemas

Create common field validators:

```typescript
// lib/validations/common.ts
export const emailField = z.string()
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

export const nameField = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .trim();

// Use in other schemas
export const contactSchema = z.object({
  name: nameField,
  email: emailField,
  // ...
});
```
