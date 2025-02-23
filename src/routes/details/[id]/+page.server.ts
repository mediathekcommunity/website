import { error } from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
import { readItem } from '@directus/sdk';
import type { MetaTagsProps } from 'svelte-meta-tags';
export const ssr = false;

// Konstante für URLs
const BASE_MEDIA_URL = 'https://mediathekc.b-cdn.net/t/p/original/';
const BASE_ASSET_URL = 'https://api.mediathek.community/assets/';

// Konstante für Standard-Format
const DEFAULT_FORMAT_TYPE = 'application/dash+xml';

// Typen
interface MediaLink {
	title: string;
	streamlink: string;
	backdrop: string;
	backdropup: { filename_disk: string };
	streamformat: string;
	description: string;
	subtitles: Subtitle[];
	episode: string;
	season: string;
	dyna: boolean;
}

interface Subtitle {
	kind: string;
	src: string;
	srclang: string;
	label: string;
	default: boolean;
	spokenlang: boolean;
}

interface SubtitleLanguage {
	srclang: string;
	label: string;
	spokenlang: boolean;
}

interface PlaylistItem {
	title: string;
	src: string;
	thumb: string;
	type: string;
	description: string;
	infoTitle: string;
	infoDescription: string;
	tracks: Subtitle[];
	episodes: string;
	season: string;
}

interface VideoSource {
	src?: string;
	type?: string;
	tracks?: Subtitle[];
	poster?: string;
	skip?: number;
}

// Hilfsfunktion zur Erstellung der Bild-URL
function generateImageUrl(
	backdropFile: string,
	localFile: { filename_disk: string },
	data: any
): string {
	if (backdropFile && backdropFile.trim() !== '') {
		return `${BASE_MEDIA_URL}${backdropFile}`;
	} else if (localFile.filename_disk && localFile.filename_disk.trim() !== '') {
		return `${BASE_ASSET_URL}${localFile.filename_disk}`;
	} else {
		return `${BASE_MEDIA_URL}${data.backdrop}`;
	}
}
// Hilfsfunktion für das Format
function determineFormat(typeId: string): string {
	const formatTypes: Record<string, string> = {
		mpd: 'application/dash+xml',
		m3u8: 'application/x-mpegURL'
	};
	return formatTypes[typeId] || DEFAULT_FORMAT_TYPE;
}
const sorted: Record<string, { season: string; episode: string }[]> = {};

function groupEpisodesBySeason(
	episodes: { season: string; episode: string; [key: string]: any }[]
): Record<string, { season: string; episode: string; [key: string]: any }[]> {
	const grouped: Record<string, { season: string; episode: string; [key: string]: any }[]> = {};
	episodes.forEach((episode) => {
		const { season } = episode;
		if (!grouped[season]) {
			grouped[season] = [];
		}
		grouped[season].push(episode);
	});
	return grouped;
}

// Titel für Untertitel generieren
function generateSubtitleLabel(lang: string, spoken: boolean): string {
	return `${lang} ${spoken ? '(Spoken)' : ''}`;
}

// Hilfsfunktion: Formatiere Untertitel
function formatSubtitles(subtitles: any[]): Subtitle[] {
	return (
		subtitles?.map((sub) => ({
			kind: 'captions',
			src: sub.sublink,
			srclang: sub.sublang,
			label: generateSubtitleLabel(sub.sublang, sub.spokenlang),
			spokenlang: sub.spokenlang,
			default: false
		})) || []
	);
}

// Untertitel-Sprachen extrahieren
function extractSubtitleLanguages(subtitles: any[]): SubtitleLanguage[] {
	return (
		subtitles?.map((sub) => ({
			srclang: sub.sublang,
			label: generateSubtitleLabel(sub.sublang, sub.spokenlang),
			spokenlang: sub.spokenlang
		})) || []
	);
}

// Playlist erstellen
function createPlaylist(mediaLinks: MediaLink[], data: any): PlaylistItem[] {
	return (
		mediaLinks?.map((link) => ({
			title: link.title,
			src: link.streamlink,
			thumb: generateImageUrl(
				link.backdrop == undefined ? link.backdrop : '',
				link.backdropup != null ? link.backdropup : { filename_disk: '' },
				data
			),
			type: determineFormat(link.streamformat),
			description: link.description,
			infoTitle: link.title,
			infoDescription: link.description,
			tracks: formatSubtitles(link.subtitles),
			episodes: link.episode,
			season: link.season
		})) || []
	);
}

// Videoquelle generieren
function createVideoSource(
	links: MediaLink[],
	backdrop: string,
	localFile: { filename_disk: string }
): VideoSource {
	if (links.length === 0) return {};
	const firstLink = links[0];
	return {
		src: firstLink.streamlink,
		type: determineFormat(firstLink.streamformat),
		tracks: formatSubtitles(firstLink.subtitles),
		poster: generateImageUrl(backdrop, localFile),
		skip: 0
	};
}

// Capitalize-Funktion
function capitalizeFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Daten von Directus abrufen
async function fetchMediaEntry(id: string) {
	const directus = getDirectusInstance();
	return directus.request(
		readItem('mediathek', id, {
			fields: ['*.*.*'],
			limit: 10,
			deep: {
				channel: { limit: 5 },
				episodelist: {
					limit: 5,
					subtitles: { limit: 5 }
				},
				subtitles: { limit: 5 }
			}
		})
	);
}

// Load-Funktion
export async function load({ params, request, setHeaders }) {
	let error: string | null = null;
	// Validierung der params.id
	if (!params.id) {
		return { error: 'Missing media ID' };
	}

	let mediaEntry;

	// Versuch, die Media-Einträge zu laden
	try {
		mediaEntry = await fetchMediaEntry(params.id);
	} catch (err) {
		return { error: 'Failed to fetch media entry' };
	}

	// Prüfen, ob mediaEntry erfolgreich geladen wurde
	if (!mediaEntry) {
		error = 'Media entry is undefined';
	}

	// Prüfen, ob links vorhanden sind
	if (!Array.isArray(mediaEntry?.links) || mediaEntry.links.length === 0) {
		error = 'Media entry links are missing  or type is series';
	}

	const countryCode = request.headers.get('CDN-RequestCountryCode') ?? 'DE';

	// Playlist und Videoquelle erstellen
	const playlist = createPlaylist(mediaEntry?.episodes || [], mediaEntry) || [];
	const videoSource = createVideoSource(
		mediaEntry?.links || [],
		mediaEntry?.backdrop || '',
		mediaEntry?.backdropup || { filename_disk: '' }
	);

	// Untertitel-Sprachen extrahieren
	const firstSubtitles = mediaEntry?.links?.[0]?.subtitles || [];
	const subtitleLanguages = extractSubtitleLanguages(firstSubtitles);
	let t = params.id ? mediaEntry.title + ' on ' + mediaEntry.channel.name : 'Home';
	let d1 = params.id
		? 'Watch ' + mediaEntry.title + ' on ' + mediaEntry.channel.name
		: 'Watch the latest movies, series, music and more.';
	const pageMetaTags = Object.freeze({
		title: t,
		description: d1,
		openGraph: {
			title: 'Open Graph Title TOP',
			description: 'Open Graph Description TOP'
		}
	}) satisfies MetaTagsProps;

	setHeaders({
		'cache-control': 'max-age=3600'
	});
	return {
		error,
		page: mediaEntry || null,
		groupseasons: mediaEntry?.episodes ? groupEpisodesBySeason(mediaEntry.episodes) : {},
		episodes: mediaEntry?.episode || [],
		sublangs: subtitleLanguages,
		geo: capitalizeFirst(countryCode),
		seasons: mediaEntry?.season || [],
		playlist,
		cast: mediaEntry?.cast && mediaEntry?.cast.length > 0 ? mediaEntry?.cast.slice(0, 5) : [],
		crew: mediaEntry?.crew && mediaEntry?.crew.length > 0 ? mediaEntry?.crew.slice(0, 5) : [],
		videosource: videoSource || {},
		dyna: mediaEntry.dyna,
		pageMetaTags,
		serverhour: 23
	};
}
