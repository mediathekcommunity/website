<script>
	import Card from '$lib/components/Card.svelte';
	import ErrorSection from '$lib/components/ErrorSection.svelte';

	import emblaCarouselSvelte from 'embla-carousel-svelte';

	import Autoplay from 'embla-carousel-autoplay';
	import Fade from 'embla-carousel-fade';

    let emblaApi;
	// Data is loaded from the page server and contains:
	// - person: the cast member's bio info (e.g., name, bio, hero image URL, etc.)
	// - mediaSorted: an object where each key is a country and value is an array of media items in which the person appears
	let { data } = $props();
	let data1 = $state(data.data);
	let filteredMedia = $state([]);
	$effect(() => {
		data1 = data.data;
	});
	console.log(data);
	if (data && data.data) {
		filteredMedia = data.data.mediaSorted.filter((item) => {
			return item.crew.some((castMember) => castMember.id === Number(data1?.paramid));
		});
	}

	let options2 = { align: 'start', slidesToScroll: 1, loop: true };
	let plugins = [
		Autoplay({
			delay: 8000,
			stopOnMouseEnter: false,
			stopOnFocusIn: false,
			stopOnInteraction: false
		}),
		Fade()
	];
	function onInit(event) {
		emblaApi = event.detail;
	}
</script>

{#if !data.error}
	<!-- Hero section with cast bio -->
	<div class="hero" style="max-height: 50vh;">
		<h1>{data1?.person?.name}</h1>
		<div class="hero-content">
			<img
				class="hero-image"
				src={data1?.person?.heroImage || '/default-hero.jpg'}
				alt={data1?.person?.name}
			/>
			<div class="hero-details">
				<div class="hero-details-row">
					<span>Birthday:</span>
					<span>{data1?.person?.birthday || 'N/A'}</span>
				</div>
				<div class="hero-details-row">
					<span>Place of Birth:</span>
					<span>{data1?.person?.place_of_birth || 'N/A'}</span>
				</div>
			</div>
			<div class="hero-bio text-xs">
				<p>{data1?.person?.bio}</p>
			</div>
		</div>
	</div>
	<div class="media-list">
		<div class="embla" use:emblaCarouselSvelte={options2}>
			<div class="embla__container flex">
				{#each filteredMedia as item}
					<div class="embla__slide">
						<Card carddata={item} countryflag  />
					</div>
				{/each}
			</div>
		</div> 
	</div>
 {:else}
	<ErrorSection error={data?.error} />
{/if}

<style>
	/* Assume header bar height is 60px; adjust the value as needed */
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: white;
		padding: 3rem 1rem;
		margin-top: 60px; /* Ensure the hero always appears below the header bar */
		background-color: #333;
	}
	.hero-content {
		display: flex;
		align-items: flex-start;
		width: 100%;
		max-width: 1200px;
	}
	.hero-image {
		flex: 0 0 auto;
		width: 200px;
		height: auto;
		border-radius: 8px;
		margin-right: 2rem;
	}
	.hero-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-right: 2rem;
	}
	.hero-details-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}
	.hero-details-row span {
		font-weight: bold;
	}
	.hero-bio {
		flex: 2;
	}
	.hero h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		text-align: center;
		width: 100%;
	}
	.hero p {
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}

	.media-list {
		padding: 2rem 1rem;
	}
</style>
