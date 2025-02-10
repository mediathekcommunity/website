<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import ChannelCard from '$lib/components/ChannelCard.svelte';
	import ErrorSection from '$lib/components/ErrorSection.svelte';
	import type { PageData, Channel } from '$lib/types/channels';

	export let data: PageData;

	// Embla Carousel options
	const emblaOptions = { align: 'start', slidesToScroll: 1, loop: true };

	// Group channels by country
	const groupChannelsByCountry = (channels: Channel[]): Record<string, Channel[]> => {
		return channels.reduce((acc, channel) => {
			const country = channel?.country || 'Unknown';
			acc[country] = acc[country] || [];
			acc[country].push(channel);
			return acc;
		}, {} as Record<string, Channel[]>);
	};

	$: groupedChannels = groupChannelsByCountry(data.channels);
	$: sortedCountries = Object.keys(groupedChannels).sort();
</script>

<div>
	{#if data?.channels?.length}
		<section class="content-section">
			{#each sortedCountries as country}
				<article class="country-group">
					<h2 class="section-title">
						<span class="flag-icon">
							<!-- svelte-ignore svelte_component_deprecated -->
							<span class="fi fi-{country.toLowerCase()}"></span>
						</span>
					</h2>
					<div class="embla" use:emblaCarouselSvelte={emblaOptions}>
						<div class="embla__container">
							{#each groupedChannels[country] as channel}
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
		<ErrorSection filter={data.filter} text1="Channel" />
	{/if}
</div>

<style>
	.content-section {
		margin-top: -2rem;
		position: relative;
		z-index: 10;
		background: linear-gradient(to bottom, transparent, rgb(17, 17, 17) 15%);
		padding-top: 3rem;
	}

	.country-group {
		margin-bottom: 0;
	}

	.section-title {
		font-size: clamp(1.25rem, 2vw, 1.5rem);
		font-weight: bold;
		margin-bottom: 1rem;
		text-align: center;
	}

    .flag-icon {
        background-image: linear-gradient(to bottom right, red 50%, yellow 50%);
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

	.embla {
		overflow: hidden;
		margin: 0;
	}

	.embla__container {
		display: flex;
		gap: 1rem;
	}

	.embla__slide {
		flex: 0 0 auto;
		min-width: 0;
		padding: 0;
	}

	@media (max-width: 640px) {
		.content-section {
			margin-top: 1.5rem;
			padding-top: 2rem;
		}

		.section-title {
			padding: 1.25rem;
		}
	}

	@media (min-width: 641px) and (max-width: 1024px) {
		.content-section {
			margin-top: -2rem;
			padding-top: 2.5rem;
			padding-left: 0 !important;
		}

		.section-title {
			padding: 0 1rem 0.5rem 1rem;
		}
	}

	@media (min-width: 1025px) {
		.content-section {
			margin-top: -2rem;
			padding-top: 3rem;
		}

		.section-title {
			padding: 1.25rem;
		}
	}
</style>
