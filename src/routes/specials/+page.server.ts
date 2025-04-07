import { error } from '@sveltejs/kit';
import type { LoadEvent } from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';

// Define interfaces for better type safety
interface Special {
	name: string;
	// Add other properties of special if available
}

interface MediathekItem {
	id: string; // Assuming id is a string, adjust if necessary
	special?: Special;
	// Add other properties of mediathek items
	[key: string]: any; // Allow other properties if not fully defined
}

interface GroupedData {
	[key: string]: MediathekItem[];
}

interface PageData {
	page: MediathekItem[];
	count: number;
	geo: string;
	filterd: GroupedData; // Reverted name
	filterdkeys: string[]; // Reverted name
	filter: LoadEvent['params'];
}

// Re-added groupByChannelCountry function
const groupByChannelCountry = (items: MediathekItem[]): GroupedData => {
	return items.reduce((acc: GroupedData, item: MediathekItem) => {
		const country = item.special?.name || 'Unknown';
		acc[country] = acc[country] || [];
		acc[country].push(item);
		return acc;
	}, {});
};


/**
 * Fetches mediathek data filtered by items having a 'special' relation from Directus.
 *
 * @returns {Promise<MediathekItem[]>} A promise that resolves to the fetched mediathek data.
 * @throws {Error} Throws an error if the Directus request fails.
 */
// Reverted function name
async function fetchChannelData(): Promise<MediathekItem[]> {
	try {
		const directus = getDirectusInstance();
		// Type the response expected from the SDK for better clarity
		const response = await directus.request<MediathekItem[]>(
			readItems('mediathek', {
				filter: {
					special: {
						_nnull: true, // Filter for items where 'special' relation is not null
					},
				},
				fields: ['*.*', 'special.*'], // Fetch all fields from mediathek and the related special item
			})
		);
		// Ensure response is an array, SDK might return a single object if only one item matches
		return Array.isArray(response) ? response : [response];
	} catch (err) {
        console.error('Failed to fetch channel data:', err); // Log the actual error
		// Consider more specific error handling or re-throwing a custom error
		throw new Error('Failed to fetch channel data'); // Reverted error message
	}
}

// Re-added capitalizeFirstLetter function
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
 * SvelteKit load function to fetch and prepare data for the specials page.
 * Groups mediathek items by the name of their related 'special' item.
 *
 * @param {LoadEvent} event - The SvelteKit load event object.
 * @returns {Promise<PageData>} A promise that resolves to the page data.
 * @throws {import('@sveltejs/kit').HttpError} Throws a 404 error if no data is found.
 */
export const load = async ({ params, request, setHeaders }: LoadEvent): Promise<PageData> => {
	const countryCode = request.headers.get('cf-ipcountry') || 'De'; // Default to 'De' if header is missing
	const geo = capitalizeFirstLetter(countryCode); // Use local function

	// Set cache headers for better performance
	setHeaders({
		'cache-control': 'public, max-age=3600', // Cache for 1 hour
	});

	// Reverted variable name
	const channels = await fetchChannelData();

	if (!channels || channels.length === 0) {
		// Reverted error message to match original user request context better
		throw error(404, 'Page not found');
	}

    // Use the local groupByChannelCountry function
    const groupedData = groupByChannelCountry(channels);
    // Reverted variable name and usage of var
	var keys = Object.keys(groupedData);

	return {
		page: channels, // Reverted name
		count: channels.length, // Reverted name
		geo,
		filterd: groupedData, // Reverted name
		filterdkeys: keys,    // Reverted name
		filter: params, // Pass route parameters to the page
	};
};
