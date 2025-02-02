import {error} from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
import {readItem} from '@directus/sdk';

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
    dyna:boolean;
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
    localFile: { filename_disk: string }
): string {
    return backdropFile
        ? `${BASE_MEDIA_URL}${backdropFile}`
        : `${BASE_ASSET_URL}${localFile.filename_disk}`;
}

// Hilfsfunktion für das Format
function determineFormat(typeId: string): string {
    const formatTypes: Record<string, string> = {
        mpd: 'application/dash+xml',
        m3u8: 'application/x-mpegURL',
    };
    return formatTypes[typeId] || DEFAULT_FORMAT_TYPE;
}

// Sortierung nach Staffel und Episode
function sortSeasons(data: { slinks: { season: string; episode: string }[] }) {
    const sorted: Record<string, { season: string; episode: string }[]> = {};

    data.slinks.forEach(({season, episode}) => {
        sorted[season] = sorted[season] || [];
        sorted[season].push({season, episode});
    });

    Object.keys(sorted).forEach((season) => {
        sorted[season].sort((a, b) => parseFloat(a.episode) - parseFloat(b.episode));
    });

    return sorted;
}

// Titel für Untertitel generieren
function generateSubtitleLabel(lang: string, spoken: boolean): string {
    return `${lang} ${spoken ? '(Spoken)' : ''}`;
}

// Hilfsfunktion: Formatiere Untertitel
function formatSubtitles(subtitles: any[]): Subtitle[] {
    return subtitles?.map((sub) => ({
        kind: 'captions',
        src: sub.sublink,
        srclang: sub.sublang,
        label: generateSubtitleLabel(sub.sublang, sub.spokenlang),
        spokenlang: sub.spokenlang,
        default: false,
    })) || [];
}

// Untertitel-Sprachen extrahieren
function extractSubtitleLanguages(
    subtitles: any[]
): SubtitleLanguage[] {
    return subtitles?.map((sub) => ({
        srclang: sub.sublang,
        label: generateSubtitleLabel(sub.sublang, sub.spokenlang),
        spokenlang: sub.spokenlang,
    })) || [];
}

// Playlist erstellen
function createPlaylist(mediaLinks: MediaLink[]): PlaylistItem[] {
    return mediaLinks?.map((link) => ({
        title: link.title,
        src: link.streamlink,
        thumb: generateImageUrl(link.backdrop, link.backdropup),
        type: determineFormat(link.streamformat),
        description: link.description,
        infoTitle: link.title,
        infoDescription: link.description,
        tracks: formatSubtitles(link.subtitles),
        episodes: link.episode,
        season: link.season,
    })) || [];
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
        skip: 0,
    };
}

// Capitalize-Funktion
function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Daten von Directus abrufen
async function fetchMediaEntry(id: string) {
    const directus = getDirectusInstance(fetch);
    return directus.request(
        readItem('mediathek', id, {
            fields: ['*.*.*'],
            limit: 10,
            deep: {
                channel: {limit: 5},
                episodelist: {
                    limit: 5,
                    subtitles: {limit: 5}
                },
                subtitles: {limit: 5},
            },
        })
    );
}

// Load-Funktion
export async function load({ params, request }) {
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
		console.error('Error fetching media entry:', err);
		return { error: 'Failed to fetch media entry' };
	}

	// Prüfen, ob mediaEntry erfolgreich geladen wurde
	if (!mediaEntry) {
		error = 'Media entry is undefined';
	}

	// Prüfen, ob links vorhanden sind
	if (!Array.isArray(mediaEntry?.links) || mediaEntry.links.length === 0) {
		error = 'Media entry links are missing or empty';
	}

	const countryCode = request.headers.get('cf-ipcountry') ?? 'DE';

	// Playlist und Videoquelle erstellen
	const playlist = createPlaylist(mediaEntry?.slinks || []) || [];
	const videoSource = createVideoSource(
		mediaEntry?.links || [],
		mediaEntry?.backdrop || '',
		mediaEntry?.backdropup || { filename_disk: '' }
	);

	// Untertitel-Sprachen extrahieren
	const firstSubtitles = mediaEntry?.links?.[0]?.subtitles || [];
	const subtitleLanguages = extractSubtitleLanguages(firstSubtitles);

	// Rückgabe mit potenziellen Fehlern
	return {
		error,
		page: mediaEntry || null,
		groupseasons: sortSeasons(mediaEntry) || {},
		episodes: mediaEntry?.episode || [],
		sublangs: subtitleLanguages,
		geo: capitalizeFirst(countryCode),
		seasons: mediaEntry?.season || [],
		playlist,
		videosource: videoSource || {},
        dyna: true || false
	};
}