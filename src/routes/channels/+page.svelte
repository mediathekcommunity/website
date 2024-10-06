<script>
	import { visible } from '$lib/store.js';
	import * as Flag from 'svelte-flags';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from '$lib/components/Card.svelte';

	let { data } = $props();
	console.log('Received data:', data);

	let options = { align: 'start', slidesToScroll: 2, loop: true };

	// Function to group media items by channel country
	const groupByChannelCountry = (items) => {
		return items.reduce((acc, item) => {
			const country = item?.country || 'Unknown';
			acc[country] = acc[country] || [];
			acc[country].push(item);
			return acc;
		}, {});
	};

	let groupedData = $derived(data?.page ? groupByChannelCountry(data.page) : {});
	let countries = $derived(Object.keys(groupedData).sort());
</script>

{#if data && data.page && data.page.length > 0}
	{#each countries as country}
		<h2 class="country-header">
			<svelte:component this={Flag[country]} class="mr-1 inline-flex place-self-center" size="30" />
			{country}
		</h2>
		<div class="embla" use:emblaCarouselSvelte={options}>
			<div class="embla__container">
				{#each groupedData[country] as item}
					<div class="embla__slide">
						<Card carddata={item} geo={data.geo} {visible} />
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
		{data?.filter || '*'}
	</h1>
{/if}

<style>
	.embla__slide {
		flex: 0 0 200px !important;
		min-width: 0;
	}
	.embla__container {
		display: flex;
		flex-direction: row;
	}
	.country-header {
		display: flex;
		align-items: center;
		margin-top: 20px;
		margin-bottom: 10px;
		font-size: 1.5em;
		font-weight: bold;
	}
</style>
