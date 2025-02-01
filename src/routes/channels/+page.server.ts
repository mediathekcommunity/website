/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';

import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk'; 

async function query() {
	const directus = getDirectusInstance(fetch);
	var result =await directus.request(
		readItems('channels', { 
			fields: ['*.*'], 
		})
	);
	console.log(result)
 	return result;
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
