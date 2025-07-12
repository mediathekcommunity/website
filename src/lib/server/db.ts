import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { dev } from '$app/environment';
import * as rawEnv from '$env/static/private';

import * as schema from './schema';

// Function to get database client with platform.env support
export function createDatabase(platform?: App.Platform) {
    let databaseUrl: string;
    let authToken: string;
    console.log(platform, 'Platform environment:', platform?.env);
    if (dev || !platform) {
        // Development mode - use environment variables
        databaseUrl = rawEnv.DATABASE_URL;
        authToken = rawEnv.DATABASE_AUTH_TOKEN;
        console.log('Using development environment variables');
    } else {
        // Production mode - use platform.env (Cloudflare Workers)
        databaseUrl = platform.env.DATABASE_URL;
        authToken = platform.env.DATABASE_AUTH_TOKEN;
        console.log('Using platform.env for Cloudflare Workers');
    }

    const client = createClient({
        url: databaseUrl,
        authToken: authToken,
    });

    return drizzle(client, { schema });
}

// Default export for development
const db = createDatabase();
export default db;