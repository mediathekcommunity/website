<script>
	// @ts-nocheck

	import * as Flag from 'svelte-flag-icons';
	import Card from '$lib/components/Card.svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import { onMount } from 'svelte';

	export let langlist, visible, langdata, geo;
	let options = { align: 'start', slidestoscroll: '2', loop: 'true' };

	onMount(() => {
		console.log(langlist, geo);
		console.log($visible);
	});

	let currentLang = '';
	$: currentLang = $visible ? langlist[0] : geo;
	console.log(currentLang);

	let hasData = false;
	$: hasData = !!langdata[currentLang];

	let carousel = null;
	let em = null;
</script>

{#if hasData}
	<h1 class="h1 pb-3">
		<div
			class="flex items-center place-self-center bg-gradient-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
		>
			<svelte:component
				this={Flag[currentLang]}
				class="mr-1 inline-flex place-self-center"
				size="50"
			/>
			Mediatheken
		</div>
	</h1>
	<div class="embla" bind:this={em} use:emblaCarouselSvelte={{ options }}>
		<div class="embla__container flex" bind:this={carousel}>
			{#each langdata[currentLang] as name, index}
				<div class="embla__slide"><Card carddata={name} {geo} /></div>
			{/each}
		</div>
	</div>
{:else}
	<!-- No items found section -->
	<h1 class="h1">
		<span
			class="bg-gradient-to-br from-pink-100 to-red-900 box-decoration-clone bg-clip-text text-transparent"
		>
			No Item(s) found for Country:
			<svelte:component this={Flag[currentLang]} class="mr-1 inline-flex place-self-center" size="50" />
		</span>
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
