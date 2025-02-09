import { error } from '@sveltejs/kit';

import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';
const directus = getDirectusInstance(fetch);

export async function load({ params, fetch }) {
	const { id } = params;
	const res = await fetch(`https://123-u7ush.b-cdn.net/person/${id}`);

	if (!res.ok) {
		throw error(res.status, 'Failed to fetch cast information');
	}
	const groupByChannelCountry = (items: MediathekItem[]): GroupedByCountry => {
		return items.reduce((acc: GroupedByCountry, item: MediathekItem) => {
			const country = item.channel?.country || 'Unknown';
			acc[country] = acc[country] || [];
			acc[country].push(item);
			return acc;
		}, {});
	};
	const json = await res.json();

	const baseOptions = {
		fields: ['*.*.*, channel.country, channel.name, channel.id'],
		deep: {
			channel: { limit: 5 }
		},
		filter: {
			type: 'movie'
		}
	};
	let id2 = params.id;
	const mediathekData = await directus.request(readItems('mediathek', baseOptions));
	const filteredData = mediathekData.filter((item) => item.id === id2);
 	const data = groupByChannelCountry(filteredData);
	//
	// Transform the JSON to the shape expected by the page
	const person = {
		raw: json,
		grouped: data,
		name: json.name,
		birthday: json.birthday,
		place_of_birth: json.place_of_birth,
		bio: json.biography,
		heroImage: json.profile_path
			? `https://image.tmdb.org/t/p/w500${json.profile_path}`
			: '/default-hero.jpg'
		// You can map any other fields if needed...
	};

	// Since no media information is provided, mediaSorted is empty.
	const mediaSorted = {};

	return {
		data: {
			person,
			raw: json,
			mediaSorted: mediathekData,
			paramid: id2
		}
	};
}
