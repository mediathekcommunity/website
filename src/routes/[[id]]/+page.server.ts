/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';
const directus = getDirectusInstance(fetch);
var x;

const groupByChannelCountry = (items) => {
	return items.reduce((acc, item) => {
		//console.log(item);
		const country = item.channel?.country || 'Unknown';
		acc[country] = acc[country] || [];
		acc[country].push(item);
		return acc;
	}, {});
};
function capitalizeFirstLetter(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function checkparamsok(params) {
	//console.log(params);
	if (
		!params ||
		params == 'movie' ||
		params == 'series' ||
		params == 'debug' ||
		params == 'music'
	) {
		return true;
	} else {
		return false;
	}
}
async function query(id1) {
	if (!id1) {
		// console.log('no id');
		x = await directus.request(
			readItems('mediathek ', {
				fields: ['*.*'],
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
	} else {
		x = await directus.request(
			readItems('mediathek', {
				filter: {
					type: id1
				},
				fields: ['*.*'],
				deep: {
					channel: {
						limit: 5
					},
					country: {
						limit: 99
					}
				}
			})
		);
	}
	var data = x;
	data.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
	return data;
}

export async function load({ fetch, params, request }) {
	if (!checkparamsok(params.id)) {
		throw error(403, 'forbidden params');
	} else {
		// console.log(params.id);
		const h1 = request.headers.get('cf-ipcountry') || 'De';
		const data1 = await query(params.id);
		//console.log(data1);

		if (!data1) {
			throw error(404, 'Page not found');
		}
		// console.log(data1);
		return {
			page: data1,
			error: false,
			count: data1.length,
			geo: capitalizeFirstLetter(h1),
			filter: params.id,
			groupbycountry: groupByChannelCountry(data1),
			countries: Object.keys(groupByChannelCountry(data1))
		};
	}
}
