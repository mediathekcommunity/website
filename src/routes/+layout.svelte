<script>
  import "../app.css";
  import Footer from "$lib/components/Footer.svelte";
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';

  let { children } = $props();

  const desktopDrawerOpen = writable(false);
  const isMobileMenuOpen = writable(false);

  function toggleMobileMenu() {
    isMobileMenuOpen.update((value) => !value);
  }

  function toggleDesktopDrawer() {
    desktopDrawerOpen.update((value) => !value);
  }

  // Check if current page is an admin page
  const isAdminPage = $derived($page.route.id?.startsWith('/admin'));
</script>

<div class="drawer">
  <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Navbar -->
    <div
      class="navbar bg-base-300 header w-full navbar-glass"
    >
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
          <span class="badge badge-primary text-white">v0.11</span>
        </h1>
      </div>

      <div class="hidden flex-none lg:block">
        <ul class="menu menu-horizontal">
          <!-- Navbar menu content here -->
          <li><a href="/">Home</a></li>
          <li><a href="/movies">Movies</a></li>
          <li><a href="/series">TV Shows</a></li>
          <li><a href="/youth">Youth</a></li>
          <li><a href="/4k">UHD</a></li>
        </ul>
      </div>
    </div>
    
    <!-- Sample Data Banner (hidden on admin pages) -->
    {#if !isAdminPage}
    <div class="sample-data-banner">
      <div class="container mx-auto px-4 py-2 text-center">
        <div class="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="h-6 w-6 shrink-0 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>All current data is sample data for demonstration purposes</span>
        </div>
      </div>
    </div>
    {/if}
    
    <!-- Page content here -->
    <main class:admin-page={isAdminPage}>
      {@render children()}
    </main>
  </div>
  <div class="drawer-side z-50">
    <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu bg-base-200 min-h-full w-80 p-4 pt-12">
      <!-- Sidebar content here -->
      <li><a href="/">Home</a></li>
      <li><a href="/movies">Movies</a></li>
      <li><a href="/series">TV Shows</a></li>
      <li><a href="/youth">Youth</a></li>
      <li><a href="/4k">UHD</a></li>
    </ul>
  </div>
</div>

<Footer />

<style>
  /* Layout-Styling */
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

  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: all 0.3s ease;
    background-color: rgba(20, 20, 20, 0.9);
  }
  .navbar-glass {
    background-color: rgba(20, 20, 20, 0.9);
  }

  .sample-data-banner {
    position: fixed;
    top: 4rem; /* Adjust based on navbar height */
    left: 0;
    right: 0;
    z-index: 999;
    background-color: rgba(20, 20, 20, 0.9);
    border-bottom: 1px solid hsl(var(--bc) / 0.2);
  }

  .sample-data-banner .alert {
    margin: 0;
    border-radius: 0;
    background-color: hsl(var(--in));
    color: hsl(var(--inc));
    border: none;
  }

  /* Adjust main content to account for banner */
  main {
    padding-top: 6rem; /* Navbar + banner height */
  }

  /* Admin pages don't have banner, so less padding */
  main.admin-page {
    padding-top: 4rem; /* Just navbar height */
  }

  @media (max-width: 768px) {
    main {
      padding-top: 6rem;
    }
    
    main.admin-page {
      padding-top: 4rem;
    }
  }
</style>
