import { error, type ServerLoad } from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
import { readItems, readItem, type Directus, type Item } from '@directus/sdk';

/**
 * Fetches data from Directus, handling common logic.
 *
 * @param {typeof fetch} fetcher - The fetch function.
 * @param {(directus: Directus<any>) => Promise<any>} dataFetcher - Function to fetch data from Directus.
 * @param {string} errorMessage - Error message for failed fetch.
 * @param {string} [channelId] - Optional channel ID for logging.
 * @returns {Promise<any>} Data fetched from Directus.
 * @throws {Error} If fetching fails.
 */
async function fetchDataFromDirectus(
	fetcher: typeof fetch,
	dataFetcher: (directus: Directus<any>) => Promise<any>,
	errorMessage: string,
	channelId?: string
): Promise<any> {
	const directus = getDirectusInstance(fetcher) as Directus<{ channel: Item; mediathek: Item }>;
	try {
		const result = await dataFetcher(directus);
		if (channelId !== undefined) {
		} else {
		}
		return result;
	} catch (err) {
		throw new Error(`${errorMessage} ${channelId ? `for channel ${channelId}` : ''}`);
	}
}

/**
 * Fetches media items related to a specific channel ID from Directus.
 *
 * @param {string} channelId - The ID of the channel.
 * @param {typeof fetch} fetcher - The fetch function.
 * @returns {Promise<any>} Media items.
 * @throws {Error} If fetching fails.
 */
async function fetchMediaByChannel(channelId: string, fetcher: typeof fetch): Promise<any> {
	return fetchDataFromDirectus(
		fetcher,
		async (directus) =>
			directus.request(
				readItems('mediathek', {
					fields: ['*.*'],
					filter: {
						channel: {
							id: {
								_in: channelId
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
			),
		'Error fetching media',
		channelId
	);
}

/**
 * Fetches channel details from Directus by channel ID.
 *
 * @param {string} channelId - The ID of the channel.
 * @param {typeof fetch} fetcher - The fetch function.
 * @returns {Promise<any>} Channel details.
 * @throws {Error} If fetching fails.
 */
async function fetchChannelDetails(channelId: string, fetcher: typeof fetch): Promise<any> {
	return fetchDataFromDirectus(
		fetcher,
		async (directus) =>
			directus.request(
				readItem('channel', channelId, {
					fields: ['*.*']
				})
			),
		'Error fetching channel details',
		channelId
	);
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} Capitalized string.
 */
function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * SvelteKit load function for the page.
 *
 * @param {object} context - SvelteKit context.
 * @param {typeof fetch} context.fetch - Fetch function.
 * @param {object} context.params - Route parameters.
 * @param {string} context.params.id - Channel ID.
 * @param {Request} context.request - Request object.
 * @returns {Promise<{ page: any; geo: string; id: string; page2: any }>} Page data.
 * @throws {import('@sveltejs/kit').HttpError} If fetching fails.
 */
export const load: ServerLoad = async ({ fetch, params, request, setHeaders }) => {
	const channelId = params.id;
	if (!channelId) {
		throw error(400, 'Channel ID is required');
	}
	const geo = capitalizeFirstLetter(request.headers.get('cf-ipcountry') || 'De');
	setHeaders({
		'cache-control': 'max-age=5'
	});
	try {
		const mediaData = await fetchMediaByChannel(channelId, fetch);
		const channelDetails = await fetchChannelDetails(channelId, fetch);
		return {
			page: mediaData,
			geo: geo,
			id: params.id,
			page2: channelDetails
		};
	} catch (err) {
		throw error(404, 'Page not found');
	}
};
