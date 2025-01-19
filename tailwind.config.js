import { join } from 'path';
import { skeleton } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';

/** @type {import('tailwindcss').Config} \*/
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton-svelte'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			colors: {
				orange : {
					100: '#fff3e0',
					200: '#ffe0b2',
					300: '#ffcc80',
					400: '#ffb74d',
					500: '#ffa726',
					600: '#ff9800',
					700: '#fb8c00',
					800: '#f57c00',
					900: '#ef6c00'
				}
			}
		}
	},
	plugins: [
		skeleton({
			themes: [themes.cerberus, themes.rose]
		})
	]
};
