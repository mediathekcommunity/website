import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Get environment variables with fallbacks
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Function to create database client with platform support
export function createDatabase(platform?: App.Platform) {
	// Use platform.env if available (for Cloudflare Workers), otherwise use process.env
	const databaseUrl = platform?.env?.DATABASE_URL || DATABASE_URL;
	const authToken = platform?.env?.DATABASE_AUTH_TOKEN || DATABASE_AUTH_TOKEN;

	if (!databaseUrl || !authToken) {
		throw new Error(
			`Database connection failed. Missing: ${!databaseUrl ? 'DATABASE_URL' : ''} ${!authToken ? 'DATABASE_AUTH_TOKEN' : ''}`.trim()
		);
	}

	console.log(`Connecting to database in ${NODE_ENV} environment`);

	const client = createClient({
		url: databaseUrl,
		authToken: authToken
	});

	return drizzle(client, { schema });
}

// Default database instance
const db = createDatabase();

export default db;
