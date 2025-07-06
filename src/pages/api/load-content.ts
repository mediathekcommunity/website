import { createClient } from "@libsql/client";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
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
		// Get the content ID and source from URL parameters
		const contentId = url.searchParams.get("id");
		const source = url.searchParams.get("source") || "local";

		if (!contentId) {
			return new Response(
				JSON.stringify({ error: "Missing content ID parameter" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

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

		// Load the mediathek item with related data
		const items = await dbToUse
			.select()
			.from(schema.mediathek)
			.leftJoin(schema.channel, eq(schema.mediathek.channel, schema.channel.id))
			.where(eq(schema.mediathek.id, contentId))
			.limit(1);

		if (items.length === 0) {
			return new Response(
				JSON.stringify({
					error: "Content not found",
				}),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const item = items[0];
		const mediathekRecord = item.mediathek;
		const channelRecord = item.channel;

		// Load episodes if this is a series
		let playlist: any;
		if (
			mediathekRecord.type === "series" ||
			mediathekRecord.type === "yseries"
		) {
			const episodes = await dbToUse
				.select()
				.from(schema.medialinks_series)
				.where(eq(schema.medialinks_series.mediaitem, contentId));

			// Group episodes by type (regular/ov) and season
			playlist = {
				regular: {} as any,
				ov: {} as any,
			};

			episodes.forEach((episode) => {
				const type = episode.ov ? "ov" : "regular";
				const seasonKey = String(episode.season);

				if (!playlist[type][seasonKey]) {
					playlist[type][seasonKey] = [];
				}

				playlist[type][seasonKey].push({
					season: episode.season,
					episode: episode.episode,
					title: episode.title,
					description: episode.description || undefined,
					audiolang: episode.ov
						? episode.audiolang
							? JSON.parse(episode.audiolang)[0]
							: ""
						: episode.audiolang
							? JSON.parse(episode.audiolang)
							: [],
					sources: episode.streamlink
						? [
								{
									src: episode.streamlink,
									type: episode.streamformat || "video/mp4",
								},
							]
						: [],
				});
			});
		}

		// Convert database record back to the expected JSON format
		const jsonData = {
			id: mediathekRecord.id,
			title: mediathekRecord.title,
			orgtitle: mediathekRecord.orgtitle || undefined,
			geo: channelRecord?.country || undefined,
			fskcheck: mediathekRecord.fskcheck,
			dyna: mediathekRecord.dyna,
			created: mediathekRecord.created.toISOString(),
			lastupdated: mediathekRecord.updated.toISOString(),
			info: {
				type: mediathekRecord.type,
				duration: mediathekRecord.duration || 0,
				seasons: mediathekRecord.seasons || 0,
				episodes: mediathekRecord.episodes || 0,
				onlineuntil: mediathekRecord.onlineuntil
					? mediathekRecord.onlineuntil.toISOString()
					: "",
				quality: mediathekRecord.quality || "",
				description: mediathekRecord.description || "",
				backdrop: mediathekRecord.backdrop || undefined,
				poster: mediathekRecord.poster || undefined,
				channel: channelRecord
					? {
							name: channelRecord.name,
							country: channelRecord.country,
							icon: channelRecord.icon || undefined,
							info: false, // Default value
						}
					: {
							name: "",
							country: "de",
							icon: undefined,
							info: false,
						},
				cast: mediathekRecord.cast
					? JSON.parse(mediathekRecord.cast)
					: undefined,
				crew: mediathekRecord.crew
					? JSON.parse(mediathekRecord.crew)
					: undefined,
				spoken_languages: undefined, // This would need to be stored separately if needed
			},
			// Add movie-specific fields if movie
			videosource:
				mediathekRecord.type === "movie"
					? {
							src: "",
							type: "",
							title: "",
							poster: "",
							audiolang: [],
							sources: [],
						}
					: undefined,
			// Add series-specific fields if series
			playlist: playlist,
		};

		return new Response(
			JSON.stringify({
				success: true,
				data: jsonData,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error loading content from database:", error);

		return new Response(
			JSON.stringify({
				error: "Failed to load content from database",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
