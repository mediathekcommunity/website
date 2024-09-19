/** @type {import('./$types').PageLoad} */
// @ts-nocheck

import { error } from '@sveltejs/kit';
import client from '$lib/directus.js';
function capitalizeFirstLetter(string: any) {
	return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
//import getDirectusInstance from '$lib/directus';
var x;
const QUERY = `
# Write your query or mutation here
{
	Mediatheks {
		docs {
			title
			id
			tmdbid
			metascore
			episodes {
				title
			}
			orgtitle
			onlineuntil
			poster
			backdrop
			streamformat
			streamlink
			channel {
				country
				name
				info
			}
		}
	}
}
`;
async function query() {
	const result = await client.query(QUERY);
	console.log(result);
	return result.data.Mediatheks.docs;
}
export async function load({ fetch, params, request }) {
	let h1;
	let data1;
	h1 = request.headers.get('Cdn-RequestCountryCode')
		? capitalizeFirstLetter(request.headers.get('Cdn-RequestCountryCode'))
		: 'De';
	h1 = capitalizeFirstLetter(h1);
	//const directus = getDirectusInstance(fetch);
	if (!params.id) {
		data1 = await query();
	} else {
		data1 = await query();
	}

	try {
		return {
			page: data1,
			count: data1.length,
			geo: h1,
			filter: params.id
		};
	} catch (err) {
		throw error(404, 'Page not founds');
	}
}
