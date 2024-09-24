<script>
	// @ts-nocheck
	import { visible } from '$lib/store.js';
	import * as Flag from 'svelte-flags';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from '$lib/components/Card.svelte';
	import Slider1 from '$lib/components/Slider1.svelte';

	let { data } = $props();

	// State variables for grouped data and country list
	let langdata = $state({});
	let langlist = $state([]);

	// Function to group media items by channel country
	const groupByChannelCountry = (items) => {
		return items.reduce((acc, item) => {
			//console.log(item);
			const country = item.country;
			acc[country] = acc[country] || []; // Create array for country if it doesn't exist
			acc[country].push(item);
			return acc;
		}, {});
	};
	var data1 = $state({});
	// Update grouped data and country list when data prop changes
 
	 	console.log(data.data1)
	// Carousel options
	let options = { align: 'start', slidestoscroll: '2', loop: 'true' };
</script>
{#if data}
		<div class="embla" use:emblaCarouselSvelte>
			<div class="embla__container">
				{#each data.page as item, index}
					<div class="embla__slide">
						<Card carddata={item} geo={data.geo} {visible}/>
					 
 					</div>
				{/each}
			</div>
		</div>
 {:else}
	<h1 class="h1">
		<span
			class="bg-gradient-radial from-tertiary-500 to-primary-500 box-decoration-clone bg-clip-text text-transparent"
		>
			No Item(s) found for type:
		</span>
		{data.filter || '*'}
	</h1>
{/if}
<!--

{#if data && data.count > 0}
	<div>
		<aside class="bg-gradient-radial from-tertiary-500 to-primary-500 box-decoration-clone bg-clip-text text-transparent">
			<div class="bg-gradient-radial from-tertiary-100 to-red-500 box-decoration-clone bg-clip-text text-transparent">
				<h3>WIP</h3>
				<p>I'm rebuilding this site with PayloadCMS as backend - Currently using: PayloadCMS</p>
			</div>
		</aside>

		<h1 class="h1 pb-3">
			<span class="bg-gradient-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent">
				Zuletzt hinzugefügt.
			</span>
		</h1>

		<div class="embla" use:emblaCarouselSvelte={{ options }}>
			<div class="embla__container flex">
				{#each data.page as item}
					<div class="embla__slide">
						<Card carddata={item} geo={data.geo} {visible}/>
					</div>
				{/each}
			</div>
		</div>

		 
			<Slider1 {langlist} {visible} {langdata} geo={data.geo} />
	 
	</div>

 -->
<style scoped>
	.embla__slide {
		flex: 0 0 200px !important;
		min-width: 0;
	}
	.embla__container {
		display: flex;
		flex-direction: row;
	}
</style>
