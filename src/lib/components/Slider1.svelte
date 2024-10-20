<script>
	import { visible } from '$lib/store';
	import * as Flag from 'svelte-flags';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from './Card.svelte';

	export let langlist = [];
	export let langdata = {};
	export let geo = 'Unknown';

	let options = {
		align: 'start',
		slidesToScroll: 2,
		loop: true,
		dragFree: true,
		containScroll: 'trimSnaps'
	};

	// Function to sort countries, putting the user's geo country first
	function sortCountries(countries, userGeo) {
		return [...countries].sort((a, b) => {
			if (a === userGeo) return -1;
			if (b === userGeo) return 1;
			return a.localeCompare(b);
		});
	}
//$: console.log('langlist:', langlist);
	$: sortedLanglist = sortCountries(langlist, geo);
</script>

{#each sortedLanglist as lang}
	<div class="lang-section">
		<h2 class="lang-header">
			{#if lang !== 'Unknown'}
				<svelte:component this={Flag[lang]} class="mr-2 inline-flex place-self-center" size="30" />
			{/if}
			{lang === geo ? '(Your Location)' : ''}
		</h2>
		<div class="embla" use:emblaCarouselSvelte={options}>
			<div class="embla__container">
				{#each langdata[lang] || [] as item}
					<div class="embla__slide">
						<Card carddata={item} {visible} {geo} />
					</div>
				{/each}
			</div>
		</div>
	</div>
{/each}

<style>
	.lang-section {
		margin-bottom: 2rem;
	}

	.lang-header {
		display: flex;
		align-items: center;
		font-size: 1.5rem;
		font-weight: bold;
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
		padding-left: 10px;
		padding-right: 10px;
	}
</style>
