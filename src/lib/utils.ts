export type MediathekItem = {
	id?: string;
	expand?: {
		channel?: {
			country?: string;
		};
	};
};

export type GroupedByCountry = {
	[country: string]: MediathekItem[];
};

/**
 * Groups mediathek items by channel country.
 * @param items - An array of mediathek items.
 * @returns Object where country names are keys and values are arrays of mediathek items.
 */
export const groupByChannelCountry = (items: MediathekItem[]): GroupedByCountry => {
	return items.reduce((acc: GroupedByCountry, item: MediathekItem) => {
		const country = item.expand?.channel?.country || 'Unknown';
		acc[country] = acc[country] || [];
		acc[country].push(item);
		return acc;
	}, {});
};

/**
 * Formats a date string
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString();
}
