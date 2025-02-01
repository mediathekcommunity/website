/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
import { readItems, readItem } from '@directus/sdk';

async function query(id: number): Promise<any> {
	const directus = getDirectusInstance(fetch);
	var result = await directus.request(
		readItems('mediathek', {
			fields: ['*.*'],
			filter: {
				channel: {
					id: {
						_in: id
					}
				}
			},
			deep: {
				channel: {
					limit: 5
				},
				country: {
					limit: 5
				}
			}
		})
	);
	//const result = await client.query(query, { id });
	console.log(result);
	return result;
}
async function query2(id: number) {
	const directus = getDirectusInstance(fetch);
	var result = await directus.request(
		readItem('channels', id, {
			fields: ['*.*']
		})
	);
	console.log(result);
	return result;
}

export async function load({ fetch, params, request }) {
	const h1 = capitalizeFirstLetter(request.headers.get('cf-ipcountry') || 'De');
	const data1 = await query(Number(params.id));
	const data2 = await query2(Number(params.id));
	if (!data1) {
		throw error(404, 'Page not found');
	}
	return {
		page: data1,
		geo: h1,
		id: params.id,
		page2: data2
	};
}

function capitalizeFirstLetter(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
