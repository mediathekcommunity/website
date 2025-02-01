import { createDirectus, rest } from '@directus/sdk';
 
import { env } from '$env/dynamic/private';
console.log(env);
 const { DIRECTUS_APIURL } = env;
 function getDirectusInstance(fetch) {
	const directus = createDirectus(DIRECTUS_APIURL).with(rest());
	return directus;
}
export default getDirectusInstance;
