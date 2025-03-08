<script>
	import Footer from '$lib/components/footer.svelte';
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { MetaTags, deepMerge } from 'svelte-meta-tags';
	let { data, children } = $props();
	import { writable } from 'svelte/store';

	const desktopDrawerOpen = writable(false);

	const isMobileMenuOpen = writable(false);

	function toggleMobileMenu() {
		isMobileMenuOpen.update((value) => !value);
	}

	function toggleDesktopDrawer() {
		desktopDrawerOpen.update((value) => !value);
	}
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

<svelte:head></svelte:head>

<div class="app">
	<div class="drawer">
		<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col">
			<!-- Navbar -->
			<div class="navbar bg-base-300 header w-full" class:glass2={isScrolled || $isMobileMenuOpen}>
				<div class="flex-none lg:hidden">
					<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block h-6 w-6 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							></path>
						</svg>
					</label>
				</div>
				<div class="mx-2 flex-1 px-2">
					<h1 class="site-title">
						<span class="text-primary">Mediathek</span>
						<span class="text-white">Community</span>
						<span class="badge badge-primary text-white">v0.9.2</span>
					</h1>
				</div>
				<div class="hidden flex-none lg:block">
					<ul class="menu menu-horizontal">
						<!-- Navbar menu content here -->
						<li><a href="/">Home</a></li>
						<li><a href="/movie">Movies</a></li>
						<li><a href="/series">TV Shows</a></li>
						<li><a href="/music">Music</a></li>
						<li><a href="/culture">Culture</a></li>
						<li><a href="/youth">Youth</a></li>
						<li><a href="/specials">Specials</a></li>
						<li><a href="/channels">Channels</a></li>
					</ul>
				</div>
			</div>
			<!-- Page content here -->
			<main>
				{@render children()}
			</main>
		</div>
		<div class="drawer-side z-50">
			<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
			<ul class="menu bg-base-200 min-h-full w-80 p-4 pt-12">
				<!-- Sidebar content here -->
				<li><a href="/">Home</a></li>
				<li><a href="/movie">Movies</a></li>
				<li><a href="/series">TV Shows</a></li>
				<li><a href="/music">Music</a></li>
				<li><a href="/culture">Culture</a></li>
				<li><a href="/youth">Youth</a></li>
				<li><a href="/specials">Specials</a></li>
				<li><a href="/channels">Channels</a></li>
			</ul>
		</div>
	</div>

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
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		transition: all 0.3s ease;
		background-color: transparent;
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
	}
	/* Layout-Styling */
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100lvh;
	}
	.glass2 {
		background-color: rgba(20, 20, 20, 0.9);
	}
	main {
		flex: 1;
		width: 100%;
		max-width: 100%;
		min-height: 100dvh;
	}

	@media (max-width: 768px) {
		main {
			padding: 0;
		}
	}
</style>
