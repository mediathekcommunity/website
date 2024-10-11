<script>
	import * as Flag from 'svelte-flags';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Icon from '@iconify/svelte';

	export let carddata;

	$: title = carddata?.title || 'Unknown Title'; 
	$: orgtitle = carddata?.orgtitle || 'Unknown';
	$: metascore = carddata?.metascore || 'Unknown';
	function getQualityIcon(quality) {
		switch (quality?.toLowerCase()) {
			case 'sd':
				return 'mdi:video-sd';
			case 'hd':
				return 'material-symbols:hd-outline';
			case 'fhd':
				return 'material-symbols:full-hd-outline';
			case 'full hd':
				return 'mdi:video-4k-box';
			case '4k':
				return 'mdi:video-8k-box';
			default:
				return 'mdi:video';
		}
	}
	function handleClick(event) {
		event.preventDefault();
		//goto(`/details/${carddata.id}`);
	}
	let isHovered = false;
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
					src="https://img.mediathek.rocks/t/p/w300{carddata.poster}"
					alt="{title} poster"
					class="card-poster"
				/>
			{:else}
				<div class="card-poster-placeholder">{title[0]}</div>
			{/if}
			<div class="quality-icon">
				{#if carddata.type === 'movie'}
					<Icon icon="mdi:movie" />
				{:else}
					<Icon icon="mdi:tv" />
				{/if}
  			</div>
			{#if isHovered}
				<div class="card-overlay" transition:slide={{ duration: 300, delay: 50, easing: quintOut }}>
					<h3 class="card-title">{title}</h3>
					<div class="country-channel-info">
						<h3 class="card-title">O: {orgtitle}</h3>
					</div>
					<p>Metascore: {metascore}</p>
				</div>
			{/if}
		</div>
	</div>
</a>

<style>
	.card {
		width: 200px;
		height: 300px;
		margin: 10px;
		position: relative;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		cursor: pointer;
		overflow: hidden;
		border-radius: 4px;
	}
	.card:hover {
		transform: scale(1.05);
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
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
	}
	.card-poster-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #2f2f2f;
		color: white;
		font-size: 48px;
		font-weight: bold;
	}
	.card-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 100%);
		color: white;
		padding: 10px;
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
		border-radius: 4px;
		padding: 2px;
		font-size: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.card-title {
		margin: 0 0 5px 0;
		font-size: 1rem;
		line-height: 1.2;
		max-height: 3.6em; /* 3 lines of text */
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
	}
	.country-channel-info {
		display: flex;
		align-items: center;
		margin-bottom: 5px;
		font-size: 0.8rem;
	}
	.country-channel-info > * {
		margin-right: 5px;
	}
</style>
