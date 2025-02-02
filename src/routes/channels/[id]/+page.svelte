<script>
	// @ts-nocheck
	import { visible } from '$lib/store';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from '$lib/components/Card.svelte';
	import ErrorSection from '$lib/components/ErrorSection.svelte';
	import HeroSlider from '$lib/components/HeroSlider.svelte';

	export let data;

	// Derived state for hero items and channel name
	$: heroItems = data?.page && data.page.length > 0 ? data.page.slice(0, 10) : [];
	$: channelName = data?.page && data.page.length > 0 ? data.page[0].channel.name : '';

	// Carousel options
	const options = { align: 'start', slidesToScroll: '2', loop: 'true' };
	const showcountry = false;
	const countryflag = false;
</script>

<div>
	{#if data?.page?.length > 0}
		{#if heroItems.length > 0}
			<HeroSlider {heroItems} {data} {showcountry} />
		{/if}
		<section class="content-section px-4 sm:px-6 lg:px-8">
			<div class="maincontent">
				<h1 class="section-title">
					<span
						class="bg-linear-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
					>
						Recently Added from {channelName}
					</span>
				</h1>
				<div class="embla" use:emblaCarouselSvelte={options}>
					<div class="embla__container flex">
						{#each data.page as item}
							<div class="embla__slide">
								<Card carddata={item} {countryflag} geo={data.geo} />
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
		padding-top: 3rem;
	}

	.maincontent {
		margin-bottom: 0;
	}

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
		.content-section {
			margin-top: -1.5rem;
			padding-top: 2rem;
		}

		.section-title {
			margin-bottom: 1rem;
		}
	}

	@media (min-width: 641px) and (max-width: 1024px) {
		.content-section {
			margin-top: -2rem;
			padding-top: 2.5rem;
			padding-left: 0 !important;
		}
	}

	@media (min-width: 1025px) {
		.content-section {
			margin-top: -2rem;
			padding-top: 3rem;
		}
	}
</style>
