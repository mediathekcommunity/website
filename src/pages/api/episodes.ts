// API to fetch episodes for a specific content item
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import * as schema from "../../schema";

export const GET: APIRoute = async (context) => {
	try {
		const url = new URL(context.request.url);
		const contentId = url.searchParams.get("content_id");
		const source = url.searchParams.get("source") || "local";

		if (!contentId) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "content_id parameter is required",
				}),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		// Filter episodes by mediaitem (content_id)
		const episodes = await db
			.select()
			.from(schema.medialinks_series)
			.where(eq(schema.medialinks_series.mediaitem, contentId));

		return new Response(
			JSON.stringify({
				success: true,
				data: episodes,
				count: episodes.length,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error("❌ Error fetching episodes:", error);

		return new Response(
			JSON.stringify({
				success: false,
				error: "Database operation failed.",
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
