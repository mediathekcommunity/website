import { error } from '@sveltejs/kit';
import client from '$lib/directus.js';

// GraphQL query string
const query = `
query Mediathek($id: String!){
    Mediathek(id: $id) {
      title
       orgtitle
	   tmdbid
	   poster
	   backdrop
	   description
	   duration 
	}
}

`;

// Function to fetch data from the GraphQL API
async function fetchMediathek(id: string) {
	const result = await client.query(query, { id });
	console.log(result);
	return result.data.Mediathek;
}
export async function load({ params }) {
	try {
		const mediathek = await fetchMediathek(params.id);
		return {
			page: mediathek
		};
	} catch (err) {
		throw error(404, 'Page not found');
	}
}
