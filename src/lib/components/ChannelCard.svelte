<!-- $lib/components/ChannelCard.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { Image } from '@unpic/svelte';

	interface Props {
		id: string;
		title: string;
		poster: string | null;
		channelName: string | null;
		channelIcon: string;
	}

	let { id, title, poster, channelName, channelIcon } = $props();

	function handleClick() {
		goto(`/channels/${id}`);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === 'Space') {
			e.preventDefault();
			handleClick();
		}
	}

	const imageUrl = $derived(poster ? `https://img.mediathek.community/t/p/w300${poster}` : null);
</script>

<div
	class="card"
	onclick={handleClick}
	onkeydown={handleKeydown}
	tabindex="0"
	role="button"
	aria-label={`${channelName}: ${title}`}
>
	<div class="content">
		{#if imageUrl}
			<Image
				src={imageUrl}
				alt={title}
				class="image"
				layout="fullWidth"
				loading="lazy"
				width={300}
				height={169}
			/>
		{:else}
			<div class="no-image" aria-hidden="true">
				{#if channelName}
					<Icon icon={channelIcon} width="66" height="68" class="icon" />
					<span class="name">{channelName}</span>
				{:else}
					<span class="placeholder-text">No Image</span>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.card {
		width: 220px;
		height: 130px;
		background-color: var(--color-surface-100, #1a1a1a);
		border-radius: 8px;
		overflow: hidden;
		transition: transform 0.2s ease;
		cursor: pointer;
		position: relative;
		contain: content;
	}

	.card:hover,
	.card:focus {
		transform: translateY(-2px);
		outline: none;
	}

	.card:focus-visible {
		outline: 2px solid var(--color-primary-500, #4a90e2);
		outline-offset: 2px;
	}

	.content {
		width: 100%;
		height: 100%;
		transform: translateZ(0);
		will-change: transform;
	}


	.no-image {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--color-surface-200, #2a2a2a);
		padding: 1rem;
		gap: 0.5rem;
	}


	.name {
		font-size: 0.875rem;
		color: var(--color-text-200, #e2e8f0);
		text-align: center;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.placeholder-text {
		color: var(--color-text-300, #cbd5e0);
		font-size: 0.875rem;
	}

	@media (max-width: 640px) {
		.card {
			width: 180px;
			height: 106px;
		}


		.name {
			font-size: 0.75rem;
		}
	}
</style>
