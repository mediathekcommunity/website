<script>
	// @ts-nocheck
	import * as Flag from 'svelte-flag-icons';

	export let carddata, geo;
	let currentVariant = 'bg-initial';
	//console.log(carddata,geo);
	function inFuture(date) {
		var now = new Date();
		var then = new Date(date);
		if (then > now) {
			return true;
		} else {
			return false;
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if inFuture(carddata.publishdate) == false}
	<!--  dev only -->
	{#if carddata.channel.country != geo}
		<div class="flex">
			<div class="relative mx-auto max-w-xl">
				<div class="absolute inset-0 rounded-md bg-gray-700 opacity-60"></div>

				<figure>
					{#if carddata.poster}
						<img
							class="h-64 rounded-lg"
							src="https://img.mediathek.rocks/t/p/original{carddata.poster}"
							alt="description"
						/>
					{:else}
						<img
							class="image-full mx-auto h-64 rounded-lg"
							src="https://img2.mediathek.rocks/assets/{carddata.coverimage}"
							alt="description"
						/>
					{/if}
				</figure>
				<div class="absolute inset-0 flex min-h-full items-center justify-center">
					<p>
						<svelte:component
							this={Flag[carddata.country]}
							class="inline-flex"
 							size="30"
						/><br>
						 IP wird benötigt 
						</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex">
			<a href="details/{carddata.id}">
				{#if carddata.poster}
					<img
						class="image-full mx-auto h-64 rounded-lg"
						src="https://img.mediathek.rocks/t/p/original{carddata.poster}"
						alt="description"
					/>
				{:else}
					<img
						class="image-full mx-auto h-64 rounded-lg"
						src="https://img2.mediathek.rocks/assets/{carddata.coverimage}"
						alt="description"
					/>
				{/if}
			</a>
		</div>
	{/if}
{:else}
	<div class="flex">
		<div class="relative mx-auto max-w-xl">
			<div class="absolute inset-0 rounded-md bg-gray-700 opacity-60"></div>

			<figure>
				{#if carddata.poster}
					<img
						class="h-64 rounded-lg"
						src="https://img.mediathek.community/t/p/original{carddata.poster}"
						alt="description"
					/>
				{:else}
					<img
						class="image-full mx-auto h-64 rounded-lg"
						src="https://img2.mediathek.community/assets/{carddata.coverimage}"
						alt="description"
					/>
				{/if}
			</figure>
			<div class="absolute inset-0 flex min-h-full items-center justify-center">
				<p>Coming soon</p>
			</div>
		</div>
	</div>
{/if}
