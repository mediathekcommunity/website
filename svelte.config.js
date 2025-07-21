import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// Enable precompression for better performance
			precompress: true
		}),
		// Optimize service worker caching
		serviceWorker: {
			register: false
		},
		// Add cache headers for static assets
		paths: {
			assets: '',
			base: ''
		}
	}
};

export default config;
