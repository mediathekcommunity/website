import { error } from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
import { readItem } from '@directus/sdk';

export const ssr = false;

// Helper function to construct image URLs
function getImageUrl(backdropup: any, backdrop: any): string {
	return backdrop
		? `https://mediathekc.b-cdn.net/t/p/original/${backdrop}`
		: `https://api.mediathek.community/assets/${backdropup.filename_disk}`;
}

// Helper function to determine the correct format type
function getFormatType(id: string): string {
	switch (id) {
		case 'mpd':
			return 'application/dash+xml';
		case 'm3u8':
			return 'application/x-mpegURL';
		default:
			return 'application/dash+xml';
	}
}

// Helper function to sort data by season and episode
function sortBySeasonAndEpisode(data: { slinks: { season: string; episode: string }[] }) {
	const sortedData: { [season: string]: { season: string; episode: string }[] } = {};

	for (const item of data.slinks) {
		const { season, episode } = item;
		if (!sortedData[season]) {
			sortedData[season] = [];
		}
		sortedData[season].push(item);
	}

	for (const season in sortedData) {
		sortedData[season].sort((a, b) => parseFloat(a.episode) - parseFloat(b.episode));
	}

	return sortedData;
}

// Type definition for subtitle objects
interface Subtitle {
	kind: string;
	src: string;
	srclang: string;
	label: string;
	default: boolean;
	spokenlang: boolean;
}

// Helper function to format subtitles
function getSubtitles(subtitles: any[]): Subtitle[] {
	if (!subtitles) {
		return [];
	}
	return subtitles.map((sub) => ({
		kind: 'captions',
		src: sub.sublink,
		srclang: sub.sublang,
		label: `${sub.sublang} ${sub.spokenlang ? '(Spoken)' : ''}`,
		spokenlang: sub.spokenlang,
		default: false
	}));
}

// Type definition for subtitle language objects
interface SubtitleLanguage {
	srclang: string;
	label: string;
	spokenlang: boolean;
}

// Helper function to extract subtitle languages
function getSubtitleLanguages(subtitles: any[]): SubtitleLanguage[] {
	if (!subtitles) {
		return [];
	}
	return subtitles.map((sub) => ({
		srclang: sub.sublang,
		label: `${sub.sublang} ${sub.spokenlang ? '(Spoken)' : ''}`,
		spokenlang: sub.spokenlang
	}));
}

// Function to fetch data from the Directus API
async function fetchMediathek(id: string) {
	const directus = getDirectusInstance(fetch);
	return await directus.request(
		readItem('mediathek', id, {
			fields: ['*.*.*'],
			limit: 10,
			deep: {
				channel: {
					limit: 5
				},
				episodelist: {
					limit: 5,
					subtitles: {
						limit: 5
					}
				},
				subtitles: {
					limit: 5
				}
			}
		})
	);
}

// Type definition for playlist item
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

// Helper function to generate a playlist
function generatePlaylist(slinks: any[]): PlaylistItem[] {
	if (!slinks) {
		return [];
	}
	return slinks.map((link: any) => ({
		title: link.title,
		src: link.streamlink,
		thumb: getImageUrl(
link.backdropup, link.backdrop),
		type: getFormatType(link.streamformat),
		description: link.description,
		infoTitle: link.title,
		infoDescription: link.description,
		tracks: getSubtitles(link.subtitles),
		episodes: link.episode,
		season: link.season
	}));
}

// Type definition for video source
interface VideoSource {
	src?: string;
	type?: string;
	tracks?: Subtitle[];
	poster?: string;
	skip?: number;
}

// Helper function to generate the video source object
function generateVideoSource(links: any[], backdrop: string, backdropup: string): VideoSource {
	if (links.length === 0) {
		return {};
	}
	return {
		src: links[0].streamlink,
		type: getFormatType(links[0].streamformat),
		tracks: getSubtitles(links[0].subtitles),
		poster: getImageUrl(backdrop, backdropup),
		skip: 0
	};
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Load function for the SvelteKit page
export async function load({ params, request }) {
	const mediathek = await fetchMediathek(params.id);
	const playlist = generatePlaylist(mediathek.slinks);
	const countryCode = request.headers.get('cf-ipcountry') || 'DE';
	const capitalizedCountryCode = capitalizeFirstLetter(countryCode);
	const videoSource = generateVideoSource(mediathek.links, mediathek.backdrop, mediathek.backdropup);
	const subtitleLanguages =
		mediathek.links.length > 0 ? getSubtitleLanguages(mediathek.links[0].subtitles) : [];

	return {
		page: mediathek,
		groupseasons: sortBySeasonAndEpisode(mediathek),
		episodes: mediathek.episode,
		sublangs: subtitleLanguages,
		geo: capitalizedCountryCode,
		seasons: mediathek.season,
		playlist: playlist,
		videosource: videoSource
	};
}
