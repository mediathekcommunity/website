<script>
	import { visible } from '$lib/store.js';
	import * as Flag from 'svelte-flags';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import ChannelCard from '$lib/components/ChannelCard.svelte';

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

<div class="channels-container">
	{#if data && data.page && data.page.length > 0}
		{#each countries as country}
			<div class="country-header">
				<svelte:component this={Flag[country]} size="30" />
			</div>
			<div class="embla" use:emblaCarouselSvelte={options}>
				<div class="embla__container">
					{#each groupedData[country] as item}
						<div class="embla__slide">
							<ChannelCard
								id={item.id}
								title={item.title}
								poster={item.poster}
								channelName={item.name}
							/>
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
</div>

<style>
	.channels-container {
		padding: 0 1rem; /* Add horizontal padding */
	}

	.embla__slide {
		flex: 0 0 200px !important;
		min-width: 0;
		padding: 0 0.5rem; /* Add some space between slides */
	}

	.embla__container {
		display: flex;
		flex-direction: row;
		margin: 0 -0.5rem; /* Compensate for slide padding */
	}

	.country-header {
		display: flex;
		align-items: center;
		margin-top: 20px;
		margin-bottom: 10px;
	}
</style>