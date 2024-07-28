<script>
	// @ts-nocheck

	export let langlist, visible, langdata, geo;
	console.log($visible)
	import * as Flag from 'svelte-flag-icons';
	import Card from '$lib/components/Card.svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
</script>
 {#key $visible}
	{#if $visible}
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
							<div class="embla__slide"><Card carddata={name} geo={geo}/></div>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	{:else if langdata[geo]}
		<h1 class="h1 pb-3 ">
			<div
				class="flex items-center place-self-center bg-gradient-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
			>
				<svelte:component this={Flag[geo]} class="mr-1 inline-flex place-self-center" size="50" />
				Mediatheken
			</div>
		</h1>
		<div class="embla" use:emblaCarouselSvelte>
			<div class="embla__container">
				{#each langdata[geo] as name, index}
					<div class="embla__slide"><Card carddata={name} geo={geo}/></div>
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
				<svelte:component this={Flag[geo]} class="mr-1 inline-flex place-self-center" size="50" />
			</span>
		</h1>
	{/if}
{/key}

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