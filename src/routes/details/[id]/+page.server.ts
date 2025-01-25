import { error } from '@sveltejs/kit';
export const ssr = false;
import getDirectusInstance from '$lib/directus';
import { readItem } from '@directus/sdk';
// GraphQL query string
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
const groupBySeason = (items) => {
	return items.reduce((acc, item) => {
		//console.log(item);
		const season = item.season || 'Unknown';
		acc[season] = acc[season] || [];
		acc[season].push(item); /**/
		return acc;
	}, {});
};

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
				thumb: 'https://img.mediathek.community/t/p/original/' + link.backdrop,
				type: getformat(link.streamformat),
				description: link.description,
				infoTitle: link.title,
				infoDescription: link.description,
				tracks: getsubformat(link.subtitles)
			});
		});
	}
	return playlist;
}
function videosrc(links: any, backdrop: string) {
	let src1: { src?: string; type?: string; tracks?: any[]; poster?: string; skip?: number } = {};
	if (links.length > 0) {
		src1.src = links[0].streamlink;
		src1.type = getformat(links[0].streamformat);
		src1.tracks = getsubformat(links[0].subtitles);
		src1.poster = 'https://img.mediathek.community/t/p/original' + backdrop;
		src1.skip = 0;
	}
	return src1;
}

export async function load({ params }) {
	const mediathek = await fetchMediathek(params.id);
	const slinks = generatePlaylist(mediathek.slinks);
	const videosrc1 = videosrc(mediathek.links, mediathek.backdrop);
	return {
		page: mediathek,
		groupseasons: groupBySeason(mediathek.slinks),
		episodes: mediathek.episode,
		seasons: mediathek.season,
		playlist: slinks || [],
		videosource: videosrc1 || {}
	};
}
