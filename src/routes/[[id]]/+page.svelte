<script>
	import { visible } from '$lib/store.js';
	import * as Flag from 'svelte-flags';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Card from '$lib/components/Card.svelte';
	import Slider1 from '$lib/components/Slider1.svelte';
	import ErrorSection from '$lib/components/ErrorSection.svelte';

	let { data } = $props();

	// Function to group media items by channel country
	const groupByChannelCountry = (items) => {
		return items.reduce((acc, item) => {
			const country = item.channel?.country || 'Unknown';
			acc[country] = acc[country] || [];
			acc[country].push(item);
			return acc;
		}, {});
	};

	let groupedData = $derived(data?.page ? groupByChannelCountry(data.page) : {});
	let countries = $derived(Object.keys(groupedData).sort());

	// Get the first item from the data.page array as the hero item
	let heroItem = $derived(data?.page && data.page.length > 0 ? data.page[2] : null);

	// Carousel options
	let options = { align: 'start', slidesToScroll: 2, loop: true };
</script>

<div class="page-container">
	{#if data && data.page && data.page.length > 0}
		<div class="content">
			<!-- Hero Section -->
			{#if heroItem}
				<div class="hero-section">
					<div class="hero-image-container">
						{#if heroItem.backdrop}
							<img
								src="https://img.mediathek.rocks/t/p/original{heroItem.backdrop}"
								alt="{heroItem.title} backdrop"
								class="hero-image"
							/>
						{/if}
						<div class="hero-overlay"></div>
					</div>
					<div class="hero-content">
						<h1 class="hero-title">{heroItem.title || 'Latest Addition'}</h1>
						<p class="hero-description">{heroItem.orgtitle || 'Original Title Not Available'}</p>
						<div class="hero-details">
							{#if heroItem.channel?.country && Flag[heroItem.channel.country]}
								<svelte:component this={Flag[heroItem.channel.country]} size="20" />
							{/if}
							<span>{heroItem.channel?.name || 'Channel Name Not Available'}</span>
							{#if heroItem.quality}
								<span class="hero-quality">{heroItem.quality}</span>
							{/if}
						</div>
						{#if heroItem.onlineuntil}
							<p class="hero-availability">
								Available until: {new Date(heroItem.onlineuntil).toLocaleDateString()}
							</p>
						{/if}
						<div class="hero-buttons">
							<button class="btn-more-info">ⓘ More Info</button>
						</div>
					</div>
				</div>
			{/if}

			<div class="content-wrapper">
				<div class="maincontent">
					<h1 class="section-title">
						<span
							class="bg-gradient-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
						>
							Recently Added
						</span>
					</h1>

					<div class="embla" use:emblaCarouselSvelte={options}>
						<div class="embla__container flex">
							{#each data.page as item}
								<div class="embla__slide">
									<Card carddata={item} {visible} geo={data.geo} />
								</div>
							{/each}
						</div>
					</div>
				</div>
				<Slider1 langlist={countries} {visible} langdata={groupedData} geo={data.geo} />
			</div>
		</div>
	{:else}
		<ErrorSection filter={data?.filter} />
	{/if}
</div>

<style>
	.page-container {
		position: relative;
		min-height: 100vh;
		background-color: #141414;
		color: white;
	}

	.content {
		position: relative;
		z-index: 1;
	}

	.hero-section {
		position: relative;
		max-height: 50vh;
		margin-bottom: 2rem;
		width: 100%;
		z-index: 1;
	}

	.hero-image-container {
		position: relative;
		width: 100%;
		padding-top: 56.25%; /* 16:9 Aspect Ratio (9 / 16 = 0.5625) */
		overflow: hidden;
	}

	.hero-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
	}

	.hero-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			to bottom,
			rgba(20, 20, 20, 0) 0%,
			rgba(20, 20, 20, 0.8) 60%,
			rgba(20, 20, 20, 1) 100%
		);
	}

	.hero-content {
		position: absolute;
		bottom: 10%;
		left: 4%;
		max-width: 50%;
		z-index: 2;
	}

	.hero-title {
		font-size: 3rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.hero-description {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}

	.maincontent {
		margin-bottom: 2rem;
		margin-top: 1rem; /* Add this line */
	}
	.hero-details {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 0.5rem;
	}

	.hero-quality {
		background-color: rgba(255, 255, 255, 0.2);
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 0.8rem;
	}

	.hero-availability {
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}

	.hero-buttons {
		display: flex;
		gap: 10px;
	}

	.btn-more-info {
		padding: 8px 16px;
		font-size: 1rem;
		font-weight: bold;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		background-color: rgba(109, 109, 110, 0.7);
		color: white;
	}

	.btn-more-info:hover {
		background-color: rgba(109, 109, 110, 0.4);
	}

	.content-wrapper {
		position: relative;
		z-index: 2; /* Change this line */
		padding: 0 4%;
		margin-top: 1rem; /* Add this line */
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.embla {
		overflow: hidden;
	}

	.embla__container {
		display: flex;
	}

	.embla__slide {
		flex: 0 0 auto;
		min-width: 0;
		padding-right: 20px; /* This adds space between slides */
	}

	/* Media queries for responsiveness */
	@media (max-width: 1024px) {
		.hero-title {
			font-size: 2rem;
		}

		.hero-description {
			font-size: 1rem;
		}
	}

	@media (max-width: 768px) {
		.hero-content {
			max-width: 80%;
			bottom: 5%;
		}
	}

	@media (max-width: 480px) {
		.hero-content {
			max-width: 90%;
		}

		.hero-title {
			font-size: 1.5rem;
		}

		.hero-description {
			font-size: 0.9rem;
		}

		.hero-details,
		.hero-availability {
			font-size: 0.8rem;
		}

		.btn-more-info {
			padding: 6px 12px;
			font-size: 0.9rem;
		}
	}
</style>
