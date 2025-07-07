import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
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

	try {
		const { id, data } = await request.json();

		if (!id || !data) {
			return new Response(JSON.stringify({ error: "Missing id or data" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Check if record already exists to determine if this is a create or update
		const existing = await db
			.select()
			.from(schema.mediathek)
			.where(eq(schema.mediathek.id, id))
			.limit(1);

		const isUpdate = existing.length > 0;
		const now = new Date();

		// Prepare the mediathek record
		const mediathekRecord: typeof schema.mediathek.$inferInsert = {
			id: id,
			title: data.title || null,
			orgtitle: data.orgtitle || null,
			type: data.info?.type || null,
			quality: data.info?.quality || null,
			description: data.info?.description || null,
			fskcheck: Boolean(data.fskcheck),
			dyna: Boolean(data.dyna),
			tmdbid: data.info?.tmdbid || null,
			duration: data.info?.duration || null,
			imdbrating: data.info?.imdbrating || null,
			metascore: data.info?.metascore || null,
			episodes: data.info?.episodes || null,
			seasons: data.info?.seasons || null,
			poster: data.info?.poster || null,
			backdrop: data.info?.backdrop || null,
			// backdropup and coverimageup (posterup) are blob types, not directly from frontend JSON
			// They would require separate handling for file uploads. Assuming they are not directly sent in 'data'
			backdropup: null,
			coverimage: null,
			coverimageup: null,
			dynalink: null,
			cast: data.info?.cast ? JSON.stringify(data.info.cast) : null,
			crew: data.info?.crew ? JSON.stringify(data.info.crew) : null,
			slinks: null, // Series links are handled separately below
			onlineuntil: data.info?.onlineuntil
				? new Date(data.info.onlineuntil)
				: null,
			created: isUpdate && existing[0] ? existing[0].created : now,
			updated: now,
			channel: null, // Will be set after channel processing
			links: null, // Medialinks for movies are handled separately
		};

		// Handle channel - find existing or create new
		if (data.info?.channel?.name && data.info?.channel?.country) {
			const existingChannel = await db
				.select()
				.from(schema.channel)
				.where(eq(schema.channel.name, data.info.channel.name))
				.limit(1);

			if (existingChannel.length > 0) {
				mediathekRecord.channel = existingChannel[0].id;
			} else {
				const channelId = crypto.randomUUID();
				await db.insert(schema.channel).values({
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
			await db
				.update(schema.mediathek)
				.set(mediathekRecord)
				.where(eq(schema.mediathek.id, id));
		} else {
			await db.insert(schema.mediathek).values(mediathekRecord);
		}

		// Handle series episodes if this is a series
		if (
			data.playlist &&
			(data.info?.type === "series" || data.info?.type === "y-series")
		) {
			// First, delete existing episodes for this mediathek item
			await db
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
							title: episode.title || null,
							season: episode.season || null,
							episode: episode.episode || null,
							tmdbid: episode.tmdbid || null,
							streamnote: episode.streamnote || null,
							streamformat: episode.sources?.[0]?.type || null,
							streamlink: episode.sources?.[0]?.src || null,
							audiolang: Array.isArray(episode.audiolang)
								? JSON.stringify(episode.audiolang)
								: null,
							fsubtitle: Boolean(episode.fsubtitle),
							mediaitem: id,
							ov: false,
							poster: episode.poster || null,
							backdrop: episode.backdrop || null,
							description: episode.description || null,
							runtime: episode.runtime || null,
							orgtitle: episode.orgtitle || null,
							imdbRating: episode.imdbRating || null,
							metascore: episode.metascore || null,
							crew: episode.crew ? JSON.stringify(episode.crew) : null,
							cast: episode.cast ? JSON.stringify(episode.cast) : null,
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
							title: episode.title || null,
							season: episode.season || null,
							episode: episode.episode || null,
							tmdbid: episode.tmdbid || null,
							streamnote: episode.streamnote || null,
							streamformat: episode.sources?.[0]?.type || null,
							streamlink: episode.sources?.[0]?.src || null,
							audiolang:
								typeof episode.audiolang === "string"
									? JSON.stringify([episode.audiolang])
									: null,
							fsubtitle: Boolean(episode.fsubtitle),
							mediaitem: id,
							ov: true,
							poster: episode.poster || null,
							backdrop: episode.backdrop || null,
							description: episode.description || null,
							runtime: episode.runtime || null,
							orgtitle: episode.orgtitle || null,
							imdbRating: episode.imdbRating || null,
							metascore: episode.metascore || null,
							crew: episode.crew ? JSON.stringify(episode.crew) : null,
							cast: episode.cast ? JSON.stringify(episode.cast) : null,
							created: now,
							updated: now,
						});
					}
				}
			}

			if (episodesToInsert.length > 0) {
				await db.insert(schema.medialinks_series).values(episodesToInsert);
			}
		}

		// Handle movie medialinks if this is a movie
		if (data.videosource && data.info?.type === "movie") {
			const medialinkId = crypto.randomUUID();
			const medialinkRecord: typeof schema.medialinks.$inferInsert = {
				id: medialinkId,
				streamnote: data.videosource.title || null,
				streamformat: data.videosource.type || null,
				streamlink: data.videosource.src || null,
				audiolang: Array.isArray(data.videosource.audiolang)
					? JSON.stringify(data.videosource.audiolang)
					: null,
				fsubtitle: Boolean(data.videosource.fsubtitle),
				created: now,
				updated: now,
			};

			// Delete existing medialinks for this mediathek item
			// This assumes a 1-to-1 relationship or that old links should be purged
			const existingMedialink = await db
				.select()
				.from(schema.medialinks)
				.where(eq(schema.medialinks.id, existing[0]?.links || "")) // Use existing link ID if available
				.limit(1);

			if (existingMedialink.length > 0) {
				await db
					.update(schema.medialinks)
					.set(medialinkRecord)
					.where(eq(schema.medialinks.id, existingMedialink[0].id));
				mediathekRecord.links = existingMedialink[0].id; // Link updated medialink to mediathek
			} else {
				await db.insert(schema.medialinks).values(medialinkRecord);
				mediathekRecord.links = medialinkId; // Link new medialink to mediathek
			}

			// Update mediathek with the medialink foreign key
			await db
				.update(schema.mediathek)
				.set({ links: mediathekRecord.links })
				.where(eq(schema.mediathek.id, id));
		}


		const action = isUpdate ? "updated" : "created";
		return new Response(
			JSON.stringify({
				success: true,
				message: `Content ${action} in Turso database`,
				isUpdate: isUpdate,
				source: "database", // Always database
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
	}
};
