import { error } from '@sveltejs/kit';
export const ssr = false;
import getDirectusInstance from '$lib/directus';
import { readItem } from '@directus/sdk';
// GraphQL query string
function getimage(backdropup: any, backdrop: object) {
	if (backdrop) {
		return 'https://mediathekc.b-cdn.net/t/p/original/' + backdrop;
	} else {
		return 'https://api.mediathek.community/assets/' + backdropup.filename_disk;
	}
}
function getformat(id: string) {
	switch (id) {
		case 'mpd':
			return 'application/dash+xml';
		case 'm3u8':
			return 'application/x-mpegURL';
		default:
			return 'application/dash+xml';
	}
}
function sortBySeasonAndEpisode(data) {
	const sortedData = {};

	data.slinks.forEach((item) => {
		const season = item.season;
		const episode = item.episode;

		if (!sortedData[season]) {
			sortedData[season] = [];
		}

		sortedData[season].push(item);
	});
	Object.keys(sortedData).forEach((season) => {
		sortedData[season].sort((a, b) => parseFloat(a.episode) - parseFloat(b.episode));
	});
	return sortedData;
}

function getsubformat(id: any[]) {
	let x = 0;
	let subs: {
		kind: string;
		src: string;
		srclang: string;
		label: string;
		default: boolean;
		spokenlang: boolean;
	}[] = [];
	if (id) {
		id.forEach((sub) => {
			subs.push({
				kind: 'captions',
				src: sub.sublink,
				srclang: sub.sublang,
				label: sub.sublang + ' ' + (sub.spokenlang ? '(Spoken)' : ''),
				spokenlang: sub.spokenlang,
				default: false
			});
			x++;
		});
		return subs;
	} else {
		return [];
	}
}

function getsublangs(id: any[]) {
	let x = 0;
	let subs: {
		srclang: string;
		label: string;
		spokenlang: boolean;
	}[] = [];
	if (id) {
		id.forEach((sub) => {
			subs.push({
				srclang: sub.sublang,
				label: sub.sublang + ' ' + (sub.spokenlang ? '(Spoken)' : ''),
				spokenlang: sub.spokenlang
			});
			x++;
		});
		return subs;
	} else {
		return [];
	}
}
// Function to fetch data from the GraphQL API
async function fetchMediathek(id: string) {
	const directus = getDirectusInstance(fetch);
	var result = await directus.request(
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
	//const result = await client.query(query, { id });
	//console.log(result);
	return result;
}
function generatePlaylist(slinks: any) {
	let playlist: any[] = [];
	if (slinks) {
		slinks.forEach((link: any) => {
			playlist.push({
				title: link.title,
				src: link.streamlink,
				thumb: getimage(link.backdropup, link.backdrop),
				type: getformat(link.streamformat),
				description: link.description,
				infoTitle: link.title,
				infoDescription: link.description,
				tracks: getsubformat(link.subtitles),
				episodes: link.episode,
				season: link.season
			});
		});
	}
	return playlist;
}
function videosrc(links: any, backdrop: string, backdropup: string) {
	let src1: { src?: string; type?: string; tracks?: any[]; poster?: string; skip?: number } = {};
	if (links.length > 0) {
		src1.src = links[0].streamlink;
		src1.type = getformat(links[0].streamformat);
		src1.tracks = getsubformat(links[0].subtitles);
		src1.poster = getimage(backdrop, backdropup);
		src1.skip = 0;
	}
	return src1;
}
function capitalizeFirstLetter(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
export async function load({ params, request }) {
	const mediathek = await fetchMediathek(params.id);
	const slinks = generatePlaylist(mediathek.slinks);
	const h1 = request.headers.get('cf-ipcountry') || 'De';
	const videosrc1 = videosrc(mediathek.links, mediathek.backdrop, mediathek.backdropup);
	const subl = mediathek.links.length > 0 ? getsublangs(mediathek.links[0].subtitles) : [];
	return {
		page: mediathek,
		groupseasons: sortBySeasonAndEpisode(mediathek),
		episodes: mediathek.episode,
		sublangs: subl,
		geo: capitalizeFirstLetter(h1),
		seasons: mediathek.season,
		playlist: slinks || [],
		videosource: videosrc1 || {}
	};
}
