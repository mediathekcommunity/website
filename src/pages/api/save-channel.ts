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
					message: "You must be logged in to save channels",
				}),
				{
					status: 401,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const body = await request.json();

		if (body.id) {
			// Update existing channel
			const { id, data } = body;

			const updatedData = {
				...data,
				updated: new Date(),
			};

			await db
				.update(schema.channel)
				.set(updatedData)
				.where(eq(schema.channel.id, id));

			return new Response(
				JSON.stringify({
					success: true,
					message: "Channel updated successfully",
					id: id,
				}),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				},
			);
		} else {
			// Create new channel
			const newChannel = {
				name: body.name,
				country: body.country,
				icon: body.icon,
				created: new Date(),
				updated: new Date(),
			};

			const result = await db
				.insert(schema.channel)
				.values(newChannel)
				.returning();

			return new Response(
				JSON.stringify({
					success: true,
					message: "Channel created successfully",
					id: result[0].id,
				}),
				{
					status: 201,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	} catch (error) {
		console.error("Error saving channel:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error: "Failed to save channel",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
