// auth.config.ts
import Auth0  from '@auth/core/providers/auth0'
import { defineConfig } from 'auth-astro'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	providers: [
		Auth0({
            clientId: import.meta.env.AUTH0_CLIENT_ID,
            clientSecret: import.meta.env.AUTH0_CLIENT_SECRET,
		}),
	],
})