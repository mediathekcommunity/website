import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { dev } from '$app/environment';
import * as rawEnv from '$env/static/private';
import * as rawEnv2 from '$env/dynamic/private';

import * as schema from './schema';

// Function to get database client with platform.env support
export function createDatabase(platform?: App.Platform) {
	let databaseUrl: string;
	let authToken: string;

	console.log('Development mode:', dev);
	console.log('Platform available:', !!platform);

	if (dev) {
		// Development mode - use environment variables
		databaseUrl = rawEnv.DATABASE_URL;
		authToken = rawEnv.DATABASE_AUTH_TOKEN;
		console.log('Using development environment variables');
	} else if (platform?.env|| rawEnv2) {
		// Production mode - use platform.env (Cloudflare Workers)
		/*console.log('Platform environment variables available');
		console.log('Platform environment:', platform);
		console.log('Platform environment 2:', rawEnv);
		console.log('Platform environment variables22:', rawEnv2);*/
		databaseUrl = platform?.env.DATABASE_URL || rawEnv.DATABASE_URL;
		authToken = platform?.env.DATABASE_AUTH_TOKEN || rawEnv.DATABASE_AUTH_TOKEN;
		console.log('Using platform.env for Cloudflare Workers');
	} else {
		// Fallback to environment variables if platform is not available
		databaseUrl = rawEnv.DATABASE_URL;
		authToken = rawEnv.DATABASE_AUTH_TOKEN;
		console.log('Using fallback environment variables (platform not available)');
	}

	if (!databaseUrl || !authToken) {
		throw new Error('Database URL and auth token are required');
	}

	const client = createClient({
		url: databaseUrl,
		authToken: authToken
	});

	return drizzle(client, { schema });
}

// Default export for development and fallback
const db = createDatabase();
export default db;
