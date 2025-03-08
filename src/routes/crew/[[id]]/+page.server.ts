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
	// Add other relevant fields based on your data structure
};

type GroupedByCountry = {
	[country: string]: MediathekItem[];
};

export async function load({ params, fetch, setHeaders }) {
	const { id } = params;
	const res = await fetch(`https://tmdbomdbv1-gaoyk.bunny.run/person/${id}`);

	if (!res.ok) {
		throw error(res.status, 'Failed to fetch crew information');
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
	const mediathekData = await directus.request<MediathekItem[]>(
		readItems('mediathek', baseOptions)
	);
	const filteredData = mediathekData.filter((item) => item.id === id2);
	const data = groupByChannelCountry(filteredData);

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
	};

	setHeaders({
		'cache-control': 'max-age=3600'
	});

	return {
		data: {
			person,
			raw: json,
			mediaSorted: mediathekData,
			paramid: id2
		}
	};
}
