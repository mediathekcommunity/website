<script>
	// @ts-nocheck
	import { visible } from '$lib/store';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from './Card.svelte';

	/**
	 * Gets the region name in English for a given language code.
	 * @param {string} lang - The language code (e.g., 'US', 'CA').
	 * @returns {string} The region name in English.
	 */
	function getRegionName(lang) {
		const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
		return regionNames.of(lang.toUpperCase());
	}

	/**
	 * Sorts a list of countries, placing the user's geo country first.
	 * @param {string[]} countries - The array of country codes.
	 * @param {string} userGeo - The user's geographic location code.
	 * @returns {string[]} The sorted array of country codes.
	 */
	function sortCountries(countries, userGeo) {
		return [...countries].sort((a, b) => {
			if (a === userGeo) return -1;
			if (b === userGeo) return 1;
			return a.localeCompare(b);
		});
	}

	/**
	 * @type {string[]}
	 */
	export let langlist = [];
	/**
	 * @type {Record<string, any[]>}
	 */
	export let langdata = {};
	/**
	 * @type {string}
	 */
	export let geo = 'Unknown';

	const emblaOptions = {
		align: 'start',
		slidesToScroll: 2,
		loop: true,
		dragFree: true,
		containScroll: 'trimSnaps'
	};

	$: sortedLanglist = sortCountries(langlist, geo);
</script>

{#each sortedLanglist as lang}
	<div>
		<h1 class="section-title">
			<span
				class="bg-linear-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
			>
				{#if lang !== 'Unknown'}
					<span class="fi fi-{lang.toLowerCase()}"></span>
				{/if}
				{getRegionName(lang)}
				{lang === geo ? '(Your Location)' : ''}
			</span>
		</h1>
		<div class="embla" use:emblaCarouselSvelte={emblaOptions}>
			<div class="embla__container">
				{#each langdata[lang] || [] as item}
					<div class="embla__slide">
						<Card carddata={item} {visible} {geo} />
					</div>
				{/each}
			</div>
		</div>
	</div>
{/each}

<style>
	.section-title {
		font-size: clamp(1.25rem, 2vw, 1.5rem);
		font-weight: bold;
		margin-bottom: 1rem;
		text-align: center;
	}

	.embla {
		overflow: hidden;
		margin: 0;
	}

	.embla__container {
		display: flex;
		gap: 1rem;
	}

	.embla__slide {
		flex: 0 0 auto;
		min-width: 0;
		padding: 0;
	}

	@media (max-width: 640px) {
		.section-title {
			padding: 1.25rem 1.25rem 0.625rem 1.25rem;
		}
	}

	@media (min-width: 641px) and (max-width: 1024px) {
		.section-title {
			padding: 0 1rem 0.5rem 1rem;
		}
	}

	@media (min-width: 1025px) {
		.section-title {
			padding: 1.25rem 1.25rem 0.625rem 1.25rem;
		}
	}
</style>
