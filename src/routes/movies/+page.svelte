<script lang="ts">
  import { onMount } from 'svelte';
  import MediaCard from '$lib/components/MediaCard.svelte';
  import MediaCarouselCard from '$lib/components/MediaCarouselCard.svelte';
  import EmblaCarouselSvelte from 'embla-carousel-svelte';
  import Autoplay from 'embla-carousel-autoplay';

  interface MediaItem {
    id: string; // Changed to string to match HeroItem
    type: 'movie' | 'series' | 'music' | string;
    title: string;
    description?: string;
    broadcast_company?: string;
    thumbnail_url?: string;
    genre?: string;
    release_date_year?: string; // Changed to string to match HeroItem
    cast_crew?: string;
    orgtitle?: string;
    quality?: '4K' | 'fhd' | 'hd' | string;
  }

  let heroMovies: MediaItem[] = [];
  let otherMovies: MediaItem[] = [];
  let loading: boolean = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/media');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allMedia: MediaItem[] = await response.json();
      const moviesData: MediaItem[] = allMedia.filter((item: MediaItem) => item.type === 'movie');

      // Take the first few movies for the hero section
      heroMovies = moviesData.slice(0, 5); // Adjust the number as needed
      // Display all movies in the grid below the hero section
      otherMovies = moviesData;
    } catch (e: unknown) { // Explicitly type 'e' as unknown
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
  {#if heroMovies.length > 0}
    <MediaCard heroItems={heroMovies} />
  {/if}

  {#if otherMovies.length > 0}
    <h1 class="text-3xl font-bold my-4 px-4">All Movies</h1>
    {#if loading}
      <p class="px-4">Loading...</p>
    {:else if error}
      <p class="px-4">Error: {error}</p>
    {:else}
      <div class="embla" use:EmblaCarouselSvelte={{ options: { loop: false, slidesToScroll: 'auto', containScroll: 'trimSnaps' }, plugins: [] }}>
        <div class="embla__container">
          {#each otherMovies as movie (movie.id)}
            <div class="embla__slide">
              <MediaCarouselCard mediaItem={movie} />
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {:else}
    <h1 class="text-3xl font-bold my-4 px-4">Movies</h1>
    {#if loading}
      <p class="px-4">Loading...</p>
    {:else if error}
      <p class="px-4">Error: {error}</p>
    {:else}
      <p class="px-4">No movies found.</p>
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