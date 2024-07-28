// @ts-nocheck
import { createDirectus, rest } from '@directus/sdk';
import { readItems, readItem } from '@directus/sdk';
import { DIRECTUS_APIURL } from '$env/static/private';

function getDirectusInstance(fetch) {
	const options = fetch ? { globals: { fetch } } : {};
	const directus = createDirectus(DIRECTUS_APIURL, options).with(rest());
	return directus;
}

export default getDirectusInstance;