/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';
import client from '$lib/directus.js';

const QUERY = `
{
	Mediatheks {
		docs {
			title
			id
			tmdbid
			metascore
			orgtitle
 			poster
 			backdrop
			type
			channel {
				id
				name
				country
			}
		}
	}
}
`;

const QUERY2 = `
query Mediathekfilter($type: Mediathek_type_Input) {
	Mediatheks(where: { type: { equals: $type } }) {
		docs {
			title
			id
			tmdbid
			metascore
			orgtitle
 			poster
			backdrop
			type
			channel {
				id
				name
				country
			}
		}
	}
}`;
const groupByChannelCountry = (items) => {
	return items.reduce((acc, item) => {
		const country = item.channel?.country || 'Unknown';
		acc[country] = acc[country] || [];
		acc[country].push(item);
		return acc;
	}, {});
};
function capitalizeFirstLetter(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
async function query(id1) {
	const result = id1 ? await client.query(QUERY2, { type: id1 }) : await client.query(QUERY);
	// console.log(result);
	return result.data.Mediatheks.docs;
}

export async function load({ fetch, params, request }) {
	const h1 = request.headers.get('Cdn-Requestcountrycode') || 'Se';
	const data1 = await query(params.id);
	// console.log(data1);

	if (!data1) {
		throw error(404, 'Page not found');
	}
	return {
		page: data1,
		count: data1.length,
		geo: capitalizeFirstLetter(h1),
		filter: params.id,
		groupbycountry: groupByChannelCountry(data1),
		countries: Object.keys(groupByChannelCountry(data1))
	};
}
