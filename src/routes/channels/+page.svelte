<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import ChannelCard from '$lib/components/ChannelCard.svelte';
	import ErrorSection from '$lib/components/ErrorSection.svelte';
	import type { PageData, Channel } from '$lib/types/channels';
	import { onDestroy } from 'svelte';

	let { data } = $props<{ data: PageData }>();

	// Optimized carousel options
	const emblaOptions = {
		align: 'start' as const,
		slidesToScroll: 1,
		loop: true,
		dragFree: true,
		watchDrag: true
	};

	// Group channels by country with memoization
	const groupChannelsByCountry = (channels: Channel[]): Record<string, Channel[]> => {
		return channels?.reduce(
			(acc, channel) => {
				const country = channel?.country || 'Unknown';
				acc[country] = acc[country] || [];
				acc[country].push(channel);
				return acc;
			},
			{} as Record<string, Channel[]>
		) || {};
	};

	// Reactive states with proper typing
	const groupedChannels = $derived(groupChannelsByCountry(data?.channels || []));
	const sortedCountries = $derived(Object.keys(groupedChannels).sort());
	
	// Track embla instances for cleanup
	let emblaInstances: any[] = $state([]);
	
	onDestroy(() => {
		emblaInstances.forEach(instance => instance?.destroy());
		emblaInstances = [];
	});
</script>

<div>
	{#if data?.channels?.length}
		<section class="content-section">
			{#each sortedCountries as country}
				<article class="country-group">
					<h2 class="section-title">
						<span class="flag-icon" aria-hidden="true">
							<span class="fi fi-{country.toLowerCase()}"></span>
						</span>
						<span class="country-name">{country}</span>
					</h2>
					<div 
						class="embla" 
						use:emblaCarouselSvelte={{ 
							options: emblaOptions,
							plugins: []
						}}
						onemblaInit={(event: CustomEvent) => emblaInstances.push(event.detail)}
					>
						<div class="embla__container">
							{#each groupedChannels[country] as channel (channel.id)}
								<div class="embla__slide">
									<ChannelCard 
										id={channel.id}
										title={channel.title}
										poster={channel.poster}
										channelName={channel.name}
										channelIcon={channel.icon}
									/>
								</div>
							{/each}
						</div>
					</div>
				</article>
			{/each}
		</section>
	{:else}
		<ErrorSection filter={data?.filter} text1="Channel" />
	{/if}
</div>

<style>
	.content-section {
		margin-top: 1rem;
		position: relative;
		z-index: 10;
		background: linear-gradient(to bottom, transparent, rgb(17, 17, 17) 15%);
		padding-top: 3rem;
		min-height: 100dvh;
		contain: content;
	}

	.country-group {
		margin-bottom: 2rem;
		contain: layout style;
	}

	.section-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: clamp(1.25rem, 2vw, 1.5rem);
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.flag-icon {
		display: inline-flex;
		align-items: center;
	}

	.country-name {
		background: linear-gradient(to right, #ff4b2b, #ff416c);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.embla {
		overflow: hidden;
		padding: 0 1rem;
	}

	.embla__container {
		display: flex;
		gap: 1rem;
		touch-action: pan-y;
		transform: translateZ(0);
		will-change: transform;
	}

	.embla__slide {
		flex: 0 0 auto;
		min-width: 0;
		position: relative;
	}

	@media (max-width: 768px) {
		.content-section {
			padding-top: 2rem;
		}

		.country-group {
			margin-bottom: 1.5rem;
		}

		.embla {
			padding: 0 0.5rem;
		}

		.embla__container {
			gap: 0.5rem;
		}
	}
</style>