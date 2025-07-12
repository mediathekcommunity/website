<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Icon from '@iconify/svelte';
	import { writable } from 'svelte/store';

	interface Channel {
		id: string;
		name: string;
		title?: string;
		poster?: string;
		icon?: string;
		country?: string;
	}

	interface MediaItem {
		id: string;
		title: string;
		original_title?: string;
		type: 'movie' | 'series' | 'music' | string;
		thumbnail_url?: string;
		
		channel?: Channel; // Add channel object
		// Add other properties if needed, e.g., metascore, remainingDays
	}

	let { mediaItem }: { mediaItem: MediaItem } = $props();

	let isHovered = $state(false);

	const getTypeIcon = (type: string) => {
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
	};

	const posterUrl = mediaItem.thumbnail_url || 'https://via.placeholder.com/150';
</script>

{#key mediaItem.id}
	<a href={`/details/${mediaItem.id}`} class="card">
		<div
			class="card-content"
			role="button"
			tabindex="0"
			onmouseenter={() => (isHovered = true)}
			onmouseleave={() => (isHovered = false)}
		>
			<div class="card-image">
				<img src={posterUrl} alt={mediaItem.title} />

				<div class="badges">
					{#if mediaItem.channel}
						<div class="channel-badge">
							{#if mediaItem.channel.icon}
								<Icon icon={mediaItem.channel.icon} height="16px" width="16px" class="mr-1" />
							{/if}
						</div>
					{/if}
					<div class="quality-icon">
						<Icon icon={getTypeIcon(mediaItem.type)} />
					</div>
					<!-- Removed remainingDays badge for now, as data is not available -->
					<!-- Removed countryflag as broadcast_company is not a country code -->
				</div>
					{#if isHovered}
						<div class="card-overlay" transition:slide={{ duration: 200, easing: quintOut }}>
							<h3 class="card-title">{mediaItem.title}</h3>
							{#if mediaItem.original_title && mediaItem.original_title !== mediaItem.title}
								<p class="card-subtitle">{mediaItem.original_title}</p>
							{/if}
							<!-- Removed metascore for now, as data is not available -->
						</div>
					{/if}
			</div>
		</div>
	</a>
{/key}

<style>
	:root {
		--card-bg-color: #1a1a1a;
		--card-placeholder-bg-color: #2a2a2a;
		--card-overlay-bg-color: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.95) 0%,
			rgba(0, 0, 0, 0.7) 100%
		);
		--badge-bg-color: rgba(0, 0, 0, 0.7);
		--badge-text-color: white;
		--red-warning-color: red;
		--yellow-warning-color: yellow;
	}

	.card {
		width: 220px;
		height: 330px;
		margin: 0;
		position: relative;
		transform: translateZ(0);
		will-change: transform;
		transition: transform 0.3s ease;
		cursor: pointer;
		overflow: hidden;
		border-radius: 8px;
		background: var(--card-bg-color);
	}

	.card:hover {
		transform: scale(1.05) translateZ(0);
	}

	.card-content {
		width: 100%;
		height: 100%;
	}

	.card-image {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--card-overlay-bg-color);
		color: white;
		padding: 15px;
		max-height: 70%;
		overflow-y: auto;
	}

	.card-title {
		font-size: clamp(0.875rem, 2vw, 1rem);
		font-weight: 600;
		margin-bottom: 0.5rem;
		line-height: 1.2;
	}

	.card-subtitle {
		font-size: clamp(0.75rem, 1.5vw, 0.875rem);
		opacity: 0.9;
		margin-bottom: 0.5rem;
		line-height: 1.3;
	}

	.badges {
		display: flex;
		gap: 8px;
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 1;
	}

	.quality-icon,
	.channel-badge {
		background: var(--badge-bg-color);
		padding: 4px 8px;
		border-radius: 4px;
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.card-title {
		font-size: 1rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.card-subtitle {
		font-size: 0.875rem;
		opacity: 0.8;
		margin-bottom: 0.5rem;
	}

	@media (max-width: 640px) {
		.card {
			width: 160px;
			height: 240px;
		}

		.card-title {
			font-size: 0.875rem;
		}

		.card-subtitle {
			font-size: 0.75rem;
		}
	}
</style>