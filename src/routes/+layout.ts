import type { MetaTagsProps } from 'svelte-meta-tags';

export const load = ({ url }) => {
	const baseMetaTags = Object.freeze({
		title: 'Default',
		titleTemplate: '%s | Mediathek Community',
		description:
			'Mediathek Community is a site that colects public DRM free video links from EU Public Broadcast sites.',
		canonical: new URL(url.pathname, url.origin).href,
		openGraph: {
			type: 'website',
			url: new URL(url.pathname, url.origin).href,
			locale: 'en_IE',
			title: 'Mediathek Community',
			description:
				'Mediathek Community is a site that colects public DRM free video links from EU Public Broadcast sites.',
			siteName: 'SiteName'
		}
	}) satisfies MetaTagsProps;

	return {
		baseMetaTags
	};
};
