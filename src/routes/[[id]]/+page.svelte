<script>
	// @ts-nocheck
	// Modals Utils
	import { visible } from '$lib/store.js';
	import { onDestroy } from 'svelte';
	import * as Flag from 'svelte-flag-icons';
	import emblaCarouselSvelte from 'embla-carousel-svelte';

	import { onMount } from 'svelte';
	import Card from '$lib/components/Card.svelte';
	import Slider1 from '$lib/components/Slider1.svelte';
	// Component props
	/* @type { import('./$houdini').PageData } */
	let { data } = $props();
	console.log(data);
	//data.page.channel = data.page.channel[0];
	// console.log(data);
 
	let langdata = $state({});
	let langlist = $state([]);

	const groupByChannelCountry = (array) => {
		array = array.page;
		return array.reduce((acc, item) => {
			const country = item.channel.country;
			if (!acc[country]) {
				acc[country] = [];
			}
			acc[country].push(item);
			return acc;
		}, {});
	};
	$effect(() => {
		console.log(visible);
	});
	$effect(() => {
		langdata = groupByChannelCountry(data);
	});
	$effect(() => {
		langlist = Object.keys(langdata);
	});

	//console.log(langdata);
	//console.log(Object.keys(langdata));

	/*var geo1 = capitalizeFirstLetter(data.geo);*/
</script>

{#if data && data.count > 0}
	<div>
		<aside
			class="bg-gradient-radial from-tertiary-500 to-primary-500 box-decoration-clone bg-clip-text text-transparent"
		>
			<div
				class="bg-gradient-radial from-tertiary-100 to-red-500 box-decoration-clone bg-clip-text text-transparent"
			>
				<h3 class="h3">WIP</h3>
				<p>I'm rebuilding this site with Directus as backend - Currently using: Directus</p>
			</div>
		</aside>

		<h1 class="h1 pb-3">
			<span
				class="bg-gradient-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
			>
				Zuletzt hinzugefügt.
			</span>
		</h1>
		<div class="embla" use:emblaCarouselSvelte>
			<div class="embla__container flex">
				{#each data.page as name, index}
					<div class="embla__slide"><Card carddata={name} geo={data.geo} /></div>
				{/each}
			</div>
		</div>
		<!-- 
		{#each langlist as lang, index}
			<div class="box">
				<h1 class="h1  pb-3">
					<div
						class="flex items-center place-self-center bg-gradient-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
					>
						<svelte:component
							this={Flag[lang]}
							class="mr-1 inline-flex place-self-center"
							size="50"
						/> Mediatheken
					</div>
				</h1>
				<div class="embla" use:emblaCarouselSvelte>
					<div class="embla__container flex">
						{#each langdata[lang] as name, index}
							<div class="embla__slide"><Card carddata={name}  /></div>
						{/each}
					</div>
				</div>
			</div>
		{/each}
		-->
		{#key visible}
			<Slider1 {langlist} {visible} {langdata}  geo={data.geo} />
		{/key}
	</div>
{/if}
{#if !data}
	<h1 class="h1">
		<span
			class="bg-gradient-radial from-tertiary-500 to-primary-500 box-decoration-clone bg-clip-text text-transparent"
		>
			No Item(s) found
		</span>
		{data.param || '*'}
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
