<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from './Card.svelte';
	import { derived } from 'svelte/store';
	interface LanguageData {
		[langCode: string]: any[];
	}

	interface Props {
		langlist: string[];
		langdata: LanguageData;
		geo: string;
	}

	let { langlist, langdata, geo } = $props();
	// Cache for region names
	const regionNamesCache = new Map<string, string>();
	const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

	// Optimize region name lookup with memoization
	const getRegionName = (lang: string): string => {
		const cached = regionNamesCache.get(lang);
		if (cached) return cached;

		const name = regionNames.of(lang.toUpperCase()) || 'Unknown Region';
		regionNamesCache.set(lang, name);
		return name;
	};

	// Optimized sorting with memoization for region names
	const sortedLanglist = $derived(
		langlist?.sort((a: string, b: string) => {
			if (a === geo) return -1;
			if (b === geo) return 1;
			return getRegionName(a).localeCompare(getRegionName(b));
		}) ?? []
	);

	// Optimized carousel options for performance
	const carouselOptions = {
		options: {
			align: 'start',
			slidesToScroll: 2,
			dragFree: true,
			containScroll: 'trimSnaps',
			watchDrag: true
		}
	};

	// Automatic cleanup
	let emblaApi: any;
	onDestroy(() => {
		emblaApi = null;
	});
</script>

{#each sortedLanglist as country}
	{#if langdata[country]?.length > 0}
		<section class="country-section">
			<h2 class="country-title">
				<span class="fi fi-{country.toLowerCase()}" aria-hidden="true"></span>
				<span>{getRegionName(country)}</span>
			</h2>

			<div class="embla" use:emblaCarouselSvelte={carouselOptions} bind:this={emblaApi}>
				<div class="embla__container">
					{#each langdata[country] as item (item.id)}
						<div class="embla__slide">
							<Card carddata={item} countryflag={false} />
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}
{/each}

<style>
	.country-section {
		margin: 2rem 0;
		contain: content;
	}

	.country-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: clamp(1.25rem, 2vw, 1.5rem);
		margin-bottom: 1rem;
		padding: 0 1rem;
	}

	.embla {
		overflow: hidden;
		padding: 0 1rem;
		contain: paint layout;
	}

	.embla__container {
		display: flex;
		gap: 1rem;
		touch-action: pan-y;
		transform: translateZ(0);
		will-change: transform;
	}

	.embla__slide {
		flex: 0 0 auto;
		min-width: 0;
		position: relative;
	}

	@media (max-width: 640px) {
		.country-section {
			margin: 1rem 0;
		}

		.embla {
			padding: 0 0.5rem;
		}

		.embla__container {
			gap: 0.5rem;
		}
	}
</style>
