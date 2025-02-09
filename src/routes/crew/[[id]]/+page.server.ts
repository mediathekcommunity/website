import { error } from '@sveltejs/kit';

import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';
const directus = getDirectusInstance(fetch);

export async function load({ params, fetch }) {
	const { id } = params;
	const res = await fetch(`https://tmdbomdbv1-gaoyk.bunny.run/person/${id}`);

	if (!res.ok) {
		var status = res.status;
		return { error: status };
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
	console.log(json);
	if (json.success == false) {
		return { error: json.status_code, message: json.status_message, success: json.success };
	}
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
	console.log(person);
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
