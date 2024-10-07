<!-- $lib/components/ChannelCard.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';

	export let id: string;
	export let title: string;
	export let poster: string | null;
	export let channelName: string | null;

	function handleClick() {
		goto(`/details/${id}`);
	}
</script>

<div 
	class="channel-card"
	on:click={handleClick}
	on:keydown={(e) => e.key === 'Enter' && handleClick()}
	tabindex="0"
	role="button"
	aria-label={title}
>
	{#if poster}
		<img src="https://img.mediathek.rocks/t/p/w300{poster}" alt={title} />
	{:else}
		<div class="no-image">
			{#if channelName}
				<span class="channel-name">{channelName}</span>
			{:else}
				<span>No Image Available</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.channel-card {
		background-color: var(--color-surface-100, #ffffff);
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
		cursor: pointer;
		aspect-ratio: 16 / 9;
		position: relative;
	}

	.channel-card:hover, .channel-card:focus {
		transform: translateY(-5px);
		box-shadow: 0 0 20px rgba(var(--color-primary-500-rgb), 0.5);
		filter: brightness(1.1);
		outline: none;
	}

	.channel-card::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		box-shadow: 0 0 30px rgba(var(--color-primary-500-rgb), 0.8);
		transition: opacity 0.3s ease;
		border-radius: inherit;
		pointer-events: none;
	}

	.channel-card:hover::after, .channel-card:focus::after {
		opacity: 1;
	}

	.channel-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.no-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-surface-300, #e0e0e0);
		color: var(--color-text-200, #9e9e9e);
		text-align: center;
		padding: 1rem;
	}

	.channel-name {
		font-size: 1.2rem;
		font-weight: bold;
		word-break: break-word;
	}
</style>