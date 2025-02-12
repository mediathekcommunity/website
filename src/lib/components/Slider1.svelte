<script lang="ts">
	import { visible } from '$lib/store';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from './Card.svelte';
	import type { EmblaOptionsType } from 'embla-carousel';

	/**
	 * Type definition for the language data structure.
	 * It's a record where keys are language codes (strings) and values are arrays of any type.
	 */
	export interface LanguageData {
		[langCode: string]: any[];
	}

	/**
	 * Gets the region name in English for a given language code.
	 * @param lang - The language code (e.g., 'US', 'CA').
	 * @returns The region name in English.
	 */
	function getRegionName(lang: string): string {
		const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
		return regionNames.of(lang.toUpperCase()) || 'Unknown Region'; // Add a fallback for robustness
	}

	/**
	 * Sorts a list of countries, placing the user's geo country first.
	 * @param countries - The array of country codes.
	 * @param userGeo - The user's geographic location code.
	 * @returns The sorted array of country codes.
	 */
	function sortCountries(countries: string[], userGeo: string): string[] {
		return [...countries].sort((a, b) => {
			if (a === userGeo) return -1;
			if (b === userGeo) return 1;
			return a.localeCompare(b);
		});
	}

	/**
	 * List of language/region codes to display.
	 * @type {string[]}
	 */
	export let langlist: string[] = [];

	/**
	 * Data for each language/region, keyed by language/region code.
	 * @type {LanguageData}
	 */
	export let langdata: LanguageData = {};

	/**
	 * User's geographic location code. Defaults to 'Unknown'.
	 * @type {string}
	 */
	export let geo: string = 'Unknown';

	/**
	 * Options for the Embla Carousel.
	 */
	const emblaOptions: EmblaOptionsType = {
		align: 'start',
		slidesToScroll: 2,
		loop: true,
		dragFree: true,
		containScroll: 'trimSnaps'
	};

	/**
	 * Reactive declaration to sort the language list whenever langlist or geo changes.
	 */
	$: sortedLanglist = sortCountries(langlist, geo);
</script>

{#each sortedLanglist as lang (lang)}
	<div class="lang-container">
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
				{#each langdata[lang] || [] as item (item)}
					<div class="embla__slide">
						<Card carddata={item} visible={$visible} geo={geo} />
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

	/* Add padding-bottom to the last slide of the last language container */
	.lang-container:last-child {
        padding-bottom: 1rem;
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
