/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';
import client from '$lib/directus.js';

const QUERY = `
query Mediatheks($channel: JSON) {
	Mediatheks(where: {channel : {equals: $channel } })
		{
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
			quality
			backdrop
			streamformat
			streamlink
			channel  {
				id
				country
				name
				info
			}
		}
	}
}

`;

async function query(id) {
	id = {
		channel: id
	};
	const result = await client.query(QUERY, id);
	console.log(result);
	return result.data.Mediatheks.docs;
}

export async function load({ fetch, params, request }) {
	const h1 = capitalizeFirstLetter(request.headers.get('cf-ipcountry') || 'De');
	const data1 = await query(params.id);

	if (!data1) {
		throw error(404, 'Page not found');
	}
	return {
		page: data1,
		geo: h1
	};
}

function capitalizeFirstLetter(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
