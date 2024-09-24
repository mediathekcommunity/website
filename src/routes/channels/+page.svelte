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

	// Update grouped data and country list when data prop changes
	$effect(() => {
		langdata = groupByChannelCountry(data.page);
	});
	$effect(() => {
		langlist = Object.keys(langdata).sort();
	});

	// Carousel options
	let options = { align: 'start', slidestoscroll: '2', loop: 'true' };
</script>

{#if langdata}
	{#each langlist as lang, index}
		<h1 class="h1 pb-3">
			<div
				class="flex items-center place-self-center bg-gradient-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
			>
				<svelte:component this={Flag[lang]} class="mr-1 inline-flex place-self-center" size="50" /> Sender
			</div>
		</h1>
		<div class="embla" use:emblaCarouselSvelte>
			<div class="embla__container">
				{#each langdata[lang] as item, index}
					<div class="embla__slide">
						<button class="btn preset-filled-primary-500" href={`/${item.id}`}>
							<a href={`/channels/${item.id}`}> {item['name']}<br /></a>
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/each}
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
