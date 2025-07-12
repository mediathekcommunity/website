import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			config: 'wrangler.jsonc',
			platformProxy: {
				config: 'wrangler.jsonc',
				environment: 'prod',
				experimentalJsonConfig: true,
				persist: true
			}
		})
	}
};

export default config;
