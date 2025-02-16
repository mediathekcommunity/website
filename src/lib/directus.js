import { createDirectus, rest } from '@directus/sdk';
import { env } from '$env/dynamic/private';

const DIRECTUS_APIURL = 'https://api.mediathek.community';

function getDirectusInstance() {
  return createDirectus(DIRECTUS_APIURL).with(rest());
}

export default getDirectusInstance;
