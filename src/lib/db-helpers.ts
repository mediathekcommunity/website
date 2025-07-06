// src/lib/db-helpers.ts
import { v4 as uuidv4 } from "uuid";

// Type definitions for JSON fields
export interface CastMember {
	id: number;
	name: string;
	character?: string;
	profile_path?: string;
}

export interface CrewMember {
	id: number;
	name: string;
	job: string;
	department: string;
	profile_path?: string;
}

export type AudioLanguage = "gb" | "de" | "se" | "it" | "fr";
export type AudioLanguageSeries =
	| "gb-stereo"
	| "de-stereo"
	| "de-surround-sound-5-1"
	| "gb-surround-sound-5-1";

// Helper functions for JSON field handling
export const jsonHelpers = {
	// Cast helpers
	stringifyCast: (cast: CastMember[]): string => {
		return JSON.stringify(cast);
	},

	parseCast: (castString: string | null): CastMember[] => {
		if (!castString) return [];
		try {
			return JSON.parse(castString) as CastMember[];
		} catch {
			return [];
		}
	},

	// Crew helpers
	stringifyCrew: (crew: CrewMember[]): string => {
		return JSON.stringify(crew);
	},

	parseCrew: (crewString: string | null): CrewMember[] => {
		if (!crewString) return [];
		try {
			return JSON.parse(crewString) as CrewMember[];
		} catch {
			return [];
		}
	},

	// Audio language helpers
	stringifyAudioLang: (
		languages: AudioLanguage[] | AudioLanguageSeries[],
	): string => {
		return JSON.stringify(languages);
	},

	parseAudioLang: (langString: string | null): string[] => {
		if (!langString) return [];
		try {
			return JSON.parse(langString) as string[];
		} catch {
			return [];
		}
	},

	// Series links helpers (for slinks field)
	stringifySeriesLinks: (linkIds: string[]): string => {
		return JSON.stringify(linkIds);
	},

	parseSeriesLinks: (linksString: string | null): string[] => {
		if (!linksString) return [];
		try {
			return JSON.parse(linksString) as string[];
		} catch {
			return [];
		}
	},
};

// Database utility functions
export const dbUtils = {
	// Generate UUID for new records
	generateId: (): string => uuidv4(),

	// Current timestamp - Turso compatible
	now: (): Date => new Date(),

	// Convert Date to timestamp for database storage (if needed for specific fields)
	dateToTimestamp: (date: Date): number => date.getTime(),

	// Convert timestamp to Date
	timestampToDate: (timestamp: number): Date => new Date(timestamp),

	// Format timestamp for display
	formatDate: (timestamp: number | Date): string => {
		const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
		return date.toLocaleDateString();
	},

	formatDateTime: (timestamp: number | Date): string => {
		const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
		return date.toLocaleString();
	},

	// Boolean conversion helpers (SQLite stores booleans as integers)
	boolToInt: (value: boolean): number => (value ? 1 : 0),
	intToBool: (value: number | null): boolean => value === 1,
};

// Query helper functions
export const queryHelpers = {
	// Filter by type
	filterByType: (type: string) => ({
		type: type as "movie" | "series" | "other" | "music" | "ymovie" | "yseries",
	}),

	// Filter by quality
	filterByQuality: (quality: string) => ({
		quality: quality as "4k" | "1080p" | "720p" | "SD",
	}),

	// Filter by country
	filterByCountry: (country: string) => ({
		country: country as "de" | "gb" | "se" | "fr",
	}),

	// Filter by stream format
	filterByStreamFormat: (format: string) => ({
		streamformat: format as "mpd" | "m3u8" | "mp4" | "webm",
	}),

	// Date range filters
	createdAfter: (date: Date) => ({
		created: { gte: dbUtils.dateToTimestamp(date) },
	}),

	createdBefore: (date: Date) => ({
		created: { lte: dbUtils.dateToTimestamp(date) },
	}),

	onlineUntilAfter: (date: Date) => ({
		onlineuntil: { gte: dbUtils.dateToTimestamp(date) },
	}),

	// Search helpers
	titleContains: (search: string) => ({
		title: { like: `%${search}%` },
	}),

	orgtitleContains: (search: string) => ({
		orgtitle: { like: `%${search}%` },
	}),
};

// Validation functions
export const validators = {
	isValidUUID: (id: string): boolean => {
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return uuidRegex.test(id);
	},

	isValidStreamFormat: (
		format: string,
	): format is "mpd" | "m3u8" | "mp4" | "webm" => {
		return ["mpd", "m3u8", "mp4", "webm"].includes(format);
	},

	isValidQuality: (
		quality: string,
	): quality is "4k" | "1080p" | "720p" | "SD" => {
		return ["4k", "1080p", "720p", "SD"].includes(quality);
	},

	isValidCountry: (country: string): country is "de" | "gb" | "se" | "fr" => {
		return ["de", "gb", "se", "fr"].includes(country);
	},

	isValidMediaType: (
		type: string,
	): type is "movie" | "series" | "other" | "music" | "ymovie" | "yseries" => {
		return ["movie", "series", "other", "music", "ymovie", "yseries"].includes(
			type,
		);
	},
};

// Data transformation helpers
export const transformers = {
	// Transform PocketBase data to Drizzle format for Turso
	pocketbaseToMediathek: (pbData: any) => ({
		id: dbUtils.generateId(),
		created: dbUtils.now(),
		updated: dbUtils.now(),
		fskcheck: pbData.fskcheck !== undefined ? Boolean(pbData.fskcheck) : false,
		type: pbData.type || null,
		tmdbid: pbData.tmdbid || null,
		title: pbData.title || null,
		channel: pbData.channel || null,
		orgtitle: pbData.orgtitle || null,
		description: pbData.description || null,
		poster: pbData.poster || null,
		backdrop: pbData.backdrop || null,
		backdropup: pbData.backdropup || null,
		coverimage: pbData.coverimage || null,
		coverimageup: pbData.coverimageup || null,
		imdbrating: pbData.imdbrating || null,
		metascore: pbData.metascore || null,
		duration: pbData.duration || null,
		quality: pbData.quality || null,
		dyna: pbData.dyna !== undefined ? Boolean(pbData.dyna) : false,
		dynalink: pbData.dynalink || null,
		onlineuntil: pbData.onlineuntil ? new Date(pbData.onlineuntil) : null,
		episodes: pbData.episodes || null,
		seasons: pbData.seasons || null,
		links: pbData.links || null,
		slinks: pbData.slinks
			? jsonHelpers.stringifySeriesLinks(pbData.slinks)
			: null,
		cast: pbData.cast ? jsonHelpers.stringifyCast(pbData.cast) : null,
		crew: pbData.crew ? jsonHelpers.stringifyCrew(pbData.crew) : null,
	}),

	// Transform Drizzle data for API response (Turso uses proper boolean types)
	mediathekToResponse: (dbData: any) => ({
		...dbData,
		// Turso/libSQL stores booleans as actual booleans, not integers
		fskcheck: Boolean(dbData.fskcheck),
		dyna: Boolean(dbData.dyna),
		ov: Boolean(dbData.ov),
		fsubtitle: Boolean(dbData.fsubtitle),
		// Handle Date objects consistently
		created:
			dbData.created instanceof Date
				? dbData.created
				: new Date(dbData.created),
		updated:
			dbData.updated instanceof Date
				? dbData.updated
				: new Date(dbData.updated),
		onlineuntil: dbData.onlineuntil
			? dbData.onlineuntil instanceof Date
				? dbData.onlineuntil
				: new Date(dbData.onlineuntil)
			: null,
		cast: jsonHelpers.parseCast(dbData.cast),
		crew: jsonHelpers.parseCrew(dbData.crew),
		audiolang: jsonHelpers.parseAudioLang(dbData.audiolang),
		slinks: jsonHelpers.parseSeriesLinks(dbData.slinks),
	}),
};
