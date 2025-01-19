<script>
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import '../app.css';
	import { scrollY } from 'svelte/reactivity/window';
	let isScrolled = $state(false);
	const handleScroll = () => {
		isScrolled = scrollY.current > 50;
	};
</script>

<svelte:window onscroll={handleScroll} />

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
		<slot />
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
	}

	main {
		flex: 1;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		width: 100%;
		min-height: 100vh;
		max-width: 100%;
	}

	@media (max-width: 768px) {
		main {
			padding: 0;
		}
	}
</style>
