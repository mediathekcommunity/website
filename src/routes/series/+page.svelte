<script lang="ts">
  import { onMount } from 'svelte';
  import MediaCard from '$lib/components/MediaCard.svelte';
  import MediaCarouselCard from '$lib/components/MediaCarouselCard.svelte';
  import EmblaCarouselSvelte from 'embla-carousel-svelte';
  import Autoplay from 'embla-carousel-autoplay';

  interface MediaItem {
    id: string;
    type: 'movie' | 'series' | 'music' | string;
    title: string;
    description?: string;
    broadcast_company?: string;
    backdrop_url?: string;
    poster_url?: string;
    genre?: string;
    release_date_year?: string;
    cast_crew?: string;
    orgtitle?: string;
    quality?: '4K' | 'fhd' | 'hd' | string;
  }

  let heroSeries: MediaItem[] = [];
  let otherSeries: MediaItem[] = [];
  let loading: boolean = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/media');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allMedia: MediaItem[] = await response.json();
      const seriesData: MediaItem[] = allMedia.filter((item: MediaItem) => item.type === 'series');

      // Take the first few series for the hero section
      heroSeries = seriesData.slice(0, 5); // Adjust the number as needed
      // Display all series in the grid below the hero section
      otherSeries = seriesData;
    } catch (e: unknown) {
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = 'An unknown error occurred';
      }
    } finally {
      loading = false;
    }
  });
</script>

<main>
  {#if heroSeries.length > 0}
    <MediaCard heroItems={heroSeries} />
  {/if}

  {#if otherSeries.length > 0}
    <h1 class="text-3xl font-bold my-4 px-4">All Series</h1>
    {#if loading}
      <p class="px-4">Loading...</p>
    {:else if error}
      <p class="px-4">Error: {error}</p>
    {:else}
      <div class="embla" use:EmblaCarouselSvelte={{ options: { loop: false, slidesToScroll: 'auto', containScroll: 'trimSnaps' }, plugins: [] }}>
        <div class="embla__container">
          {#each otherSeries as seriesItem (seriesItem.id)}
            <div class="embla__slide">
              <MediaCarouselCard mediaItem={seriesItem} />
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {:else}
    <h1 class="text-3xl font-bold my-4 px-4">Series</h1>
    {#if loading}
      <p class="px-4">Loading...</p>
    {:else if error}
      <p class="px-4">Error: {error}</p>
    {:else}
      <p class="px-4">No series found.</p>
    {/if}
  {/if}
</main>

<style>
  main {
    /* Removed padding-top as per user's request */
  }
  .embla {
    overflow: hidden;
    margin: 0;
    padding: 0 1rem;
  }

  .embla__container {
    display: flex;
    gap: 1rem;
  }

  .embla__slide {
    flex: 0 0 auto;
    min-width: 0;
    padding: 0;
  }

  /* Responsive slide counts for carousels */
  @media (min-width: 640px) {
    .embla__slide {
      flex: 0 0 33.333%; /* 3 slides per view on medium screens */
    }
  }

  @media (min-width: 1024px) {
    .embla__slide {
      flex: 0 0 25%; /* 4 slides per view on large screens */
    }
  }

  @media (min-width: 1280px) {
    .embla__slide {
      flex: 0 0 20%; /* 5 slides per view on extra large screens */
    }
  }
</style>