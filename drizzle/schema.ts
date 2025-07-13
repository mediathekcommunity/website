import { sqliteTable, AnySQLiteColumn, foreignKey, text, integer } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const episodes = sqliteTable("EPISODES", {
	id: text().primaryKey().notNull(),
	seriesId: text("series_id").notNull().references(() => media.id, { onDelete: "cascade" } ),
	seasonNumber: integer("season_number"),
	episodeNumber: integer("episode_number"),
	title: text(),
	description: text(),
	originalVideoUrl: text("original_video_url"),
	localVideoUrl: text("local_video_url"),
	releaseDate: text("release_date"),
	audioLanguageFormat: text("audio_language_format"),
	subtitlesInfo: text("subtitles_info"),
});

export const media = sqliteTable("MEDIA", {
	id: text().primaryKey().notNull(),
	type: text().notNull(),
	title: text().notNull(),
	description: text(),
	posterUrl: text("poster_url"),
	backdropUrl: text("backdrop_url"),
	genre: text(),
	releaseDateYear: text("release_date_year"),
	castCrew: text("cast_crew"),
	channelId: text("channel_id").references(() => channels.id),
});

export const moviesFiles = sqliteTable("MOVIES_FILES", {
	id: text().primaryKey().notNull(),
	movieId: text("movie_id").notNull().references(() => media.id, { onDelete: "cascade" } ),
	videoUrl: text("video_url").notNull(),
	format: text(),
	audioLanguageFormat: text("audio_language_format"),
	subtitlesInfo: text("subtitles_info"),
	quality: text(),
	localVideoUrl: text("local_video_url"),
});

export const channels = sqliteTable("CHANNELS", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	title: text(),
	poster: text(),
	icon: text(),
	country: text(),
});

