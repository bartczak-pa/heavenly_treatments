// Ensure this list matches the required status in env.d.ts
export const requiredEnvs = [
    'RESEND_API_KEY',
    'EMAIL_FROM_ADDRESS',
    'CONTACT_EMAIL',
    'TURNSTILE_SECRET_KEY'
];

export function validateEnv(): void {
    const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);
    if (missingEnvs.length > 0) {
        
        console.error("FATAL ERROR: Missing required environment variables:", missingEnvs);
        throw new Error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
    }
    console.log("Environment variables validated successfully."); // Optional: confirmation log
}
