import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { env } from '$env/dynamic/private';
const { DIRECTUS_APIURL } = env;
export default new Client({
	url: DIRECTUS_APIURL,
	exchanges: [cacheExchange, fetchExchange],
	requestPolicy: 'cache-and-network'
});
