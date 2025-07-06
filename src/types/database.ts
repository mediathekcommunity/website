// src/types/database.ts
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
	channel,
	medialinks,
	medialinks_series,
	mediathek,
} from "../schema";

// Inferred types from schema
export type Channel = InferSelectModel<typeof channel>;
export type NewChannel = InferInsertModel<typeof channel>;

export type MediaLinks = InferSelectModel<typeof medialinks>;
export type NewMediaLinks = InferInsertModel<typeof medialinks>;

export type MediaLinksSeries = InferSelectModel<typeof medialinks_series>;
export type NewMediaLinksSeries = InferInsertModel<typeof medialinks_series>;

export type Mediathek = InferSelectModel<typeof mediathek>;
export type NewMediathek = InferInsertModel<typeof mediathek>;

// Parsed types (after JSON parsing)
export interface MediathekParsed
	extends Omit<
		Mediathek,
		| "cast"
		| "crew"
		| "slinks"
		| "created"
		| "updated"
		| "onlineuntil"
		| "fskcheck"
		| "dyna"
	> {
	cast: CastMember[];
	crew: CrewMember[];
	slinks: string[];
	created: Date;
	updated: Date;
	onlineuntil: Date | null;
	fskcheck: boolean;
	dyna: boolean;
}

export interface MediaLinksParsed
	extends Omit<MediaLinks, "audiolang" | "created" | "updated" | "fsubtitle"> {
	audiolang: string[];
	created: Date;
	updated: Date;
	fsubtitle: boolean;
}

export interface MediaLinksSeriesParsed
	extends Omit<
		MediaLinksSeries,
		"audiolang" | "cast" | "crew" | "created" | "updated" | "fsubtitle" | "ov"
	> {
	audiolang: string[];
	cast: CastMember[];
	crew: CrewMember[];
	created: Date;
	updated: Date;
	fsubtitle: boolean;
	ov: boolean;
}

// JSON field types
export interface CastMember {
	id: number;
	name: string;
	character?: string;
	profile_path?: string;
	order?: number;
}

export interface CrewMember {
	id: number;
	name: string;
	job: string;
	department: string;
	profile_path?: string;
}

// Enum types
export type MediaType =
	| "movie"
	| "series"
	| "other"
	| "music"
	| "ymovie"
	| "yseries";
export type Quality = "4k" | "1080p" | "720p" | "SD";
export type Country = "de" | "gb" | "se" | "fr";
export type StreamFormat = "mpd" | "m3u8" | "mp4" | "webm";
export type AudioLanguage = "gb" | "de" | "se" | "it" | "fr";
export type AudioLanguageSeries =
	| "gb-stereo"
	| "de-stereo"
	| "de-surround-sound-5-1"
	| "gb-surround-sound-5-1";

// API response types
export interface MediathekWithChannel extends Omit<MediathekParsed, "channel"> {
	channel: Channel | null;
}

export interface MediathekWithLinks extends Omit<MediathekParsed, "channel"> {
	channel: Channel | null;
	medialinks: MediaLinksParsed | null;
	seriesLinks: MediaLinksSeriesParsed[];
}

export interface MoviesViewResult {
	id: string;
	created: Date;
	title: string | null;
	type: MediaType | null;
	orgtitle: string | null;
	poster: string | null;
	backdrop: string | null;
	backdropup: Buffer | null;
	coverimageup: Buffer | null;
	imdbrating: string | null;
	duration: string | null;
	metascore: string | null;
	episodes: number | null;
	seasons: number | null;
	quality: Quality | null;
	description: string | null;
	channel: string | null;
	channelicon: string | null;
	channelcountry: Country | null;
	onlineuntil: Date | null;
}

// Form/input types
export interface CreateChannelInput {
	name: string;
	country: Country;
	icon?: string;
}

export interface CreateMediathekInput {
	fskcheck?: boolean;
	type?: MediaType;
	tmdbid?: number;
	title?: string;
	channel?: string;
	orgtitle?: string;
	description?: string;
	poster?: string;
	backdrop?: string;
	backdropup?: Buffer;
	coverimage?: string;
	coverimageup?: Buffer;
	imdbrating?: string;
	metascore?: string;
	duration?: string;
	quality?: Quality;
	dyna?: boolean;
	dynalink?: string;
	onlineuntil?: Date;
	episodes?: number;
	seasons?: number;
	links?: string;
	slinks?: string[];
	cast?: CastMember[];
	crew?: CrewMember[];
}

export interface CreateMediaLinksInput {
	streamnote?: string;
	streamformat?: StreamFormat;
	streamlink?: string;
	audiolang?: AudioLanguage[];
	fsubtitle?: boolean;
}

export interface CreateMediaLinksSeriesInput {
	title?: string;
	season?: number;
	episode?: number;
	tmdbid?: number;
	streamnote?: string;
	streamformat?: StreamFormat;
	streamlink?: string;
	audiolang?: AudioLanguageSeries[];
	fsubtitle?: boolean;
	mediaitem?: string;
	ov?: boolean;
	poster?: string;
	backdrop?: string;
	description?: string;
	runtime?: number;
	orgtitle?: string;
	imdbRating?: number;
	metascore?: number;
	crew?: CrewMember[];
	cast?: CastMember[];
}

// Filter types
export interface MediathekFilters {
	type?: MediaType;
	quality?: Quality;
	country?: Country;
	channelId?: string;
	tmdbid?: number;
	fskcheck?: boolean;
	dyna?: boolean;
	onlineAfter?: Date;
	onlineBefore?: Date;
	createdAfter?: Date;
	createdBefore?: Date;
	search?: string;
	limit?: number;
	offset?: number;
}

export interface SeriesFilters {
	mediaitemId?: string;
	season?: number;
	episode?: number;
	tmdbid?: number;
	ov?: boolean;
	limit?: number;
	offset?: number;
}

// Migration data types (for converting from PocketBase)
export interface PocketBaseMediathek {
	id: string;
	created: string;
	updated: string;
	fskcheck?: boolean;
	type?: string;
	tmdbid?: number;
	title?: string;
	channel?: string;
	orgtitle?: string;
	description?: string;
	poster?: string;
	backdrop?: string;
	backdropup?: any;
	coverimage?: string;
	coverimageup?: any;
	imdbrating?: string;
	metascore?: string;
	duration?: string;
	quality?: string;
	dyna?: boolean;
	dynalink?: string;
	onlineuntil?: string;
	episodes?: number;
	seasons?: number;
	links?: string;
	slinks?: string[];
	cast?: any[];
	crew?: any[];
}
