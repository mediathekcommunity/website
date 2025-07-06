import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db } from "../../lib/db.js";
import * as schema from "../../schema.js";

export const GET: APIRoute = async ({ url }) => {
	try {
		const channelId = url.searchParams.get("id");

		if (!channelId) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Channel ID is required",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const channel = await db
			.select()
			.from(schema.channel)
			.where(eq(schema.channel.id, channelId))
			.limit(1);

		if (channel.length === 0) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Channel not found",
				}),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				data: channel[0],
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error loading channel:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error: "Failed to load channel",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
