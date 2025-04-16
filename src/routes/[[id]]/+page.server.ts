import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { addDays, differenceInDays, isBefore } from 'date-fns';
import type { MetaTagsProps } from 'svelte-meta-tags';

import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';
// Only import groupByChannelCountry, assuming it's correctly defined in utils
import { groupByChannelCountry } from '$lib/utils';
import type { MediathekItem } from '$lib/types/mediathek';

const directus = getDirectusInstance();

// Constants
const DEFAULT_COUNTRY_CODE = 'De';
const CDN_COUNTRY_HEADER = 'CDN-RequestCountryCode';
const CACHE_MAX_AGE_SECONDS = 5;
const EXPIRATION_THRESHOLD_DAYS = 7;

/**
 * Checks whether the supplied filter parameter is valid.
 * @param param - The parameter to validate.
 * @returns Boolean indicating if the parameter is valid.
 */
const isValidFilterParam = (param: string | undefined): boolean => {
	const allowedParams = ['movie', 'series', 'debug', 'music', 'youth', 'specials', 'culture'];
	return !param || allowedParams.includes(param);
};

/**
 * Capitalizes the first letter of a string and lowers the rest.
 * @param str - The string to process.
 * @returns Capitalized string.
 */
const capitalizeFirstLetter = (str: string): string =>
	str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ''; // Added check for empty string

/**
 * Filters and prepares items expiring within a specified number of days.
 * @param items - The list of mediathek items.
 * @param daysThreshold - The number of days within which items are considered expiring.
 * @returns A list of expiring items with remaining days calculated.
 */
const getExpiringItems = (
	items: MediathekItem[],
	daysThreshold: number
): (MediathekItem & { remainingDays: number | null })[] => {
	const now = new Date();
	const thresholdDate = addDays(now, daysThreshold);
	return items
		.filter((item) => item.onlineuntil && isBefore(new Date(item.onlineuntil), thresholdDate))
		.map((item) => ({
			...item,
			// Ensure onlineuntil exists before calculating difference
			remainingDays: item.onlineuntil ? differenceInDays(new Date(item.onlineuntil), now) : null
		}))
		.sort((a, b) => (a.remainingDays ?? Infinity) - (b.remainingDays ?? Infinity)); // Sort by remaining days ascending
};
const filterMap: Record<string, string> = {
	youth: "type='ymovie'||type='yseries'",
	movie: "type='movie'",
	series: "type='series'",
	music: "type='music'",
	culture: "type='culture'"
};
/**
 * Generates meta tags for the page.
 * @param filterId - The current filter ID (e.g., 'movie', 'series') or undefined for the home page.
 * @returns Meta tags object.
 */
const createPageMetaTags = (filterId?: string): MetaTagsProps => {
	// Now using the locally defined function
	const title = filterId ? capitalizeFirstLetter(filterId) : 'Home';
	const description = filterId
		? `Watch latest ${filterId}`
		: 'Watch the latest movies, series, music and more from public broadcast mediatheks.';
	return Object.freeze({ title, description });
};

// Server load function
export const load: PageServerLoad = async ({ params, request, setHeaders, locals }) => {
	const { id: filterId } = params as { id?: string };

	if (!isValidFilterParam(filterId)) {
		throw error(403, `Forbidden filter parameter: ${filterId}`);
	}

	const countryCode = request.headers.get(CDN_COUNTRY_HEADER) || DEFAULT_COUNTRY_CODE;
	// Now using the locally defined function
	const geo = capitalizeFirstLetter(countryCode);
	let allItems2;
	try {
		if (filterId) {
			let f = filterMap[filterId];
			allItems2 = await locals.pb.collection('movies').getFullList({
				filter: f,
				sort: '-created' // Sort by created date descending
			});
		} else {
			allItems2 = await locals.pb.collection('movies').getFullList({ sort: '-created' });
		}

		// Assuming groupByChannelCountry is correctly imported from utils
		const groupedData = groupByChannelCountry(allItems2);
		const expiringItems = getExpiringItems(allItems2, EXPIRATION_THRESHOLD_DAYS);
		const pageMetaTags = createPageMetaTags(filterId);
		setHeaders({
			'cache-control': `public, max-age=${CACHE_MAX_AGE_SECONDS}`
		});

		return {
			page: allItems2, // Consider renaming if `allItems` is more descriptive
			count: allItems2.length,
			geo,
			filter: filterId,
			groupbycountry: groupedData,
			countries: Object.keys(groupedData).sort(), // Sort countries for consistent order
			expiringItems,
			pageMetaTags,
			test: allItems2
			// No need to explicitly return `error: false` on success
		};
	} catch (err: any) {
		// Catch errors thrown from fetchMediathekItems or other synchronous code
		// Log the detailed error on the server
		console.error(`Error loading page for filter "${filterId}":`, err);

		// Throw SvelteKit error to be handled by hooks or error pages
		// Avoid exposing internal error details to the client unless necessary
		if (err.status && err.body) {
			throw error(err.status, err.body.message || 'An unexpected error occurred');
		} else {
			throw error(500, 'An unexpected server error occurred.');
		}
	}
};
