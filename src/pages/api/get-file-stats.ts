import { createClient } from "@libsql/client";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
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
		// Get the content ID and source from URL parameters
		const contentId = url.searchParams.get("id");
		const source = url.searchParams.get("source") || "local";

		if (!contentId) {
			return new Response(
				JSON.stringify({ error: "Missing content ID parameter" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// Determine which database to use
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

		// Get record from database
		const items = await dbToUse
			.select({
				created: schema.mediathek.created,
				updated: schema.mediathek.updated,
			})
			.from(schema.mediathek)
			.where(eq(schema.mediathek.id, contentId))
			.limit(1);

		if (items.length === 0) {
			return new Response(
				JSON.stringify({
					error: "Content not found",
				}),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const item = items[0];

		return new Response(
			JSON.stringify({
				success: true,
				stats: {
					created: item.created.toISOString(),
					modified: item.updated.toISOString(),
					size: 0, // Not applicable for database records
				},
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error getting content stats from database:", error);

		return new Response(
			JSON.stringify({
				error: "Failed to get content stats from database",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
