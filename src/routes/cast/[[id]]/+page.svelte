<script lang="ts">
	import Card from '$lib/components/Card.svelte';

	// Data is loaded from the page server and contains:
	// - person: the cast member's bio info (e.g., name, bio, hero image URL, etc.)
	// - mediaSorted: an object where each key is a country and value is an array of media items in which the person appears
	let { data } = $props();
	let data1 = $state(data.data);
	$effect(() => {
		data1 = data.data;
	});
	let filteredMedia = data.data.mediaSorted.filter((item) => {
		return item.cast.some((castMember) => castMember.id === Number(data1.paramid));
	});
	console.log(data);
	console.log(filteredMedia);
</script>

<!-- Hero section with cast bio -->
<div class="hero" style="max-height: 50vh; margin-top: 60px;">
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
	</div>
</div>

<!-- Media list sorted by channel country -->
<div class="media-list">
	{#each filteredMedia as items}
		<Card carddata={items} countryflag />
	{/each}
</div>

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
	.media-group {
		margin-bottom: 2rem;
	}
	.media-group h2 {
		margin-bottom: 1rem;
		text-transform: uppercase;
		border-bottom: 2px solid #ccc;
		padding-bottom: 0.5rem;
	}
	.media-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
	}
	.card {
		background: #222;
		border-radius: 8px;
		overflow: hidden;
		text-align: center;
		padding: 0.5rem;
	}
	.card img {
		width: 100%;
		height: auto;
		display: block;
		border-radius: 4px;
	}
	.card h3 {
		font-size: 1rem;
		margin-top: 0.5rem;
		color: #eee;
	}
	.fallback {
		text-align: center;
		color: #ccc;
		margin-top: 2rem;
		font-style: italic;
	}
</style>
