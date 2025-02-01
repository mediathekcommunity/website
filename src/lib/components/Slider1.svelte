<script>
	// @ts-nocheck
	import { visible } from '$lib/store';
 	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from './Card.svelte';
	function getregionname(lang) {
		const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
		lang = lang.toUpperCase();
		return regionNames.of(lang);
	}
	const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' });
	// @ts-ignore
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

	$: sortedLanglist = sortCountries(langlist, geo);
</script>
{#each sortedLanglist as lang}
	<div>
		<h1 class="section-title">
			<span
				class="bg-linear-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
			>
				{#if lang !== 'Unknown'}
				<span class="fi fi-{lang.toLowerCase()}"></span>
				{/if}
				{getregionname(lang)}
				{lang === geo ? '(Your Location)' : ''}
			</span>
		</h1>
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
		.section-title {
			padding:1.25rem 1.25rem 0.625rem 1.25rem;
		}
	}

	@media (min-width: 641px) and (max-width: 1024px) {
		.section-title {
			padding: 0 1rem 0.5rem 1rem;
		}
	}

	@media (min-width: 1025px) {
		.section-title {
			padding: 1.25rem 1.25rem 0.625rem 1.25rem;
		}
	}
</style>
