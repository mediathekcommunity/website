import { createClient } from "@libsql/client";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { db } from "../../lib/db.js";
import * as schema from "../../schema.js";

export const POST: APIRoute = async ({ request, locals }) => {
	// Authentication check
	if (!locals.isAuthenticated) {
		return new Response(
			JSON.stringify({
				error: "Authentication required",
				message: "You must be logged in to save content",
			}),
			{
				status: 401,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

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

	let remoteClient: any = null;

	try {
		const { id, data, source } = await request.json();

		if (!id || !data) {
			return new Response(JSON.stringify({ error: "Missing id or data" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Determine which database to use
		const useSource = source || "local";
		let dbToUse;
		if (useSource === "cloud") {
			// Use remote database
			console.log("Using CLOUD database for save operation");
			remoteClient = createClient({
				url: process.env.TURSO_DATABASE_URL!,
				authToken: process.env.TURSO_AUTH_TOKEN!,
			});
			dbToUse = drizzle(remoteClient);
		} else {
			// Use local database (default)
			console.log("Using LOCAL database for save operation");
			dbToUse = db;
		}

		// Check if record already exists to determine if this is a create or update
		const existing = await dbToUse
			.select()
			.from(schema.mediathek)
			.where(eq(schema.mediathek.id, id))
			.limit(1);

		const isUpdate = existing.length > 0;
		const now = new Date();

		// Prepare the mediathek record
		const mediathekRecord = {
			id: id,
			title: data.title || "",
			orgtitle: data.orgtitle || null,
			type: data.info?.type || "movie",
			quality: data.info?.quality || "",
			description: data.info?.description || "",

			// Channel reference (we'll need to find or create channel)
			channel: null as string | null,

			// Numeric fields
			tmdbid: null,
			duration: data.info?.duration || null,
			year: null,
			imdbrating: null,
			metascore: null,
			episodes: data.info?.episodes || null,
			seasons: data.info?.seasons || null,

			// Text fields
			country: data.geo || null,
			language: null,
			genre: null,

			// File/URL fields
			poster: data.info?.poster || null,
			backdrop: data.info?.backdrop || null,
			backdropup: null,
			coverimage: null,
			coverimageup: null,
			dynalink: null,

			// JSON fields
			cast: data.info?.cast ? JSON.stringify(data.info.cast) : null,
			crew: data.info?.crew ? JSON.stringify(data.info.crew) : null,
			slinks: null,

			// Boolean fields
			fskcheck: Boolean(data.fskcheck),
			dyna: Boolean(data.dyna),

			// Dates
			onlineuntil: data.info?.onlineuntil
				? new Date(data.info.onlineuntil)
				: null,
			created: isUpdate && existing[0] ? existing[0].created : now,
			updated: now,

			// Foreign key will be set later
			links: null,
		};

		// Handle channel - find existing or create new
		if (data.info?.channel?.name && data.info?.channel?.country) {
			// Try to find existing channel first
			const existingChannel = await dbToUse
				.select()
				.from(schema.channel)
				.where(eq(schema.channel.name, data.info.channel.name))
				.limit(1);

			if (existingChannel.length > 0) {
				mediathekRecord.channel = existingChannel[0].id;
			} else {
				// Create new channel
				const channelId = crypto.randomUUID();
				await dbToUse.insert(schema.channel).values({
					id: channelId,
					name: data.info.channel.name,
					country: data.info.channel.country,
					icon: data.info.channel.icon || null,
					created: now,
					updated: now,
				});
				mediathekRecord.channel = channelId;
			}
		}

		if (isUpdate) {
			// Update existing record
			await dbToUse
				.update(schema.mediathek)
				.set(mediathekRecord)
				.where(eq(schema.mediathek.id, id));
		} else {
			// Insert new record
			await dbToUse.insert(schema.mediathek).values(mediathekRecord);
		}

		// Handle series episodes if this is a series
		if (
			data.playlist &&
			(data.info?.type === "series" || data.info?.type === "y-series")
		) {
			// First, delete existing episodes for this mediathek item
			await dbToUse
				.delete(schema.medialinks_series)
				.where(eq(schema.medialinks_series.mediaitem, id));

			// Insert new episodes
			const episodesToInsert = [];

			// Process regular episodes
			if (data.playlist.regular) {
				for (const [seasonKey, episodes] of Object.entries(
					data.playlist.regular,
				)) {
					for (const episode of episodes as any[]) {
						episodesToInsert.push({
							id: crypto.randomUUID(),
							title: episode.title,
							season: episode.season,
							episode: episode.episode,
							tmdbid: null,
							streamnote: null,
							streamformat: null,
							streamlink: episode.sources?.[0]?.src || null,
							audiolang: Array.isArray(episode.audiolang)
								? JSON.stringify(episode.audiolang)
								: null,
							fsubtitle: false,
							mediaitem: id,
							ov: false,
							poster: null,
							backdrop: null,
							description: episode.description || null,
							runtime: null,
							orgtitle: null,
							imdbRating: null,
							metascore: null,
							crew: null,
							cast: null,
							created: now,
							updated: now,
						});
					}
				}
			}

			// Process OV episodes
			if (data.playlist.ov) {
				for (const [seasonKey, episodes] of Object.entries(data.playlist.ov)) {
					for (const episode of episodes as any[]) {
						episodesToInsert.push({
							id: crypto.randomUUID(),
							title: episode.title,
							season: episode.season,
							episode: episode.episode,
							tmdbid: null,
							streamnote: null,
							streamformat: null,
							streamlink: episode.sources?.[0]?.src || null,
							audiolang:
								typeof episode.audiolang === "string"
									? JSON.stringify([episode.audiolang])
									: null,
							fsubtitle: false,
							mediaitem: id,
							ov: true,
							poster: null,
							backdrop: null,
							description: episode.description || null,
							runtime: null,
							orgtitle: null,
							imdbRating: null,
							metascore: null,
							crew: null,
							cast: null,
							created: now,
							updated: now,
						});
					}
				}
			}

			if (episodesToInsert.length > 0) {
				await dbToUse.insert(schema.medialinks_series).values(episodesToInsert);
			}
		}

		const action = isUpdate ? "updated" : "created";
		return new Response(
			JSON.stringify({
				success: true,
				message: `Content ${action} in Turso database`,
				isUpdate: isUpdate,
				source: useSource,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error saving to database:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to save to database",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	} finally {
		// Close remote connection if it was used
		if (remoteClient) {
			remoteClient.close();
		}
	}
};
