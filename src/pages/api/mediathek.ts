// src/pages/api/mediathek.ts
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

		// Build query conditions
		let query = db.select().from(schema.mediathek);
		const conditions = [];

		if (type) {
			conditions.push(eq(schema.mediathek.type, type as any));
		}

		if (quality) {
			conditions.push(eq(schema.mediathek.quality, quality as any));
		}

		if (search) {
			conditions.push(like(schema.mediathek.title, `%${search}%`));
		}

		// Apply conditions if any
		if (conditions.length > 0) {
			query = query.where(and(...conditions)) as any;
		}

		// Add ordering and pagination
		query = query.orderBy(desc(schema.mediathek.created)) as any;

		const limitNum = limit ? parseInt(limit) : 50;
		const offsetNum = offset ? parseInt(offset) : 0;
		query = query.limit(limitNum).offset(offsetNum) as any;

		const results = await query;

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
					limit: limitNum,
					offset: offsetNum,
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

export const POST: APIRoute = async (context) => {
	try {
		// Authentication check
		if (!context.locals.isAuthenticated) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Authentication required",
					message: "You must be logged in to create content",
				}),
				{
					status: 401,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const data = await context.request.json();

		console.log("📝 Creating new mediathek item:", data.title);

		// Create new item with proper transformation
		const newItemData = {
			...transformers.pocketbaseToMediathek(data),
			// Convert boolean fields for libSQL/Turso
			fskcheck: data.fskcheck ? true : false,
			dyna: data.dyna ? true : false,
		};

		const [newItem] = await db
			.insert(schema.mediathek)
			.values(newItemData)
			.returning();
		const transformedItem = transformers.mediathekToResponse(newItem);

		return new Response(
			JSON.stringify({
				success: true,
				data: transformedItem,
			}),
			{
				status: 201,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error("❌ Error creating mediathek item:", error);

		return new Response(
			JSON.stringify({
				success: false,
				error: "Failed to create mediathek item.",
				code: "CREATE_ERROR",
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
