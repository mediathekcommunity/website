<script>
	// @ts-nocheck
	import { visible } from '$lib/store';
	import * as Flag from 'svelte-flags';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from '$lib/components/Card.svelte';
	import Slider1 from '$lib/components/Slider1.svelte';
	import ErrorSection from '$lib/components/ErrorSection.svelte';

	let { data } = $props();

	// State variables for grouped data and country list
	let langdata = $state({});
	let langlist = $state([]);
	// console.log(process.env);
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

	// Carousel options
	let options = { align: 'start', slidestoscroll: '2', loop: 'true' };
</script>

{#if data}
	<div class="embla" use:emblaCarouselSvelte>
		<div class="embla__container">
			{#each data.page as item, index}
				<div class="embla__slide">
					<Card carddata={item} geo={data.geo} {visible} />
				</div>
			{/each}
		</div>
	</div>
{:else}
	<ErrorSection filter={data?.filter} />
{/if}

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
