import { createClient } from "@libsql/client";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { db } from "../../lib/db.js";
import * as schema from "../../schema.js";

export const DELETE: APIRoute = async ({ request, locals }) => {
	try {
		// Authentication check
		if (!locals.isAuthenticated) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Authentication required",
					message: "You must be logged in to delete content",
				}),
				{
					status: 401,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// SECURITY: Only allow in development environment
		if (import.meta.env.PROD) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Delete operation not allowed in production",
				}),
				{
					status: 403,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const url = new URL(request.url);
		const id = url.searchParams.get("id");
		const source = url.searchParams.get("source") || "local";

		if (!id) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Content ID is required",
				}),
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

		// Check if record exists
		const existing = await dbToUse
			.select()
			.from(schema.mediathek)
			.where(eq(schema.mediathek.id, id))
			.limit(1);

		if (existing.length === 0) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Content not found",
				}),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// Delete related episodes first (if any)
		await dbToUse
			.delete(schema.medialinks_series)
			.where(eq(schema.medialinks_series.mediaitem, id));

		// Delete the main record
		await dbToUse.delete(schema.mediathek).where(eq(schema.mediathek.id, id));

		return new Response(
			JSON.stringify({
				success: true,
				message: `Content ${id} deleted successfully from database`,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error deleting content from database:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error: "Failed to delete content from database",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
