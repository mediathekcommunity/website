/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';
import client from '$lib/directus.js';

const QUERY = `
{
	Channels (sort: "country") {
		docs {
			info
			name
			country
			id
		}
	}
}
`;

async function query() {
	const result = await client.query(QUERY);
	return result.data.Channels.docs;
}

export async function load({ fetch, params, request }) {
	const h1 = capitalizeFirstLetter(request.headers.get('cf-ipcountry') || 'De');
	const data1 = await query();
	if (!data1) {
		throw error(404, 'Page not found');
	}
	return {
		page: data1,
		count: data1.length,
		geo: h1,
		filter: params.id
	};
}

function capitalizeFirstLetter(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
