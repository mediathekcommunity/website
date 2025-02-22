import { error } from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';

const groupByChannelCountry = (items: MediathekItem[]): GroupedByCountry => {
	return items.reduce((acc: GroupedByCountry, item: MediathekItem) => {
		const country = item.special?.name || 'Unknown';
		acc[country] = acc[country] || [];
		acc[country].push(item);
		return acc;
	}, {});
};

/**
 * Fetches channel data from Directus.
 *
 * @param {typeof fetch} fetcher - The fetch function to use for making requests.
 * @returns {Promise<Channel[]>} A promise that resolves to the fetched channel data.
 * @throws {Error} Throws an error if the Directus request fails.
 */
async function fetchChannelData(fetcher: typeof fetch): Promise<Channel[]> {
	try {
		const directus = getDirectusInstance(fetcher);
		const response = await directus.request(
			readItems('mediathek', {
				filter: {
					special: {
						_nnull: true
					}
				}, // Filter for channels
				fields: ['*.*','special.*'] // Specify the fields needed
			})
		);
		return response;
	} catch (err) {
    console.error(err);
		throw new Error('Failed to fetch channel data');
	}
}

/**
 * Capitalizes the first letter of a string and lowercases the rest.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * SvelteKit load function to fetch and prepare data for the page.
 *
 * @param {{ fetch: typeof fetch, params: { id?: string }, request: Request }} options - The SvelteKit load options.
 * @returns {Promise<PageData>} A promise that resolves to the page data.
 * @throws {import('@sveltejs/kit').HttpError} Throws a 404 error if no channel data is found.
 */
export const load = async ({ fetch, params, request, setHeaders }): Promise<PageData> => {
	// return type here
	const countryCode = request.headers.get('cf-ipcountry') || 'De';
	const geo = capitalizeFirstLetter(countryCode);
	setHeaders({
		'cache-control': 'max-age=3600'
	});
	const channels = await fetchChannelData(fetch);

	if (!channels || channels.length === 0) {
		throw error(404, 'Page not found');
	}
	const groupedData = groupByChannelCountry(channels);
  var keys = Object.keys(groupedData);

	return {
		page: channels,
		count: channels.length,
		geo,
    filterd:groupedData,
    filterdkeys: keys,
		filter: params.id
	};
};
