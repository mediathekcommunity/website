import { createDirectus, rest } from '@directus/sdk';
  
 function getDirectusInstance(fetch) {
	const directus = createDirectus("https://api.mediathek.community").with(rest());
	return directus;
}
export default getDirectusInstance;
