import type { MetaTagsProps } from 'svelte-meta-tags';

const BASE_MEDIA_URL = 'https://mediathekc.b-cdn.net/t/p/original';
const BASE_ASSET_URL = 'https://api.mediathek.community/assets/';
const DEFAULT_FORMAT_TYPE = 'application/dash+xml';

// Helper: get image url for poster (use original generateImageUrl logic)
function getPoster(mediaEntry, params, type): string {
	//console.log('getPoster1', params);
	const backdropFile = mediaEntry.backdrop;
	const localFile = mediaEntry.backdropup || { filename_disk: '' };
	const data = mediaEntry;
	if (type != "PlaylistByOvAndSeason") {
		if (backdropFile !== undefined && backdropFile.trim() !== '') {
			return `${BASE_MEDIA_URL}${backdropFile}`;
		} else if (localFile.filename_disk && localFile.filename_disk.trim() !== '') {
			return `${BASE_ASSET_URL}${localFile.filename_disk}`;
		} else if (mediaEntry.poster && mediaEntry.poster.trim() !== '') {
			return `${BASE_MEDIA_URL}${mediaEntry.poster}`;
		} else {
			return `${BASE_MEDIA_URL}${data.backdrop}`;
		}
	} else {
		console.log('getPoster2', type, mediaEntry.poster);
		return `${BASE_MEDIA_URL}${mediaEntry.poster}`;
	}
}
// Helper: get video format
function determineFormat(typeId: string): string {
	const formatTypes: Record<string, string> = {
		mpd: 'application/dash+xml',
		m3u8: 'application/x-mpegURL',
		mp4: 'video/mp4',
		webm: 'video/webm'
	};
	return formatTypes[typeId] || DEFAULT_FORMAT_TYPE;
}

// Helper: create videosource for single link
function createVideoSource(link: any, mediaEntry: any): any {
	if (!link) return null;
	return {
		src: link.streamlink,
		type: determineFormat(link.streamformat),
		poster: getPoster(mediaEntry, ''),
		title: link.title || mediaEntry.title || ''
	};
}

// Helper: create playlist arrays (ov/nonov), grouped by season, using result.ov.seasonKey and result.regular.seasonKey
function createPlaylistByOvAndSeason(
	mediaLinks: any[] | undefined,
	params: any
): { regular: Record<string, any[]>; ov: Record<string, any[]> } {
	const result = { regular: {}, ov: {} } as {
		regular: Record<string, any[]>;
		ov: Record<string, any[]>;
	};
	if (!mediaLinks || mediaLinks.length === 0) return result;
	for (const link of mediaLinks) {
		const seasonKey = link.season !== undefined && link.season !== null ? String(link.season) : '1';
		const item = {
			title: link.title || '',
			src: link.streamlink,
			type: determineFormat(link.streamformat),
			poster: getPoster(link, params, 'PlaylistByOvAndSeason'),
			episode: link.episode !== undefined && link.episode !== null ? String(link.episode) : '',
			season: seasonKey,
			ov: link.ov
		};
		if (link.ov) {
			if (!result.ov[seasonKey]) result.ov[seasonKey] = [];
			result.ov[seasonKey].push(item);
		} else {
			if (!result.regular[seasonKey]) result.regular[seasonKey] = [];
			result.regular[seasonKey].push(item);
		}
	}
	// Sort episodes in each season
	for (const season in result.regular) {
		result.regular[season].sort((a, b) => parseInt(a.episode) - parseInt(b.episode));
	}
	for (const season in result.ov) {
		result.ov[season].sort((a, b) => parseInt(a.episode) - parseInt(b.episode));
	}
	return result;
}

// SvelteKit server load function
export async function load({ params, request, setHeaders, locals }) {
	const id1 = params.id;

	if (!id1 || typeof id1 === 'object') {
		return { status: 400, body: { error: 'Missing media ID' } };
	}
	//console.log('load', JSON.stringify(id1));
	let mediaEntry;
	try {
		mediaEntry = await locals.pb.collection('mediathek').getOne(id1, {
			expand: 'channel,links,slinks'
		});
		mediaEntry.slinks = mediaEntry.expand?.slinks || [];
	} catch (err) {
		console.log(err);
		return { status: 500, body: { error: 'Failed to fetch media entry' } };
	}
	const slinks = Array.isArray(mediaEntry.slinks) ? mediaEntry.slinks : [];
	const links = Array.isArray(mediaEntry.links) ? mediaEntry.links : [];

	// 1. info
	const info = {
		id: mediaEntry.id,
		title: mediaEntry.title,
		orgtitle: mediaEntry.orgtitle,
		description: mediaEntry.description,
		episodes: mediaEntry.episodes,
		seasons: mediaEntry.seasons,
		cast: mediaEntry.cast,
		crew: mediaEntry.crew,
		channel: mediaEntry.expand?.channel || mediaEntry.channel || '',
		country: mediaEntry.expand?.channel?.country || '',
		quality: mediaEntry.quality,
		poster: getPoster(mediaEntry, ''),
		backdrop: mediaEntry.backdrop,
		imdbrating: mediaEntry.imdbrating,
		metascore: mediaEntry.metascore,
		onlineuntil: mediaEntry.onlineuntil,
		type: mediaEntry.type
	};

	// 2. videosource (only if one link entry)
	let videosource = null;
	if (Array.isArray(links) && links.length === 1) {
		videosource = createVideoSource(links[0], mediaEntry);
	}

	// 3. playlist (ov/nonov arrays from slinks, grouped by season)
	const playlist = createPlaylistByOvAndSeason(slinks, id1);

	// 4. debug: print mediaEntry
	const debug = mediaEntry;

	setHeaders({
		'cache-control': 'max-age=3600'
	});
	//console.log(playlist);
	return {
		info,
		videosource,
		playlist,
		debug
	};
}
