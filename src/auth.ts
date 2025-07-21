import { SvelteKitAuth } from '@auth/sveltekit';
import Auth0 from '@auth/sveltekit/providers/auth0';

// Function to load environment variables from .env file if needed
function loadEnvVar(key: string): string {
	// Try process.env first
	let value = process.env[key];
	
	// If not found and we're in a build environment, try to read from .env file
	if (!value && typeof window === 'undefined') {
		try {
			// Only available during build time if .env is copied
			const fs = require('fs');
			const path = require('path');
			const envPath = path.join(process.cwd(), '.env');
			
			if (fs.existsSync(envPath)) {
				const envFile = fs.readFileSync(envPath, 'utf8');
				const match = envFile.match(new RegExp(`^${key}=(.*)$`, 'm'));
				if (match) {
					value = match[1].replace(/^"(.*)"$/, '$1'); // Remove quotes if present
				}
			}
		} catch (error) {
			// Ignore errors, fallback to empty string
		}
	}
	
	return value || '';
}

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Auth0({
			clientId: loadEnvVar('AUTH0_CLIENT_ID'),
			clientSecret: loadEnvVar('AUTH0_CLIENT_SECRET'),
			issuer: loadEnvVar('AUTH0_ISSUER_BASE_URL')
		})
	],
	trustHost: true // Set to true if you trust the host
});
