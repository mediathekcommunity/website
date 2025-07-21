import { defineConfig } from 'drizzle-kit';

/** @type { import("drizzle-kit").Config } */
export default defineConfig({
	schema: './src/lib/server/schema.js',
	out: './drizzle',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.NODE_ENV === 'development' 
			? (process.env.DATABASE_URL_DEV || process.env.DATABASE_URL)
			: process.env.DATABASE_URL,
		authToken: process.env.NODE_ENV === 'development'
			? (process.env.DATABASE_AUTH_TOKEN_DEV || process.env.DATABASE_AUTH_TOKEN)
			: process.env.DATABASE_AUTH_TOKEN
	}
});