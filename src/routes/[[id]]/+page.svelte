<script>
	// @ts-nocheck
	import HeroSlider from '$lib/components/HeroSlider.svelte';
	import { visible } from '$lib/store';
	import * as Flag from 'svelte-flags';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from '$lib/components/Card.svelte';
	import Slider1 from '$lib/components/Slider1.svelte';
	import ErrorSection from '$lib/components/ErrorSection.svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import Fade from 'embla-carousel-fade';
	let { data } = $props();
	let heroItems = $derived(data?.page && data.page.length > 0 ? data.page.slice(0, 5) : []);
	let options = { align: 'start', slidesToScroll: 1, loop: true };
	let plugins = [
		Autoplay({
			delay: 8000,
			stopOnMouseEnter: false,
			stopOnFocusIn: false,
			stopOnInteraction: false
		}),
		Fade()
	];
	let currentSlide = 0;
	let options2 = { align: 'start', slidesToScroll: 2, loop: true };
	let emblaApi;
	function getimgurl(img) {
		if (img.backdrop) {
			return 'https://img.mediathek.community/t/p/original' + img.backdrop;
		} else {
			return 'https://cdn1.mediathek.community/' + img.backdropup.filename;
		}
	}
	function onInit(event) {
		emblaApi = event.detail;
	}
</script>

<div>
	{#if data && data.page && data.page.length > 0 && data.error === false}
		{#if heroItems}
			<HeroSlider {heroItems} {data} />
		{/if}
		<div class="content-section px-4 sm:px-6 lg:px-8">
			<div class="maincontent">
				<h1 class="section-title">
					<span
						class="bg-linear-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
					>
						Recently Added
					</span>
				</h1>
				<div class="embla" use:emblaCarouselSvelte={options2}>
					<div class="embla__container flex">
						{#each data.page as item}
							<div class="embla__slide">
								<Card carddata={item} countryflag geo={data.geo} />
							</div>
						{/each}
					</div>
				</div>
			</div>
			<Slider1 langlist={data.countries} langdata={data.groupbycountry} geo={data.geo} />
		</div>
	{:else}
		<ErrorSection filter={data?.filter} />
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
		margin-bottom: 0rem;
	}

	.section-title {
		font-size: clamp(1.25rem, 2vw, 1.5rem);
		font-weight: bold;
		margin-bottom: 1rem;
		text-align: center;
	}

	.embla {
		overflow: hidden;
		margin: 0 -1rem;
	}

	.embla__container {
		display: flex;
		gap: 1rem;
		padding: 0 1rem;
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
		}
	}

	@media (min-width: 1025px) {
		.content-section {
			margin-top: -2rem;
			padding-top: 3rem;
		}
	}
</style>
