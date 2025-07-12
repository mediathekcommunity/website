import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as rawEnv from '$env/static/private';
import * as schema from './schema';
console.log('Database URL:',  rawEnv);
 const client = createClient({
    url: rawEnv.DATABASE_URL,
    authToken: rawEnv.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

export default db;