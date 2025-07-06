// src/pages/api/mediathek-turso.ts
import type { APIRoute } from "astro";
import { and, desc, eq, like } from "drizzle-orm";
import { db } from "../../lib/db";
import { transformers } from "../../lib/db-helpers";
import * as schema from "../../schema";

export const GET: APIRoute = async (context) => {
	try {
		const url = new URL(context.request.url);
		const type = url.searchParams.get("type");
		const quality = url.searchParams.get("quality");
		const search = url.searchParams.get("search");
		const limit = url.searchParams.get("limit");
		const offset = url.searchParams.get("offset");

		console.log("🔍 Mediathek API called with params:", {
			type,
			quality,
			search,
			limit,
			offset,
		});

		// Execute query - simpler approach
		const results = await db.select().from(schema.mediathek);

		console.log(`📊 Found ${results.length} mediathek items`);

		// Transform the results to include parsed JSON fields and proper types
		const transformedResults = results.map((item) =>
			transformers.mediathekToResponse(item),
		);

		return new Response(
			JSON.stringify({
				success: true,
				data: transformedResults,
				count: transformedResults.length,
				pagination: {
					limit: limit ? parseInt(limit) : 50,
					offset: offset ? parseInt(offset) : 0,
				},
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error("❌ Error fetching mediathek items:", error);

		return new Response(
			JSON.stringify({
				success: false,
				error: "Database operation failed.",
				code: "DATABASE_ERROR",
				details: error instanceof Error ? error.message : String(error),
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
};
