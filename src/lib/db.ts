// src/lib/db.ts - Turso Database Connection

import { createClient, type Client } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "../schema";

// Ensure a single client and database instance globally
let _client: Client | undefined;
let _db: LibSQLDatabase<typeof schema> | undefined;

function initializeDb() {
  if (_db) {
    return; // Already initialized
  }

  // Create Turso client
  const url = import.meta.env.TURSO_DATABASE_URL;
  const authToken = import.meta.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error(
      "Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables.",
    );
  }
  const client = createClient({ url, authToken });

  _client = client;
  _db = drizzle(client, { schema });
}

// Initialize the database immediately when the module is loaded
initializeDb();

// Export the initialized db instance
if (_db === undefined) {
  throw new Error("Database connection failed to initialize.");
}
export const db = _db;

// Basic query helper class (MediathekQueries will now directly use the exported `db` instance)
export class MediathekQueries {
  private db: LibSQLDatabase<typeof schema>;

  constructor(dbInstance: LibSQLDatabase<typeof schema>) {
    this.db = dbInstance;
  }

  async testConnection() {
    try {
      const result = await this.db.select().from(schema.channel).limit(1);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getChannels() {
    return await this.db.select().from(schema.channel);
  }

  async getChannelById(id: string) {
    const results = await this.db
      .select()
      .from(schema.channel)
      .where(eq(schema.channel.id, id));
    return results[0] || null;
  }

  async getMediathekItems(limit = 50) {
    return await this.db.select().from(schema.mediathek).limit(limit);
  }

  async getMediathekById(id: string) {
    const results = await this.db
      .select()
      .from(schema.mediathek)
      .where(eq(schema.mediathek.id, id));
    return results[0] || null;
  }
}

// Helper function to get query instance
export function getMediathekQueries() {
  return new MediathekQueries(db);
}

// Export schema for reference
export { schema };
