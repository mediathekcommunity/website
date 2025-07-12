import { relations } from "drizzle-orm/relations";
import { media, episodes, channels, moviesFiles } from "./schema";

export const episodesRelations = relations(episodes, ({one}) => ({
	media: one(media, {
		fields: [episodes.seriesId],
		references: [media.id]
	}),
}));

export const mediaRelations = relations(media, ({one, many}) => ({
	episodes: many(episodes),
	channel: one(channels, {
		fields: [media.channelId],
		references: [channels.id]
	}),
	moviesFiles: many(moviesFiles),
}));

export const channelsRelations = relations(channels, ({many}) => ({
	media: many(media),
}));

export const moviesFilesRelations = relations(moviesFiles, ({one}) => ({
	media: one(media, {
		fields: [moviesFiles.movieId],
		references: [media.id]
	}),
}));