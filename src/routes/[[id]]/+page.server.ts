/** @type {import('./$types').PageServerLoad} */
import { error } from '@sveltejs/kit';
import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';
import type { PageServerLoad } from './$types';

const directus = getDirectusInstance(fetch);

// Define types for better type safety
interface MediathekChannel {
    country?: string;
    name: string; // Add the name property
    id?: number; // Add the id property
}

interface MediathekItem {
    [key: string]: any; // Allow any property for flexibility
    channel?: MediathekChannel;
    date_created: string;
    type: string;
}

interface GroupedByCountry {
    [country: string]: MediathekItem[];
}

/**
 * Groups mediathek items by channel country.
 * @param items - An array of mediathek items.
 * @returns An object where keys are country names and values are arrays of mediathek items.
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
 * Capitalizes the first letter of a string and converts the rest to lowercase.
 * @param string - The string to capitalize.
 * @returns The capitalized string.
 */
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * Checks if the provided parameter is valid.
 * @param params - The parameter to check.
 * @returns True if the parameter is valid, false otherwise.
 */
function checkparamsok(params: string | undefined): boolean {
    const allowedParams = ['movie', 'series', 'debug', 'music'];
    return !params || allowedParams.includes(params);
}

/**
 * Queries the Directus API for mediathek items.
 * @param id - Optional filter ID.
 * @returns An array of mediathek items.
 */
async function query(id?: string): Promise<MediathekItem[]> {
    const baseOptions = {
        fields: ['*, channel.country, channel.name, channel.id'], // Modify the fields to include all channel properties
        deep: {
            channel: {
                limit: 5
            },
        }
    };
    const queryOptions = id
        ? { ...baseOptions, filter: { type: id } }
        : baseOptions;

    const data = await directus.request(
        readItems('mediathek', queryOptions)
    );
    // Correctly cast the data to MediathekItem[] and sort by date
    return (data as MediathekItem[]).sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
}

/**
 * SvelteKit load function for fetching mediathek data.
 */
export const load: PageServerLoad = async ({ fetch, params, request }) => {
    // Define the correct type for params here
    const { id } = params as { id?: string };
    if (!checkparamsok(id)) {
        throw error(403, 'forbidden params');
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
