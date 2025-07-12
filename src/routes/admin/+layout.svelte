<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';

  const { children }: { children: Snippet } = $props();

  let drawerOpen = true; // Default to open for desktop, will be controlled by CSS for mobile

  onMount(() => {
    // Close drawer on navigation
    const unsubscribe = page.subscribe(() => {
      // On navigation, ensure drawer is closed on mobile, open on desktop
      if (window.innerWidth < 1024) { // Tailwind's 'lg' breakpoint is 1024px
        drawerOpen = false;
      } else {
        drawerOpen = true;
      }
    });
    return unsubscribe;
  });
</script>

<div class="drawer lg:drawer-open">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
  <div class="drawer-content flex flex-col pt-16"> <!-- Added pt-16 for fixed navbar -->
    <!-- Page content here -->
    <div class="navbar bg-base-100 fixed top-0 w-full z-10"> <!-- Changed to fixed -->
      <div class="flex-none lg:hidden">
        <label for="my-drawer-2" aria-label="open sidebar" class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
      </div>
      <div class="flex-1 px-2 mx-2">Admin Panel</div>
      <div class="flex-none hidden lg:block">
        <!-- Navbar menu content here -->
      </div>
    </div>
    <main class="flex-grow p-4 w-full"> <!-- Removed pt-16 -->
         {@render children()}
     </main>
  </div>
  <div class="drawer-side pt-16"> <!-- Added pt-16 for fixed navbar -->
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <!-- Sidebar content here -->
      <li><a href="/admin">Dashboard</a></li>
      <li><a href="/admin/media">Manage Media</a></li>
      <li><a href="/admin/add">Add Media</a></li>
      <li><a href="/admin/channels">Manage Channels</a></li>
      <li><a href="/admin/channels/add">Add Channel</a></li>
    </ul>
  </div>
</div>