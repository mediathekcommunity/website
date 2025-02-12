<script lang="ts">
	import { visible } from '$lib/store';
	import { Image } from '@unpic/svelte';
	import { transform } from 'unpic/providers/imgix';
	import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import Fade from 'embla-carousel-fade';
	import Icon from '@iconify/svelte';

	/**
	 * Component Props Interface
	 */
	interface HeroProps {
		data: any; // Consider defining a more specific type for 'data'
		heroItems: HeroItem[];
		geo: string;
		showcountry: boolean;
	}

	/**
	 * Hero Item Interface - Define the structure of heroItems
	 */
	interface HeroItem {
		backdrop?: string;
		backdropup?: { filename_disk: string };
		poster?: string;
		posterup?: { filename_disk: string };
		title: string;
		orgtitle: string;
		id: string;
		channel: {
			country: string;
			icon: string;
		};
		quality: '4K' | 'fhd' | 'hd' | string; // Define possible quality types
		type: 'movie' | 'series' | 'music' | string; // Define possible type values
	}

	let { data, heroItems, geo, showcountry } = $props<HeroProps>();

	/**
	 * Gets the icon name based on the video quality.
	 * @param quality - The quality string ('4K', 'fhd', 'hd', etc.).
	 * @returns The icon name from Material Design Icons or Material Symbols.
	 */
	const getqualityicon = (quality: string): string => {
		switch (quality) {
			case '4K':
				return 'mdi:uhd';
			case 'fhd':
				return 'material-symbols:full-hd';
			case 'hd':
				return 'mdi:video';
			default:
				return 'mdi:video-outline';
		}
	};

	/**
	 * Constructs the image URL for the backdrop.
	 * @param slide - The hero item slide data.
	 * @returns The backdrop image URL.
	 */
	const getImageUrl = (slide: HeroItem): string => {
		if (slide.backdrop) {
			return 'https://mediathekc.b-cdn.net/t/p/original' + slide.backdrop;
		} else if (slide.backdropup?.filename_disk) {
			return 'https://api.mediathek.community/assets/' + slide.backdropup.filename_disk;
		}
		return ''; // Return empty string as fallback, handle in component if needed
	};

	/**
	 * Constructs the image URL for the poster.
	 * @param slide - The hero item slide data.
	 * @returns The poster image URL.
	 */
	const getposterUrl = (slide: HeroItem): string => {
		if (slide.poster) {
			return 'https://mediathekc.b-cdn.net/t/p/original' + slide.poster;
		} else if (slide.posterup?.filename_disk) {
			return 'https://api.mediathek.community/assets/' + slide.posterup.filename_disk;
		}
		return ''; // Return empty string as fallback, handle in component if needed
	};

	/**
	 * Gets the icon name based on the content type.
	 * @param type - The content type ('movie', 'series', 'music', etc.).
	 * @returns The icon name from Material Design Icons.
	 */
	const getTypeIcon = (type: string): string => {
		switch (type) {
			case 'movie':
				return 'mdi:movie';
			case 'series':
				return 'mdi:tv';
			case 'music':
				return 'mdi:music';
			default:
				return 'mdi:movie'; // Default icon for unknown types
		}
	};

	/**
	 * Gets the background color class (not used in the provided template, consider removing or using).
	 * @param bgcolor - The background color string (not used).
	 * @returns The background color class string (currently hardcoded fallback).
	 * @deprecated This function seems unused and has a hardcoded fallback.
	 */
	const getbgcolor = (bgcolor: string | undefined): string => {
		if (bgcolor) {
			bgcolor = '  ' + bgcolor;
			return 'inline-flex items-center gap-1 text-white sm:text-sm ' + bgcolor;
		} else {
			return 'bg-lime-600'; // Hardcoded fallback, consider if this is intended
		}
	};

	/**
	 * Embla Carousel plugins configuration.
	 */
	const plugins: EmblaPluginType[] = [
		Autoplay({
			delay: 8000,
			stopOnMouseEnter: false,
			stopOnFocusIn: false,
			stopOnInteraction: false
		}),
		Fade()
	];

	/**
	 * Embla Carousel options configuration.
	 */
	const options: EmblaOptionsType = {
		align: 'center',
		slidesToScroll: 1,
		loop: true,
		containScroll: 'keepSnaps',
		dragFree: false,
		skipSnaps: false,
		startIndex: 0
	};

	let emblaApi: any; // Type should be EmblaAPI if types are available
	/**
	 * Callback function for Embla Carousel initialization event.
	 * @param event - The CustomEvent<{ embla: EmblaAPI }> from emblaCarouselSvelte.
	 */
	function onInit(event: CustomEvent<any>) { // Consider typing event detail more accurately
		emblaApi = event.detail;
	}
</script>

<div class="hero-container relative w-full">
	<div
		class="embla absolute inset-0"
		use:emblaCarouselSvelte={{ options, plugins }}
		onemblaInit={onInit}
	>
		<div class="embla__container">
			{#each heroItems as slide (slide.id)}
				<div class="embla__slide">
					<div class="relative h-full w-full">
						<Image
							src={getImageUrl(slide)}
							alt={slide.title}
							layout="fixed"
							operations={{
								bunny: {
									quality: 100
								}
							}}
							class="hero-image absolute inset-0 h-full w-full"
						/>
						<div class="gradient-overlay absolute inset-x-0 bottom-0"></div>
						<div
							class="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] text-white sm:bottom-8 sm:left-8 sm:max-w-[calc(100%-4rem)] md:bottom-12 md:left-16 md:max-w-2xl lg:bottom-16 lg:left-32 lg:max-w-3xl"
						>
							<div class="mb-1 flex flex-wrap items-center gap-1 sm:mb-4">
								<span class="badge-ghost inline-flex items-center px-1 py-1 text-white sm:text-sm">
									{#if showcountry}
										<span class="fi fi-{slide.channel.country.toLowerCase()} text-2xl"></span>
									{/if}
									<Icon icon={slide.channel.icon} height="28px" width="36px" />
								</span>
								<span
									class="badge-ghost inline-flex items-center gap-1 px-1 py-1 text-white sm:text-sm"
								>
									<Icon icon={getqualityicon(slide.quality)} height="28px" width="36px" />
								</span>
								<span
									class="badge-ghost inline-flex items-center gap-1 px-1 py-1 text-white sm:text-sm"
								>
									<Icon icon={getTypeIcon(slide.type)} height="28px" />
								</span>
							</div>
							<h1
								class="mb-2 text-2xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
							>
								{slide.title}
							</h1>
							{#if slide.title != slide.orgtitle}
								<p class="mb-4 text-sm text-gray-300 italic sm:text-base">
									Original Title: {slide.orgtitle}
								</p>
							{/if}
							<a href="/details/{slide.id}">
								<button class="btn btn-primary" href="/details/{slide.id}"> Details</button></a
							>
						</div>
					</div>
				</div>
			{/each}
 		</div>
 	</div>
 </div>

 <style>
 	.hero-container {
 		height: 85vh;
 		max-height: 95vh;
 		transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 	}

 	.embla {
 		overflow: hidden;
 		width: 100%;
 		height: 100%;
 	}

 	.embla__container {
 		display: flex;
 		height: 100%;
 		margin: 0;
 		backface-visibility: hidden;
 		width: 100%;
 	}

 	.embla__slide {
 		flex: 0 0 100%;
 		min-width: 100%;
 		position: relative;
 		height: 100%;
 		margin: 0;
 		padding: 0;
 		transform: translateX(0);
 		overflow: hidden;
 	}

 	.gradient-overlay {
 		height: 75%;
 		background: linear-gradient(
 			to top,
 			rgb(17, 17, 17) 0%,
 			rgba(17, 17, 17, 0.987) 7.8%,
 			rgba(17, 17, 17, 0.951) 15.2%,
 			rgba(17, 17, 17, 0.896) 22.1%,
 			rgba(17, 17, 17, 0.825) 28.7%,
 			rgba(17, 17, 17, 0.741) 35.1%,
 			rgba(17, 17, 17, 0.648) 41.2%,
 			rgba(17, 17, 17, 0.55) 47.1%,
 			rgba(17, 17, 17, 0.45) 52.9%,
 			rgba(17, 17, 17, 0.352) 58.8%,
 			rgba(17, 17, 17, 0.259) 64.9%,
 			rgba(17, 17, 17, 0.175) 71.3%,
 			rgba(17, 17, 17, 0.104) 77.9%,
 			rgba(17, 17, 17, 0.049) 84.8%,
 			rgba(17, 17, 17, 0.013) 92.2%,
 			rgba(17, 17, 17, 0) 100%
 		);
 	}

 	@media (max-width: 480px) {
 		.hero-container {
 			height: 40vh;
 			min-height: 250px;
 			max-height: 50vh;
 		}
 		.gradient-overlay {
 			height: 85%;
 		}
 	}

 	@media (min-width: 481px) and (max-width: 640px) {
 		.hero-container {
 			height: 50vh;
 			min-height: 300px;
 			max-height: 60vh;
 		}
 		.gradient-overlay {
 			height: 80%;
 		}
 	}

 	@media (min-width: 641px) and (max-width: 768px) {
 		.hero-container {
 			height: 60vh;
 			max-height: 75vh;
 		}

 		.gradient-overlay {
 			height: 75%;
 		}
 	}

 	@media (min-width: 769px) and (max-width: 1024px) {
 		.hero-container {
 			height: 70vh;
 			max-height: 85vh;
 		}

 		.gradient-overlay {
 			height: 75%;
 		}
 	}

 	@media (min-width: 1025px) {
 		.hero-container {
 			height: 85vh;
 			max-height: 95vh;
 		}

 		.gradient-overlay {
 			height: 75%;
 		}
 	}
 </style>
