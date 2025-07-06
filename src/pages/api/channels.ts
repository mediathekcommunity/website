import { createClient } from "@libsql/client";
import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/libsql";
import { db } from "../../lib/db.js";
import * as schema from "../../schema.js";

export const GET: APIRoute = async ({ url }) => {
	// Only allow in development mode
	if (import.meta.env.PROD) {
		return new Response(
			JSON.stringify({
				error: "This endpoint is only available in development mode",
			}),
			{
				status: 403,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	try {
		// Get source parameter (local or cloud)
		const source = url.searchParams.get("source") || "local";

		let dbToUse;
		if (source === "cloud") {
			// Use remote database
			const remoteClient = createClient({
				url: process.env.TURSO_DATABASE_URL!,
				authToken: process.env.TURSO_AUTH_TOKEN!,
			});
			dbToUse = drizzle(remoteClient);
		} else {
			// Use local database (default)
			dbToUse = db;
		}

		// Get all channels
		const channels = await dbToUse
			.select({
				id: schema.channel.id,
				name: schema.channel.name,
				country: schema.channel.country,
				icon: schema.channel.icon,
				created: schema.channel.created,
				updated: schema.channel.updated,
			})
			.from(schema.channel);

		return new Response(
			JSON.stringify({
				success: true,
				channels: channels,
				count: channels.length,
				source: source,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error listing channels from database:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to list channels from database",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
