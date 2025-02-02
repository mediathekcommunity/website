import { error } from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';
import type { PageServerLoad } from './$types';

const directus = getDirectusInstance(fetch);

interface MediathekChannel {
	country?: string;
	name: string;
	id?: number;
}

interface MediathekItem {
	channel?: MediathekChannel;
	date_created: string;
	type: string;
	[key: string]: any;
}

interface GroupedByCountry {
	[country: string]: MediathekItem[];
}

/**
 * Groups mediathek items by channel country.
 * @param items - An array of mediathek items.
 * @returns Object where country names are keys and values are arrays of mediathek items.
 */
const groupByChannelCountry = (items: MediathekItem[]): GroupedByCountry => {
	return items.reduce((acc: GroupedByCountry, item: MediathekItem) => {
		const country = item.channel?.country || 'Unknown';
		acc[country] = acc[country] || [];
		acc[country].push(item);
		return acc;
	}, {});
};

/**
 * Capitalizes the first letter of a string and lowers the rest.
 * @param str - The string to process.
 * @returns Capitalized string.
 */
const capitalizeFirstLetter = (str: string): string =>
	str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * Checks whether supplied params are valid.
 * @param params - The parameter to validate.
 * @returns Boolean indicating if params are valid.
 */
const checkparamsok = (params: string | undefined): boolean => {
	const allowedParams = ['movie', 'series', 'debug', 'music'];
	return !params || allowedParams.includes(params);
};

/**
 * Queries the Directus API for mediathek items.
 * @param id - Optional filter ID.
 * @returns A list of mediathek items, sorted by creation date.
 */
const query = async (id?: string): Promise<MediathekItem[]> => {
	const baseOptions = {
		fields: ['*, channel.country, channel.name, channel.id'],
		deep: { channel: { limit: 5 } }
	};
	const queryOptions = id ? { ...baseOptions, filter: { type: id } } : baseOptions;

	const data = await directus.request(readItems('mediathek', queryOptions));
	return (data as MediathekItem[]).sort(
		(a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
	);
};

/**
 * Server load function for fetching mediathek data.
 * @param fetch - The fetch function.
 * @param params - Route parameters.
 * @param request - The HTTP request.
 * @returns Formatted response data.
 */
export const load: PageServerLoad = async ({ fetch, params, request }) => {
	const { id } = params as { id?: string };

	if (!checkparamsok(id)) {
		throw error(403, 'Forbidden params');
	}

	const geo = capitalizeFirstLetter(request.headers.get('cf-ipcountry') || 'De');
	const data = await query(id);

	if (!data) {
		throw error(404, 'Page not found');
	}

	const groupedData = groupByChannelCountry(data);

	return {
		page: data,
		error: false,
		count: data.length,
		geo,
		filter: id,
		groupbycountry: groupedData,
		countries: Object.keys(groupedData)
	};
};