<script>
	// @ts-nocheck
	import * as Flag from 'svelte-flag-icons';

	export let carddata, geo, visible;
	let currentVariant = 'bg-initial';

	const isFuture = (date) => new Date(date) > new Date();

	const imageUrl = carddata.poster
		? `https://img.mediathek.rocks/t/p/original${carddata.poster}`
		: `https://img2.mediathek.rocks/assets/${carddata.coverimage}`;

	$: showGeoAlert = !isFuture(carddata.publishdate) && carddata.channel.country !== geo && !$visible;
	$: showComingSoon = isFuture(carddata.publishdate);
	//console.log($visible)
	const flag = Flag[carddata.channel.country];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="flex">
	{#if showGeoAlert}
		<div class="relative mx-auto max-w-xl">
			<div class="absolute inset-0 rounded-md bg-gray-700 opacity-60"></div>

			<figure>
				<img class="h-64 rounded-lg" src={imageUrl} alt="description" />
			</figure>
			<div class="absolute inset-0 flex min-h-full items-center justify-center">
				<p>
					<svelte:component this={flag} class="inline-flex" size="30" />
					IP wird benötigt
				</p>
			</div>
		</div>
	{:else if !showComingSoon}
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<a href={`/details/${carddata.id}`}>
			<img class="image-full mx-auto h-64 rounded-lg" src={imageUrl} alt="description" />
		</a>
	{:else}
		<div class="relative mx-auto max-w-xl">
			<div class="absolute inset-0 rounded-md bg-gray-700 opacity-60"></div>

			<figure>
				<img class="h-64 rounded-lg" src={imageUrl} alt="description" />
			</figure>
			<div class="absolute inset-0 flex min-h-full items-center justify-center">
				<p>Coming soon</p>
			</div>
		</div>
	{/if}
</div>
