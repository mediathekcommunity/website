import { createClient } from "@libsql/client";
import type { APIRoute } from "astro";
import { desc } from "drizzle-orm";
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
		// Get all mediathek items
		const items = await db
			.select({
				id: schema.mediathek.id,
				title: schema.mediathek.title,
				type: schema.mediathek.type,
				updated: schema.mediathek.updated,
				created: schema.mediathek.created,
			})
			.from(schema.mediathek)
			.orderBy(desc(schema.mediathek.updated));

		const fileList = items.map((item) => ({
			filename: `${item.id}.json`, // For compatibility with existing frontend
			id: item.id,
			title: item.title,
			type: item.type,
			lastModified: item.updated.toISOString(),
			created: item.created.toISOString(),
			size: 0, // Not applicable for database records
		}));

		return new Response(
			JSON.stringify({
				success: true,
				files: fileList,
				source: "database", // Indicate source is database
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error listing content from database:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to list content from database",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
