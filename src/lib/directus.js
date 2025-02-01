import { createDirectus, rest } from '@directus/sdk';
const DIRECTUS_APIURL = import.meta.env.VITE_DIRECTUS_APIURL
 
 function getDirectusInstance(fetch) {
	const directus = createDirectus(DIRECTUS_APIURL).with(rest());
	return directus;
}
export default getDirectusInstance;
