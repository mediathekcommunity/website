<script>
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import '../app.css';
	import { onMount } from 'svelte';
	import { scrollY } from 'svelte/reactivity/window';
	let isScrolled = $state(false);
    let { children } = $props();
	
	onMount(() => {
		const handleScroll = () => {
			isScrolled = scrollY?.current !== undefined && scrollY.current > 50;
		};


		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:head>
	<!-- Cloudflare Web Analytics -->
	<script
		defer
		src="https://static.cloudflareinsights.com/beacon.min.js"
		data-cf-beacon={JSON.stringify({ token: 'b7e2f3218ca7460b8cf5684db6e8cb25' })}
	></script>
	<!-- End Cloudflare Web Analytics -->
</svelte:head>

<div class="app">
	<Header {isScrolled} />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		background-color: #141414;
		color: #fff;
		font-family: Arial, sans-serif;
	}

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
