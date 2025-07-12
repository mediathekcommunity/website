<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let totalMedia = 0;
  let totalChannels = 0;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    await fetchDashboardData();
  });

  async function fetchDashboardData() {
    try {
      const mediaResponse = await fetch('/api/media');
      const channelResponse = await fetch('/api/channels');

      if (!mediaResponse.ok || !channelResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const mediaData = await mediaResponse.json();
      const channelData = await channelResponse.json();

      totalMedia = mediaData.length;
      totalChannels = channelData.length;

    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

  {#if loading}
    <p>Loading dashboard data...</p>
  {:else if error}
    <p class="text-red-500">Error: {error}</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Total Media</h2>
          <p class="text-4xl font-bold">{totalMedia}</p>
        </div>
      </div>
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Total Channels</h2>
          <p class="text-4xl font-bold">{totalChannels}</p>
        </div>
      </div>
    </div>

    <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
    <div class="flex flex-wrap gap-4">
      <a href="/admin/add" class="btn btn-primary">Add New Media</a>
      <a href="/admin/channels/add" class="btn btn-secondary">Add New Channel</a>
    </div>
  {/if}
</div>