<script>
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import ChannelCard from '$lib/components/ChannelCard.svelte';
	import ErrorSection from '$lib/components/ErrorSection.svelte';

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
				<!-- svelte-ignore svelte_component_deprecated -->
				<span class="fi fi-{country.toLowerCase()}"></span>
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
								channelIcon={item.icon}
							/>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{:else}
		<ErrorSection filter={data.id} text1="Channel" />
	{/if}
</div>

<style>
	.channels-container {
		padding: 4rem 1rem 1rem 3em; /* Add horizontal padding */
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
