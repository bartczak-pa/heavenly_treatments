// Ensure this list matches the required status in env.d.ts
export const requiredEnvs: string[] = [//TODO: Add more envs as needed
    'RESEND_API_KEY',
    'EMAIL_FROM_ADDRESS',
    'CONTACT_EMAIL',
    'TURNSTILE_SECRET_KEY',
    'NEXT_PUBLIC_TURNSTILE_SITE_KEY'
];

export function validateEnv(): void {
    /**
     * Validates that all required environment variables are present and non-empty.
     * 
     * This function checks each environment variable listed in `requiredEnvs` to ensure:
     * 1. The variable exists in process.env
     * 2. The value is not undefined
     * 3. The value is not an empty string after trimming whitespace
     * 
     * If any required environment variables are missing or empty, it will:
     * 1. Log a detailed error message to the console
     * 2. Throw an Error with a list of missing variables
     * 
     * @throws {Error} When one or more required environment variables are missing or empty
     * @returns {void}
     */

    const missingEnvs = requiredEnvs.filter((env) => {
        const value: string | undefined = process.env[env];
        
        return value === undefined || value.trim() === '';
    });
    if (missingEnvs.length > 0) {
        
        console.error("FATAL ERROR: Missing required environment variables:", missingEnvs);
        throw new Error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
    }
    console.log("Environment variables validated successfully."); // Optional: confirmation log
}
