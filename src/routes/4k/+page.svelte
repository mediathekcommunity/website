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

  let hero4kMedia: MediaItem[] = [];
  let other4kMedia: MediaItem[] = [];
  let loading: boolean = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/media');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allMedia: MediaItem[] = await response.json();
      const fourkMediaData: MediaItem[] = allMedia.filter((item: MediaItem) => item.quality === '4K');

      hero4kMedia = fourkMediaData.slice(0, 5);
      other4kMedia = fourkMediaData;

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
  {#if hero4kMedia.length > 0}
    <MediaCard heroItems={hero4kMedia} />
  {/if}

  {#if other4kMedia.length > 0}
    <h1 class="text-3xl font-bold my-4 px-4">All 4K Content</h1>
    {#if loading}
      <p class="px-4">Loading...</p>
    {:else if error}
      <p class="px-4">Error: {error}</p>
    {:else}
      <div class="embla" use:EmblaCarouselSvelte={{ options: { loop: false, slidesToScroll: 'auto', containScroll: 'trimSnaps' }, plugins: [Autoplay()] }}>
        <div class="embla__container">
          {#each other4kMedia as mediaItem (mediaItem.id)}
            <div class="embla__slide">
              <MediaCarouselCard mediaItem={mediaItem} />
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {:else}
    <h1 class="text-3xl font-bold my-4 px-4">4K Content</h1>
    {#if loading}
      <p class="px-4">Loading...</p>
    {:else if error}
      <p class="px-4">Error: {error}</p>
    {:else}
      <p class="px-4">No 4K content found.</p>
    {/if}
  {/if}
</main>

<style>
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