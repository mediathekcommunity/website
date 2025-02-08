<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Icon from '@iconify/svelte';
	import { Image, type ImageProps } from '@unpic/svelte';

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
		remainingDays?: number; // Add remainingDays property
	}

	export let carddata: CardData;
	export let countryflag: boolean;

	$: title = carddata?.title || 'Unknown Title';
	$: orgtitle = carddata?.orgtitle || 'Unknown';
	$: metascore = carddata?.metascore || 'Unknown';
	let isHovered = false;

	function getTypeIcon(type: CardData['type']): string {
		switch (type) {
			case 'movie':
				return 'mdi:movie';
			case 'series':
				return 'mdi:tv';
			case 'music':
				return 'mdi:music';
			case 'y-series':
				return 'mdi:tv';
			case 'y-movie':
				return 'mdi:movie';
		}
	}

	const getPosterUrl = (carddata: CardData): string | null => {
		if (carddata.poster) {
			return `https://mediathekc.b-cdn.net/t/p/original${carddata.poster}`;
		} else if (carddata.coverimageup) {
			return `https://mediathekc.b-cdn.net/${carddata.coverimageup.filename_disk}?host=api`;
		}
		return null;
	};

	const imageProps = (carddata: CardData, posterUrl: string): ImageProps => ({
		src: posterUrl,
		alt: carddata.poster ? `${title} poster` : `${title} backdrop`,
		class: 'card-poster',
		layout: 'fullWidth',
		objectFit: 'fill '
		 });
</script>

<a href={`/details/${carddata.id}`} class="card">
	<div
		class="card-content"
		role="button"
		tabindex="0"
		on:mouseenter={() => (isHovered = true)}
		on:mouseleave={() => (isHovered = false)}
	>
		<div class="card-image">
			<!-- Move the conditional check into the expression -->
			{#if getPosterUrl(carddata) !== null}
				<!-- use it directly -->
				<Image src={getPosterUrl(carddata)} alt={title} style="object-fit: fill; height:100%"/>
			{:else}
				<div class="card-poster-placeholder">{title[0]}</div>
			{/if}
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
								: `${carddata.remainingDays} days remains`}
						</span>
					</div>
				{/if}
				{#if countryflag}
					<div class="country-icon">
						<span class="fi fi-{carddata.channel.country.toLowerCase()}"></span>
					</div>
				{/if}
			</div>
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
		margin: 0;
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

	.badges {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		top: 10px;
		left: 10px;
		right: 10px;
		z-index: 2;
	}

	.quality-icon,
	.country-icon,
	.remaining-days-badge {
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

	.remaining-days-badge {
		font-size: 14px;
		white-space: nowrap; /* Ensure it is always one line */
	}

	.remaining-days-text {
		display: none;
		font-size: 16px;
	}

	.red-warning {
		color: red;
	}

	.yellow-warning {
		color: yellow;
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
		line-clamp: 3;
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
		}

		.card-title {
			font-size: 0.9rem;
		}

		.quality-icon,
		.country-icon,
		.remaining-days-badge {
			padding: 3px;
			font-size: 20px;
		}

		.remaining-days-text {
			display: none; /* Hide text on small screens */
		}
	}

	@media (min-width: 641px) {

		.remaining-days-text {
			display: inline; /* Show text on larger screens */
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
