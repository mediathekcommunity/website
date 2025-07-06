import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db } from "../../lib/db.js";
import * as schema from "../../schema.js";

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		// Authentication check
		if (!locals.isAuthenticated) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Authentication required",
					message: "You must be logged in to delete channels",
				}),
				{
					status: 401,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const body = await request.json();
		const { id } = body;

		if (!id) {
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

		// Check if channel exists
		const existingChannel = await db
			.select()
			.from(schema.channel)
			.where(eq(schema.channel.id, id))
			.limit(1);

		if (existingChannel.length === 0) {
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

		// Check if channel is used by any content
		const contentUsingChannel = await db
			.select()
			.from(schema.mediathek)
			.where(eq(schema.mediathek.channel, id))
			.limit(1);

		if (contentUsingChannel.length > 0) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Cannot delete channel: it is being used by existing content",
				}),
				{
					status: 409,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// Delete the channel
		await db.delete(schema.channel).where(eq(schema.channel.id, id));

		return new Response(
			JSON.stringify({
				success: true,
				message: "Channel deleted successfully",
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error deleting channel:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error: "Failed to delete channel",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
