<script>
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { MetaTags, deepMerge } from 'svelte-meta-tags';
	let { data, children } = $props();

	let metaTags = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags));
	const SCROLL_THRESHOLD = 50; // Schwellenwert als Konstante
	let isScrolled = $state(false);

	// Funktion extrahiert und benannt
	function updateScrollState() {
		isScrolled = window.scrollY > SCROLL_THRESHOLD;
	}

	onMount(() => {
		window.addEventListener('scroll', updateScrollState);
		return () => window.removeEventListener('scroll', updateScrollState);
	});
</script>

<MetaTags {...metaTags} />

<svelte:head>
	<script defer src="http://stats.mediathek.community/script.js" data-website-id="06766e3b-978c-4a93-93b5-e69739ed571a"></script>
</svelte:head>

<div class="app">
	<Header {isScrolled} />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	/* Global styles für bessere Übersicht */
	:global(body) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		background-color: #141414;
		color: #fff;
		font-family: Arial, sans-serif;
	}

	/* Layout-Styling */
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		width: 100%;
		max-width: 100%;
	}

	@media (max-width: 768px) {
		main {
			padding: 0;
		}
	}
</style>
