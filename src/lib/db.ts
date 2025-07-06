// src/lib/db.ts - Turso Database Connection

import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../schema";

// Create Turso client
function createTursoClient() {
	// Check for local file first (for development)
	const localFile = process.env.TURSO_LOCAL_FILE;
	if (localFile) {
		console.log(`📁 Using local Turso database: ${localFile}`);
		return createClient({
			url: `file:${localFile}`,
		});
	}

	// Use remote Turso database
	const url = process.env.TURSO_DATABASE_URL;
	const authToken = process.env.TURSO_AUTH_TOKEN;

	if (!url || !authToken) {
		throw new Error(
			"Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables (or TURSO_LOCAL_FILE for local development)",
		);
	}

	console.log("🌐 Using remote Turso database");
	return createClient({
		url,
		authToken,
	});
}

// Create Drizzle database instance
export const client = createTursoClient();
export const db = drizzle(client, { schema });

// Basic query helper class
export class MediathekQueries {
	constructor(private database = db) {}

	// Test connection
	async testConnection() {
		try {
			const result = await this.database.select().from(schema.channel).limit(1);
			return { success: true, data: result };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	// Channel queries
	async getChannels() {
		return await this.database.select().from(schema.channel);
	}

	async getChannelById(id: string) {
		const results = await this.database
			.select()
			.from(schema.channel)
			.where(eq(schema.channel.id, id));
		return results[0] || null;
	}

	// Mediathek queries
	async getMediathekItems(limit = 50) {
		return await this.database.select().from(schema.mediathek).limit(limit);
	}

	async getMediathekById(id: string) {
		const results = await this.database
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

// Export for backward compatibility
export function getDatabase() {
	return db;
}

// Export schema for reference
export { schema };
