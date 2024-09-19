// @ts-nocheck
/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';
import client from '$lib/directus.js';
function capitalizeFirstLetter(string: any) {
	return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
var query1 = `query 
	HeroNameAndFriends($id: String!) {
		Mediathek(id: $id){
 			title
			id
			tmdbid
			metascore
			type
			episodes {
				title
			}
			orgtitle
			onlineuntil
			poster
			backdrop
			quality
			streamformat
			streamlink
			channel {
				country
				name
				info
			}
		}
  }
`;
async function query(id1) {
	const result = await client.query(query1, { id: id1 });
	return result.data.Mediathek;
}
export async function load({ fetch, params }) {
 	var  x = await query(params.id);
 	try {
		return {
			page: x
		};
	} catch (err) {
		throw error(404, 'Page not founds');
	}
}
