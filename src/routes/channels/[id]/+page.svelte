<script lang="ts">
	import { visible } from '$lib/store';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from '$lib/components/Card.svelte';
	import ErrorSection from '$lib/components/ErrorSection.svelte';
	import HeroSlider from '$lib/components/HeroSlider.svelte';
	import { onDestroy } from 'svelte';
	import type { PageData } from '$lib/types/channels';

	let { data } = $props<{ data: PageData }>();

	// Replace $: with $derived
	const heroItems = $derived(data?.page?.slice?.(0, 10) ?? []);
	const channelName = $derived(data?.page?.[0]?.channel?.name ?? '');

	// Optimized carousel options
	const options = {
		align: 'start',
		slidesToScroll: 2,
		loop: true,
		dragFree: true,
		watchDrag: true
	};

	// Flags for component configuration
	const showcountry = false;
	const countryflag = false;

	// Track embla instance for cleanup
	let emblaApi: any;
	
	onDestroy(() => {
		emblaApi?.destroy();
		emblaApi = null;
	});
</script>

<div>
	{#if data?.page?.length > 0}
		{#if heroItems.length > 0}
			<HeroSlider {heroItems} {data} {showcountry} />
		{/if}
		<section class="content-section">
			<div class="maincontent">
				<h1 class="section-title">
					<span class="title-text">
						Recently Added from {channelName}
					</span>
				</h1>
				<div 
					class="embla" 
					use:emblaCarouselSvelte={{ options }}
					oninit:once={({ detail }) => emblaApi = detail}
				>
					<div class="embla__container">
						{#each data.page as item (item.id)}
							<div class="embla__slide">
								<Card {item} {countryflag} geo={data.geo} />
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{:else}
		<ErrorSection filter={data?.page2?.name} text1="Channel" />
	{/if}
</div>

<style>
	.content-section {
		margin-top: -2rem;
		position: relative;
		z-index: 10;
		background: linear-gradient(to bottom, transparent, rgb(17, 17, 17) 15%);
		padding: 3rem 1rem 2rem;
		contain: content;
	}

	.maincontent {
		max-width: 1200px;
		margin: 0 auto;
		contain: layout style;
	}

	.section-title {
		text-align: center;
		margin-bottom: 2rem;
	}

	.title-text {
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: bold;
		background: linear-gradient(to right, #4a90e2, #63b3ed);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		padding: 0.5rem 1rem;
	}

	.embla {
		overflow: hidden;
		padding: 0 1rem;
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

	@media (max-width: 768px) {
		.content-section {
			margin-top: -1rem;
			padding: 2rem 0.5rem 1rem;
		}

		.section-title {
			margin-bottom: 1.5rem;
		}

		.embla {
			padding: 0 0.5rem;
		}

		.embla__container {
			gap: 0.5rem;
		}
	}
</style>
