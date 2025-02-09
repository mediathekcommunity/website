import { error } from '@sveltejs/kit';
    import getDirectusInstance from '$lib/directus';
    import { readItems } from '@directus/sdk';
    import type { Channel, PageData } from '$lib/types/channels'; // Import from the correct location

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
          readItems('channel', {
            fields: ['*.*'], // Specify the fields needed
          })
        );
        console.log('Fetched channel data:', response);
        return response;
      } catch (err) {
        console.error('Error fetching channel data:', err);
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
    export const load = async ({ fetch, params, request ,setHeaders}): Promise<PageData> => { // return type here
      const countryCode = request.headers.get('cf-ipcountry') || 'De';
      const geo = capitalizeFirstLetter(countryCode);
      setHeaders({
        'cache-control': 'max-age=3600'
      });
      const channels = await fetchChannelData(fetch);

      if (!channels || channels.length === 0) {
        throw error(404, 'Page not found');
      }

      return {
        channels,
        count: channels.length,
        geo,
        filter: params.id,
      };
    };
