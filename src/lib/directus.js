import { createDirectus, rest } from '@directus/sdk';

const DIRECTUS_APIURL = 'https://api.mediathek.community';

function getDirectusInstance() {
  return createDirectus(DIRECTUS_APIURL).with(rest());
}

export default getDirectusInstance;
