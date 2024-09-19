import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { DIRECTUS_APIURL } from '$env/static/private';

export default new Client({
	url: DIRECTUS_APIURL,
	exchanges: [cacheExchange, fetchExchange],
  requestPolicy: 'cache-and-network',
});
