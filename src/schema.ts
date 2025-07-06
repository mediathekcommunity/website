// src/schema.ts

import { relations } from "drizzle-orm";
import {
	blob,
	integer,
	real,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

// Channel table
export const channel = sqliteTable("channel", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	name: text("name"),
	country: text("country", { enum: ["de", "gb", "se", "fr"] }),
	icon: text("icon"),
	created: integer("created", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updated: integer("updated", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
});

// Media links table (for movies)
export const medialinks = sqliteTable("medialinks", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	streamnote: text("streamnote"),
	streamformat: text("streamformat", { enum: ["mpd", "m3u8", "mp4", "webm"] }),
	streamlink: text("streamlink"),
	audiolang: text("audiolang"), // JSON array stored as text ["gb", "de", "se", "it", "fr"]
	fsubtitle: integer("fsubtitle", { mode: "boolean" }),
	created: integer("created", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updated: integer("updated", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
});

// Media links for series episodes
export const medialinks_series = sqliteTable("medialinks_series", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	title: text("title"),
	season: real("season"),
	episode: real("episode"),
	tmdbid: real("tmdbid"),
	streamnote: text("streamnote"),
	streamformat: text("streamformat", { enum: ["mpd", "m3u8", "mp4", "webm"] }),
	streamlink: text("streamlink"),
	audiolang: text("audiolang"), // JSON array stored as text ["gb-stereo", "de-stereo", "de-surround-sound-5-1", "gb-surround-sound-5-1"]
	fsubtitle: integer("fsubtitle", { mode: "boolean" }),
	mediaitem: text("mediaitem"), // Foreign key to mediathek
	ov: integer("ov", { mode: "boolean" }),
	poster: text("poster"),
	backdrop: text("backdrop"),
	description: text("description"),
	runtime: real("runtime"),
	orgtitle: text("orgtitle"),
	imdbRating: real("imdbRating"),
	metascore: real("metascore"),
	crew: text("crew"), // JSON stored as text
	cast: text("cast"), // JSON stored as text
	created: integer("created", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updated: integer("updated", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
});

// Main mediathek table
export const mediathek = sqliteTable("mediathek", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	created: integer("created", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updated: integer("updated", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	fskcheck: integer("fskcheck", { mode: "boolean" }),
	type: text("type", {
		enum: ["movie", "series", "other", "music", "ymovie", "yseries"],
	}),
	tmdbid: real("tmdbid"),
	title: text("title"),
	channel: text("channel"), // Foreign key to channel
	orgtitle: text("orgtitle"),
	description: text("description"), // Rich text/editor content
	poster: text("poster"),
	backdrop: text("backdrop"),
	backdropup: blob("backdropup"), // File field
	coverimage: text("coverimage"),
	coverimageup: blob("coverimageup"), // File field
	imdbrating: text("imdbrating"),
	metascore: text("metascore"),
	duration: text("duration"),
	quality: text("quality", { enum: ["4k", "1080p", "720p", "SD"] }),
	dyna: integer("dyna", { mode: "boolean" }),
	dynalink: text("dynalink"),
	onlineuntil: integer("onlineuntil", { mode: "timestamp_ms" }), // Date field
	episodes: real("episodes"),
	seasons: real("seasons"),
	links: text("links"), // Foreign key to medialinks
	slinks: text("slinks"), // JSON array of foreign keys to medialinks_series
	cast: text("cast"), // JSON stored as text
	crew: text("crew"), // JSON stored as text
});

// Define relations
export const channelRelations = relations(channel, ({ many }) => ({
	mediathek: many(mediathek),
}));

export const mediathekRelations = relations(mediathek, ({ one, many }) => ({
	channel: one(channel, {
		fields: [mediathek.channel],
		references: [channel.id],
	}),
	medialinks: one(medialinks, {
		fields: [mediathek.links],
		references: [medialinks.id],
	}),
	seriesLinks: many(medialinks_series),
}));

export const medialinksSerieslations = relations(
	medialinks_series,
	({ one }) => ({
		mediaitem: one(mediathek, {
			fields: [medialinks_series.mediaitem],
			references: [mediathek.id],
		}),
	}),
);

// Export all tables for use in queries
export const db = {
	channel,
	medialinks,
	medialinks_series,
	mediathek,
};
