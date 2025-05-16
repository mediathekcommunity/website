<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Icon from '@iconify/svelte';
	import { writable } from 'svelte/store';

	// --- Types ---
	interface CardData {
		id: number;
		title?: string;
		orgtitle?: string;
		metascore?: string;
		type: 'movie' | 'series' | 'music' | 'y-series' | 'y-movie';
		poster?: string;
		backdropup?: { filename: string };
		posterup?: { filename: string };
		channel: { country: string };
		remainingDays?: number;
	}

	// --- Props ---
	let { carddata, countryflag, ico1 } = $props();
	// --- Reactive Variables ---
	var title = carddata?.title || 'Unknown Title';
	carddata.icon = 'fi fi-' + carddata.channelcountry || 'mdi:movie';
	var orgtitle = carddata?.orgtitle || null;
	var metascore = carddata?.metascore || 'Unknown';
	//console.log('CardData:', carddata); // Add debug log
	//console.log('countryflag:', countryflag); // Add debug log
	var countryflag1 = 'fi fi-' + carddata.channelcountry; // Add debug log
	// Add debug log

	// Optimize hover state with a single reactive statement
	let isHovered = false;

	// Memoized type icon mapping
	const typeIconMap = {
		movie: 'mdi:movie',
		series: 'mdi:tv',
		music: 'mdi:music',
		'y-series': 'mdi:tv',
		'y-movie': 'mdi:movie'
	} as const;

	const getTypeIcon = (type: CardData['type']) => typeIconMap[type] || 'mdi:movie';

	// Optimize poster URL generation with memoization
	const posterUrlStore = writable<string | null>(null);
	let posterUrl: string | null = null;
	if (carddata) {
		if (carddata.poster) {
			posterUrl = `https://mediathekc.b-cdn.net/t/p/w300${carddata.poster}`;
		} else if (carddata.posterup) {
			posterUrl = `https://api2.mediathek.community/api/files/pbc_772122303/sjyo8dgc5h51h63/${carddata.posterup}`;
		} else if (carddata.coverimageup) {
			posterUrl = `https://api2.mediathek.community/api/files/pbc_772122303/sjyo8dgc5h51h63/${carddata.coverimageup}`;
		}
		posterUrlStore.set(posterUrl);
	} else {
		posterUrlStore.set(null);
	}

	//console.log(carddata);
</script>

{#key carddata}
	<a href={`/details/${carddata.id}`} class="card">
		<div
			class="card-content"
			role="button"
			tabindex="0"
			onmouseenter={() => (isHovered = true)}
			onmouseleave={() => (isHovered = false)}
		>
			<div class="card-image">
				<img src={posterUrl} alt={title} />

				<div class="badges">
					<div class="quality-icon">
						<Icon icon={getTypeIcon(carddata.type)} />
					</div>
					{#if carddata.remainingDays !== undefined}
						<div
							class="remaining-days-badge {carddata.remainingDays === 0
								? 'red-warning'
								: 'yellow-warning'}"
						>
							<div class="md:hidden"><Icon icon="mdi:alert" /></div>
							<span class="remaining-days-text hidden sm:block">
								{carddata.remainingDays === 0
									? 'Expires today'
									: `~ ${carddata.remainingDays}d remains`}
							</span>
						</div>
					{/if}
					{#if countryflag}
						<span class={countryflag1}></span>
					{/if}
					<!-- -->
				</div>

				{#if isHovered}
					<div class="card-overlay" transition:slide={{ duration: 200, easing: quintOut }}>
						<h3 class="card-title">{title}</h3>
						{#if orgtitle && orgtitle !== title}
							<p class="card-subtitle">{orgtitle}</p>
						{/if}
						{#if metascore !== 'Unknown'}
							<p class="metascore">Score: {metascore}</p>
						{/if}
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

	.card-poster,
	.card-poster-placeholder {
		width: 100%;
		height: 100%;
		object-fit: cover;
		background: var(--card-placeholder-bg-color);
	}

	.card-poster-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 48px;
		font-weight: bold;
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

	.metascore {
		font-size: clamp(0.75rem, 1.5vw, 0.875rem);
		color: #00ff00;
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
	.country-icon,
	.remaining-days-badge {
		background: var(--badge-bg-color);
		padding: 4px 8px;
		border-radius: 4px;
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.remaining-days-badge.red-warning {
		color: var(--red-warning-color);
	}

	.remaining-days-badge.yellow-warning {
		color: var(--yellow-warning-color);
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

	.metascore {
		font-size: 0.875rem;
		color: #00ff00;
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
