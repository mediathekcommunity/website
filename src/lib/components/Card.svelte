<script>
	import * as Flag from 'svelte-flags';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Icon from '@iconify/svelte';

	export let carddata, countryflag;
	$: title = carddata?.title || 'Unknown Title';
	$: orgtitle = carddata?.orgtitle || 'Unknown';
	$: metascore = carddata?.metascore || 'Unknown';
	let isHovered = false;
	// @ts-ignore
	function getTypeIcon(type) {
		switch (type) {
			case 'movie':
				return 'mdi:movie';
			case 'series':
				return 'mdi:tv';
			case 'music':
				return 'mdi:music';
			default:
				return 'mdi:movie';
		}
	}
</script>

<a href={`/details/${carddata.id}`} class="card">
	<div
		class="card"
		role="button"
		tabindex="0"
		on:mouseenter={() => (isHovered = true)}
		on:mouseleave={() => (isHovered = false)}
	>
		<div class="card-image">
			{#if carddata.poster}
				<img
					src="https://img.mediathek.community/t/p/w300{carddata.poster}"
					alt="{title} poster"
					class="card-poster"
				/>
			{:else if carddata.backdropup}
				<img
					src="https://cdn1.mediathek.community/{carddata.backdropup.filename}"
					alt="{title} backdrop"
					class="card-poster"
				/>
			{:else}
				<div class="card-poster-placeholder">{title[0]}</div>
			{/if}
			<div class="quality-icon">
				<Icon icon="{getTypeIcon(carddata.type)}" />
			</div>
			{#if countryflag}
				<div class="country-icon">
					<svelte:component this={Flag[carddata.channel.country]} size="25" />
				</div>
			{/if}
			{#if isHovered}
				<div class="card-overlay" transition:slide={{ duration: 300, delay: 50, easing: quintOut }}>
					<h3 class="card-title">{title}</h3>
					<div class="country-channel-info">
						<h3 class="card-title">O: {orgtitle}</h3>
					</div>
					{#if metascore !== 'Unknown'}
						<p>Metascore: {metascore}</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</a>

<style>
	.card {
		width: 220px;
		height: 330px;
		margin: 0px;
		position: relative;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		cursor: pointer;
		overflow: hidden;
		border-radius: 8px;
		background: rgb(17, 17, 17);
	}

	.card:hover {
		transform: scale(1.05);
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
		z-index: 1;
	}

	.card-image {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.card-poster,
	.card-poster-placeholder {
		width: 100%;
		height: 100%;
		object-fit: cover;
		background: rgb(23, 23, 23);
	}

	.card-poster-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgb(23, 23, 23);
		color: white;
		font-size: 48px;
		font-weight: bold;
	}

	.card-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 100%);
		color: white;
		padding: 15px;
		max-height: 70%;
		overflow-y: auto;
	}

	.quality-icon {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 2;
		color: white;
		background-color: rgba(0, 0, 0, 0.7);
		border-radius: 6px;
		padding: 4px;
		font-size: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
	}

	.country-icon {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 2;
		color: white;
		background-color: rgba(0, 0, 0, 0.7);
		border-radius: 6px;
		padding: 4px;
		font-size: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
	}

	.card-title {
		margin: 0 0 8px 0;
		font-size: 1rem;
		line-height: 1.3;
		max-height: 3.9em;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
	}

	.country-channel-info {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
		font-size: 0.9rem;
	}

	.country-channel-info > * {
		margin-right: 8px;
	}

	@media (max-width: 640px) {
		.card {
			width: 160px;
			height: 240px;
			margin: 6px;
		}

		.card-title {
			font-size: 0.9rem;
		}

		.quality-icon,
		.country-icon {
			padding: 3px;
			font-size: 20px;
		}
	}

	@media (min-width: 641px) and (max-width: 1024px) {
		.card {
			width: 180px;
			height: 270px;
			margin: 8px;
		}
	}
</style>
