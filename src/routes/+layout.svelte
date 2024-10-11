<script>
	import Header from '$lib/components/header.svelte';
	import Footer1 from '$lib/components/footer1.svelte';
	import '../app.css';
</script>

<div class="app">
	<Header />
	<main>
		<aside
			class="bg-gradient-radial from-tertiary-500 to-primary-500 box-decoration-clone bg-clip-text text-transparent"
		>
			<div
				class="bg-gradient-radial from-tertiary-100 to-red-500 box-decoration-clone bg-clip-text text-transparent"
			>
				<h3>WIP</h3>
				<p>
					I'm rebuilding data structure in the backend to support multiple channel public broadcast
					mediatheks per entry
				</p>
			</div>
		</aside>
		<slot />
	</main>
	<Footer1 />
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
		margin: 0 auto;
		padding: 0;
		box-sizing: border-box;
	}

	@media (max-width: 768px) {
		main {
			padding: 0;
		}
	}
</style>
