// @ts-nocheck
/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
import { readItem } from '@directus/sdk';
export async function load({ fetch, params }) {
	const directus = getDirectusInstance(fetch);
	var x = await directus.request(
		readItem('videos', params.id, {
			fields: ['*.*'],
			limit: 4,
			deep: {
				channel: {
					limit: 5
				},
				episodelist: {
					limit: 5
				}
			}
		})
	);
	try {
		return {
			page: x
		};
	} catch (err) {
		throw error(404, 'Page not founds');
	}
}
