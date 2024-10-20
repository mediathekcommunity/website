import { error } from '@sveltejs/kit';
import client from '$lib/directus.js';

// GraphQL query string
const query = `
query Mediathek($id: String!){
    Mediathek(id: $id) {
      id
      title
      tmdbid
      metascore
	  description
	  season
	  episode
      type
      slinks {
 	    title
		backdrop
		description
		duration
		season
		episode
		streamlink
		streamformat
		subtitles {
	  			language
				url
				label
			}
      }
		links {
		streamlink
		streamformat
		subtitles {
	  			language
				url
				label
			}
      }
		channel {
			name
			country
		}
      orgtitle
      onlineuntil
      poster
      backdrop

	}
}

`;
function getformat(id) {
	switch (id) {
		case 'mpd':
			return 'application/dash+xml';
		case 'm3u8':
			return 'application/x-mpegURL';
		default:
			return 'application/dash+xml';
	}
}
function getsubformat(id) {
	let x = 0;
	let subs = [];
	if (id) {
		id.forEach((sub) => {
			subs.push({
				kind: 'captions',
				src: sub.url,
				srclang: sub.language,
				label: sub.label,
				default: x === 0 ? true : false
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
	const result = await client.query(query, { id });
	//console.log(result);
	return result.data.Mediathek;
}
function generatePlaylist(slinks: any) {
	let playlist: any[] = [];
	if (slinks) {
		slinks.forEach((link: any) => {
			playlist.push({
				title: link.title,
				src: link.streamlink,
				thumb: 'https://img.mediathek.rocks/t/p/original/' + link.backdrop,
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
function videosrc(links: any,backdrop: string) {
	let src1 = {};
	if (links.length > 0) {
		src1.src = links[0].streamlink;
		src1.type = getformat(links[0].streamformat);
		src1.tracks = getsubformat(links[0].subtitles);
		src1.poster = 'https://img.mediathek.rocks/t/p/original' + backdrop;
	}
	return src1;
}

export async function load({ params }) {
	try {
		const mediathek = await fetchMediathek(params.id);
		const slinks = generatePlaylist(mediathek.slinks);
		const videosrc1 = videosrc(mediathek.links,mediathek.backdrop);
		return {
			page: mediathek,
			playlist: slinks || [],
			videosource: videosrc1 || {}
		};
	} catch (err) {
		throw error(404, 'Page not found');
	}
}
