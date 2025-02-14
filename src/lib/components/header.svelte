<script>
	import { slide } from 'svelte/transition';
	let isMobileMenuOpen = $state(false);
	let { isScrolled } = $props();

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<header class:glass2={isScrolled || isMobileMenuOpen}>
	<div class="header-content">
		<div class="logo">
			<a href="/">
				<h1 class="site-title">
					<span class="text-primary">Mediathek</span>
					<span class="text-white">Community</span>
					<span class="badge badge-primary text-white">v0.8.0</span>
				</h1>
			</a>
		</div>
		<nav class="desktop-nav">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/movie">Movies</a></li>
				<li><a href="/series">TV Shows</a></li>
				<li><a href="/music">Music</a></li>
				<li><a href="/culture">Culture</a></li>
				<li><a href="/youth">Youth</a></li>
				<li><a href="/specials">Specials</a></li>
				<li><a href="/channels">Channels</a></li>
			</ul>
		</nav>
		<button class="mobile-menu-button" onclick={toggleMobileMenu}>☰</button>
	</div>
</header>

{#if isMobileMenuOpen}
	<div class="mobile-menu" transition:slide={{ duration: 300 }}>
		<nav>
			<ul>
				<li><a href="/" onclick={toggleMobileMenu}>Home</a></li>
				<li><a href="/movie" onclick={toggleMobileMenu}>Movies</a></li>
				<li><a href="/series" onclick={toggleMobileMenu}>TV Shows</a></li>
				<li><a href="/music" onclick={toggleMobileMenu}>Music</a></li>
				<li><a href="/culture" onclick={toggleMobileMenu}>Culture</a></li>
				<li><a href="/youth" onclick={toggleMobileMenu}>Youth</a></li>
				<li><a href="/specials" onclick={toggleMobileMenu}>Specials</a></li>
				<li><a href="/channels" onclick={toggleMobileMenu}>Channels</a></li>
			</ul>
		</nav>
	</div>
{/if}

<style>
	.disabled {
		pointer-events: none;
		cursor: default;
		color: var(--color-error) !important;
	}
	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		transition: all 0.3s ease;
		padding: 1rem 4%;
		background-color: transparent;
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
	}
	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo a {
		text-decoration: none;
	}

	.site-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin: 0;
	}

	.desktop-nav ul {
		display: flex;
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	.desktop-nav ul li {
		margin-left: 1.5rem;
	}

	.desktop-nav ul li a {
		color: #fff;
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.3s ease;
	}

	.desktop-nav ul li a:hover {
		color: #3498db;
	}

	.mobile-menu-button {
		display: none;
		background: none;
		border: none;
		color: #fff;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.mobile-menu {
		position: fixed;
		top: 4rem;
		left: 0;
		right: 0;
		background-color: rgba(20, 20, 20, 0.9);
		padding: 1rem;
		z-index: 999;
	}
	.glass2 {
		background-color: rgba(20, 20, 20, 0.9);
	}
	.mobile-menu nav ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	.mobile-menu nav ul li {
		margin-bottom: 1rem;
	}

	.mobile-menu nav ul li a {
		color: #fff;
		text-decoration: none;
		font-size: 1rem;
		transition: color 0.3s ease;
	}

	.mobile-menu nav ul li a:hover {
		color: #3498db;
	}

	@media (max-width: 768px) {
		.desktop-nav {
			display: none;
		}

		.mobile-menu-button {
			display: block;
		}

		.site-title {
			font-size: 1.2rem;
		}
	}
</style>
