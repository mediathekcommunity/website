<script lang="ts">
	import type { PersonDetails } from '$lib/types/mediathek';
	export let person: PersonDetails;
	export let showBio = false;
</script>

<div class="hero" style="max-height: 50vh;">
	<h1>{person?.name}</h1>
	<div class="hero-content">
		<img class="hero-image" src={person?.heroImage || '/default-hero.jpg'} alt={person?.name} />
		<div class="hero-details">
			<div class="hero-details-row">
				<span>Birthday:</span>
				<span>{person?.birthday || 'N/A'}</span>
			</div>
			<div class="hero-details-row">
				<span>Place of Birth:</span>
				<span>{person?.place_of_birth || 'N/A'}</span>
			</div>
		</div>
		{#if showBio && person?.bio}
			<div class="hero-bio text-xs">
				<p>{person.bio}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: white;
		padding: 3rem 1rem;
		margin-top: 60px;
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
</style>
