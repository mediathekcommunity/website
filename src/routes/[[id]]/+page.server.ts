/** @type {import('./$types').PageLoad} */
// @ts-nocheck

import { error } from '@sveltejs/kit';
import client from '$lib/directus.js';

function capitalizeFirstLetter(string: any) {
	return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

const QUERY = `
{
    Mediatheks {
        docs {
            title
            id
            tmdbid
            metascore
            episodes {
                title
            }
            orgtitle
            onlineuntil
            poster
            backdrop
            streamformat
            streamlink
            channel {
                country
                name
                info
            }
        }
    }
}
`;
const QUERY2 = `
query Mediathekfilter($type: Mediathek_type_Input) {
	Mediatheks(where: { type: { equals: $type } }) {
		docs {
			title
			id
			tmdbid
			metascore
			episodes {
				title
			}
			orgtitle
			onlineuntil
			poster
			quality
			backdrop
			streamformat
			streamlink
			channel {
				country
				name
				info
			}
		}
	}
}

`;
async function query(id1) {
	const result = id1 ? await client.query(QUERY2, { type: id1 }) :await client.query(QUERY) ;
	return result.data.Mediatheks.docs;
}

export async function load({ fetch, params, request }) {
	let h1;
	let data1;

	h1 = request.headers.get('Cdn-RequestCountryCode')
		? capitalizeFirstLetter(request.headers.get('Cdn-RequestCountryCode'))
		: 'De';
	h1 = capitalizeFirstLetter(h1);
	data1 = await query(params.id);

	try {
		return {
			page: data1,
			count: data1.length,
			geo: h1,
			filter: params.id
		};
	} catch (err) {
		throw error(404, 'Page not founds');
	}
}
