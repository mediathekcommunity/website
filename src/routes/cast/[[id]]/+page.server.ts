import { error } from '@sveltejs/kit';

import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';
import { groupByChannelCountry } from '$lib/utils';

const directus = getDirectusInstance();

type MediathekItem = {
	id: string;
	channel?: {
		country?: string;
		name?: string;
		id?: string;
	};
};

export async function load({ params, fetch, setHeaders, locals }) {
	const { id } = params;
	const res = await fetch(`https://tmdbomdbv1-gaoyk.bunny.run/person/${id}`);
	if (!res.ok) {
		throw error(res.status, 'Failed to fetch cast information');
	}

	const json = await res.json();
	if (json.success === false) {
		return { error: json.status_code, message: json.status_message, success: json.success };
	}

	const baseOptions = {
		fields: ['*.*.*, channel.country, channel.name, channel.id'],
		deep: {
			channel: { limit: 5 }
		}
	};
	let id2 = params.id;
	const allItems = await locals.pb.collection('mediathek').getFullList({ expand: 'channel' });

	const mediathekData = await directus.request<MediathekItem[]>(
		readItems('mediathek', baseOptions)
	);
	const filteredData = allItems.filter((item) => item.id === id2);
	const data = groupByChannelCountry(allItems);
	console.log(data);

	const person = {
		raw: json,
		grouped: data,
		birthday: json.birthday,
		place_of_birth: json.place_of_birth,
		name: json.name,
		bio: json.biography,
		heroImage: json.profile_path
			? `https://image.tmdb.org/t/p/w500${json.profile_path}`
			: '/default-hero.jpg'
	};

	setHeaders({
		'cache-control': 'max-age=3600'
	});

	return {
		data: {
			person,
			raw: json,
			mediaSorted: mediathekData,
			mediaSorted2: allItems,
			paramid: id2
		}
	};
}
