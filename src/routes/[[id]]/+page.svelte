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
	//console.log(data);
	// Function to group media items by channel country
	// Get the first item from the data.page array as the hero item
	let heroItems = $derived(data?.page && data.page.length > 0 ? data.page.slice(0, 5) : []);
	// console.log(heroItems);
	// Carousel options
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
		<!-- Hero Section -->
		{#if heroItems}
			<HeroSlider {heroItems} {data} />
		{/if}
		<div class=" max-w-[2000px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
			<div class="maincontent">
				<h1 class="section-title">
					<span
						class="bg-gradient-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
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
		<!-- Main Content 
			<div class="container mx-auto max-w-[2000px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
				<div class="maincontent">
					<h1 class="section-title">
						<span
							class="bg-gradient-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
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
			</div>-->
	{:else}
		<ErrorSection filter={data?.filter} />
	{/if}
</div>

<style>
	.hero-section {
		position: relative;
		max-height: 50vh;
		margin-bottom: 2rem;
		width: 100%;
		z-index: 1;
	}

	.maincontent {
		margin-bottom: 2rem;
		margin-top: 1rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.embla {
		overflow: hidden;
	}

	.embla__container {
		display: flex;
	}

	.embla__slide {
		flex: 0 0 auto;
		min-width: 0;
		padding-right: 0; /* This adds space between slides */
	}

	.embla2 {
		overflow: hidden;
	}
	.embla__container2 {
		display: flex;
	}
	.embla__slide2 {
		flex: 0 0 100%;
		min-width: 0;
	}
</style>
