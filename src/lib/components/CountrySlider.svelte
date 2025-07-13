<script lang="ts">
	import { onDestroy } from 'svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import MediaCarouselCard from './MediaCarouselCard.svelte'; // Changed from MediaItemCard
	import { getCountryName } from '$lib/utils/countryNames';

	interface LanguageData {
		[langCode: string]: any[];
	}

	interface Props {
		langlist: string[];
		langdata: LanguageData;
	}

	let { langlist, langdata }: Props = $props();

	const carouselOptions = {
		options: {
			align: 'start' as const,
			slidesToScroll: 1,
			dragFree: true,
			containScroll: 'trimSnaps' as const, // Added type assertion
			watchDrag: true
		},
		plugins: []
	};

	let emblaApi: HTMLDivElement | null = $state(null); // Explicitly define the type to allow null assignment
	onDestroy(() => {
		emblaApi = null;
	});
</script>

{#each langlist as country}
	{#if langdata[country]?.length > 0}
		<section class="country-section">
			<h2 class="country-title">
				<span>{getCountryName(country)}</span>
			</h2>

			<div class="embla" use:emblaCarouselSvelte={carouselOptions} bind:this={emblaApi}>
				<div class="embla__container">
					{#each langdata[country] as item (item.id)}
						<div class="embla__slide">
							<MediaCarouselCard mediaItem={item} />
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
