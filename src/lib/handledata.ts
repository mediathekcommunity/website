const BASE_MEDIA_URL = 'https://mediathekc.b-cdn.net/t/p/original';
const BASE_ASSET_URL = 'https://api2.mediathek.community/api/files/pbc_772122303/sjyo8dgc5h51h63/';
const DEFAULT_FORMAT_TYPE = 'application/dash+xml';

// Helper: get image url for poster (use original generateImageUrl logic)
function getPoster(mediaEntry: any, params: any, type: string, basedata: any): string {
	//console.log('getPoster1', params);
	const backdropFile = mediaEntry.backdrop;
	const localFile = mediaEntry.backdropup;
	const data = mediaEntry;
	if (type != 'PlaylistByOvAndSeason') {
		if (backdropFile !== undefined && backdropFile.trim() !== '') {
			return `${BASE_MEDIA_URL}${backdropFile}`;
		} else if (localFile && localFile.trim() !== '') {
			return `${BASE_ASSET_URL}${localFile}`;
		} else if (mediaEntry.poster && mediaEntry.poster.trim() !== '') {
			return `${BASE_MEDIA_URL}${mediaEntry.poster}`;
		} else {
			return `${BASE_MEDIA_URL}${mediaEntry.backdrop}`;
		}
	} else {
		console.log('getPoster2', basedata.coverimageup);
		if (mediaEntry.poster && mediaEntry.poster.trim() !== '') {
			return `${BASE_MEDIA_URL}${mediaEntry.poster}`;
		} else
			return `${BASE_ASSET_URL}${basedata.backdropup}`;
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
	//console.log('createVideoSource123', mediaEntry.links);
	return {
		src: mediaEntry.links.streamlink,
		type: determineFormat(mediaEntry.links.streamformat),
		poster: getPoster(mediaEntry, '', '', ''),
		title: mediaEntry.links.title || mediaEntry.title || '',
		audiolang: mediaEntry.links.audiolang || []
	};
}

// Helper: create playlist arrays (ov/nonov), grouped by season, using result.ov.seasonKey and result.regular.seasonKey
function createPlaylistByOvAndSeason(
	mediaLinks: any[] | undefined,
	params: any,
	basedata: any
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
			poster: getPoster(link, params, 'PlaylistByOvAndSeason', mediaLinks),
			episode: link.episode !== undefined && link.episode !== null ? String(link.episode) : '',
			season: seasonKey,
			ov: link.ov,
			thumb: getPoster(link, params, 'PlaylistByOvAndSeason', basedata),
			description: link.description || '',
			audiolang: link.audiolang || []
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

function datahelper(data: any, geo: string): {
	geo: string;
	info: {
		id: any;
		title: any;
		orgtitle: any;
		description: any;
		episodes: any;
		seasons: any;
		cast: any;
		crew: any;
		duration: any;
		channel: any;
		country: any;
		quality: any;
		poster: string;
		backdrop: any;
		imdbrating: any;
		metascore: any;
		onlineuntil: any;
		type: any;
	};
	videosource: any;
	playlist: {
		regular: Record<string, any[]>;
		ov: Record<string, any[]>;
	};
	debug: any;
	dyna: boolean
} {
	let mediaEntry = data;
	mediaEntry.slinks = mediaEntry.expand?.slinks || [];
	mediaEntry.links = mediaEntry.expand?.links || [];
	mediaEntry.channel = mediaEntry.expand?.channel || null;
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
		duration: mediaEntry.duration,
		channel: mediaEntry.expand?.channel || mediaEntry.channel || '',
		country: mediaEntry.expand?.channel?.country || '',
		quality: mediaEntry.quality,
		poster: getPoster(mediaEntry, '', '', ''),
		backdrop: mediaEntry.backdrop,
		imdbrating: mediaEntry.imdbrating,
		metascore: mediaEntry.metascore,
		onlineuntil: mediaEntry.onlineuntil,
		type: mediaEntry.type
	};
	// 2. videosource (only if one link entry)
	let videosource = null;
	if (Array.isArray(links) && links.length === 0) {
		//console.log('createVideoSource', 'links[0]');
		videosource = createVideoSource(links, mediaEntry);
		//console.log('createVideoSource', 'videosource', 'mediaEntry');
	} else {
		//console.log('createVideoSource', 'links.length', links.length);
	}
	// 3. playlist (ov/nonov arrays from slinks, grouped by season)
	const playlist = createPlaylistByOvAndSeason(slinks, mediaEntry, mediaEntry);
	// 4. debug: print mediaEntry
	const debug = mediaEntry;

	return {
		geo,
		info,
		videosource,
		playlist,
		debug,
		dyna: false
	}
}
export { datahelper };