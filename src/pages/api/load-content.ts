import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
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
		const contentId = url.searchParams.get("id");

		if (!contentId) {
			return new Response(
				JSON.stringify({ error: "Missing content ID parameter" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const mediathekItem = await db.query.mediathek.findFirst({
			where: eq(schema.mediathek.id, contentId),
			with: {
				channel: true,
				medialinks: true,
				seriesLinks: true,
			},
		});

		if (!mediathekItem) {
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

		let playlist: any;
		if (
			mediathekItem.type === "series" ||
			mediathekItem.type === "yseries"
		) {
			playlist = {
				regular: {} as any,
				ov: {} as any,
			};

			mediathekItem.seriesLinks.forEach((episode) => {
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

		const jsonData = {
			id: mediathekItem.id,
			title: mediathekItem.title,
			orgtitle: mediathekItem.orgtitle || undefined,
			geo: mediathekItem.channel?.country || undefined,
			fskcheck: mediathekItem.fskcheck,
			dyna: mediathekItem.dyna,
			created: mediathekItem.created?.toISOString(),
			lastupdated: mediathekItem.updated?.toISOString(),
			info: {
				type: mediathekItem.type,
				duration: mediathekItem.duration || 0,
				seasons: mediathekItem.seasons || 0,
				episodes: mediathekItem.episodes || 0,
				onlineuntil: mediathekItem.onlineuntil
					? mediathekItem.onlineuntil.toISOString()
					: "",
				quality: mediathekItem.quality || "",
				description: mediathekItem.description || "",
				backdrop: mediathekItem.backdrop || undefined,
				poster: mediathekItem.poster || undefined,
				channel: mediathekItem.channel
					? {
							name: mediathekItem.channel.name,
							country: mediathekItem.channel.country,
							icon: mediathekItem.channel.icon || undefined,
							info: false, // Default value
						}
					: {
							name: "",
							country: "de",
							icon: undefined,
							info: false,
						},
				cast: mediathekItem.cast
					? JSON.parse(mediathekItem.cast)
					: undefined,
				crew: mediathekItem.crew
					? JSON.parse(mediathekItem.crew)
					: undefined,
				spoken_languages: undefined, // This would need to be stored separately if needed
			},
			videosource:
				mediathekItem.type === "movie" && mediathekItem.medialinks
					? {
							src: mediathekItem.medialinks.streamlink,
							type: mediathekItem.medialinks.streamformat,
							title: mediathekItem.medialinks.streamnote,
							poster: "", // No direct poster for medialinks in schema
							audiolang: mediathekItem.medialinks.audiolang
								? JSON.parse(mediathekItem.medialinks.audiolang)
								: [],
							sources: mediathekItem.medialinks.streamlink
								? [
										{
											src: mediathekItem.medialinks.streamlink,
											type: mediathekItem.medialinks.streamformat || "video/mp4",
										},
									]
								: [],
						}
					: undefined,
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
