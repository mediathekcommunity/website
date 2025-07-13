<script lang="ts">
  import { onMount } from 'svelte';
  import MediaCard from '$lib/components/MediaCard.svelte';
  import MediaCarouselCard from '$lib/components/MediaCarouselCard.svelte'; // Changed from MediaItemCard
  import CountrySlider from '$lib/components/CountrySlider.svelte';
  import EmblaCarouselSvelte from 'embla-carousel-svelte';
  import Autoplay from 'embla-carousel-autoplay';
  import { groupByBroadcastCompany } from '$lib/utils';

  let allMedia: any[] = [];
  let heroMedia: any[] = [];
  let recentAll: any[] = [];
  let recentSeries: any[] = [];
  let recentMovies: any[] = [];
  let groupedByCompany: { [key: string]: any[] } = {}; // New state for grouped data
  let companyList: string[] = []; // New state for company list
  let geo: string = 'US'; // Placeholder for geo
  let loading: boolean = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/media');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allMedia = await response.json();

      heroMedia = allMedia.slice(0, 3); // Top 3 for hero images
      recentAll = allMedia.slice(0, 3); // Most recent overall
      recentSeries = allMedia.filter(m => m.type === 'series').slice(0, 3); // Most recent series
      recentMovies = allMedia.filter(m => m.type === 'movie').slice(0, 3); // Most recent movies

      groupedByCompany = groupByBroadcastCompany(allMedia);
      companyList = Object.keys(groupedByCompany).sort();

      console.log('Hero Media Backdrop URLs:', heroMedia.map(item => item.backdrop_url));
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else}
    <MediaCard heroItems={heroMedia} />

    <div class="content-section px-4 sm:px-6 lg:px-8 pb-8">
      <section class="recent-section mb-8">
        <h2 class="section-title">Most Recent</h2>
        <div class="embla" use:EmblaCarouselSvelte={{ options: { loop: false, slidesToScroll: 1, align: "start",containScroll: 'trimSnaps' }, plugins: [] }}>
          <div class="embla__container">
            {#each recentAll as mediaItem (mediaItem.id)}
              <div class="embla__slide">
                <MediaCarouselCard {mediaItem} />
              </div>
            {/each}
          </div>
        </div>
      </section>

      {#if recentSeries.length > 0}
        <section class="series-section mb-8">
          <h2 class="section-title">Recent Series</h2>
          <div class="embla" use:EmblaCarouselSvelte={{ options: { loop: false, slidesToScroll: 1, containScroll: 'trimSnaps' }, plugins: [] }}>
            <div class="embla__container">
              {#each recentSeries as mediaItem (mediaItem.id)}
                <div class="embla__slide">
                  <MediaCarouselCard {mediaItem} />
                </div>
              {/each}
            </div>
          </div>
        </section>
      {/if}

      {#if recentMovies.length > 0}
        <section class="movies-section">
          <h2 class="section-title">Recent Movies</h2>
          <div class="embla" use:EmblaCarouselSvelte={{ options: { loop: false, slidesToScroll: 1, containScroll: 'trimSnaps' }, plugins: [] }}>
            <div class="embla__container">
              {#each recentMovies as mediaItem (mediaItem.id)}
                <div class="embla__slide">
                  <MediaCarouselCard {mediaItem} />
                </div>
              {/each}
            </div>
          </div>
        </section>
      {/if}

      <CountrySlider langlist={companyList} langdata={groupedByCompany} {geo} />
    </div>
  {/if}

<style>
  .content-section {
    margin-top: -2rem;
    position: relative;
    z-index: 10;
    background: linear-gradient(to bottom, transparent, rgb(17, 17, 17) 15%);
    padding-top: 3rem;
    min-height: 40dvh;
  }

  .section-title {
    padding: 0 1rem 0.5rem 1rem; /* Default padding for h2 elements */
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

  /* Media queries from oldsite/routes/[[id]]/+page.svelte for content-section */
  @media (max-width: 640px) {
    .content-section {
      margin-top: -1.5rem;
      padding-top: 2rem;
    }

    .section-title {
      padding: 1.25rem 1.25rem 0.625rem 1.25rem;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .content-section {
      margin-top: -2rem;
      padding-top: 2.5rem;
      padding-left: 0rem !important;
    }

    /* The section-title padding for 641px to 1024px is already defined in the default .section-title */
  }

  @media (min-width: 1025px) {
    .content-section {
      margin-top: -2rem;
      padding-top: 3rem;
    }

    .section-title {
      padding: 1.25rem 1.25rem 0.625rem 1.25rem;
    }
  }
</style>
